'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ModuleType, ModuleStatus, FeatureAccessLevel } from '@prisma/client'
import type { JsonValue } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'
import { unstable_cache } from 'next/cache'
import { recordDailyActivity } from './streak.action'

interface QuizAnswer {
    questionIndex: number;
    userAnswer: number | string;
    correct: number | string;
    isCorrect: boolean;
}

// Cache foundation modules for 7 days
const getCachedFoundationModules = unstable_cache(
    async (language: string) => {
        return await prisma.foundationModule.findMany({
            where: {
                language: language,
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        })
    },
    ['foundation-modules'],
    {
        tags: ['foundation-modules'],
        revalidate: 604800 // 7 days
    }
)

// Get user's selected language and foundation progress
export async function getUserFoundationProgress() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                selectedLanguage: true,
                selectedLevel: true,
                selectedGoal: true,
                onboardingCompleted: true
            }
        })

        if (!user?.selectedLanguage) {
            return { success: false, error: 'No language selected. Please complete onboarding.' }
        }

        // Get cached foundation modules for the selected language
        const modules = await getCachedFoundationModules(user.selectedLanguage)

        // Get user's progress for these modules
        const moduleProgress = await prisma.moduleProgress.findMany({
            where: {
                userId: session.user.id,
                language: user.selectedLanguage
            },
            include: {
                module: true
            }
        })

        // Calculate overall progress
        const totalModules = modules.length
        const completedModules = moduleProgress.filter(p => p.status === 'COMPLETED').length
        const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

        return {
            success: true,
            data: {
                user: {
                    selectedLanguage: user.selectedLanguage,
                    selectedLevel: user.selectedLevel,
                    selectedGoal: user.selectedGoal,
                    onboardingCompleted: user.onboardingCompleted
                },
                modules,
                moduleProgress,
                stats: {
                    totalModules,
                    completedModules,
                    overallProgress
                }
            }
        }
    } catch (error) {
        console.error('Error fetching foundation progress:', error)
        return { success: false, error: 'Failed to fetch progress' }
    }
}

// Get specific module with detailed content
export async function getModuleDetails(language: string, moduleType: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const module = await prisma.foundationModule.findFirst({
            where: {
                language: language,
                moduleType: moduleType as ModuleType,
                isActive: true
            }
        })

        if (!module) {
            return { success: false, error: 'Module not found' }
        }

        const progress = await prisma.moduleProgress.findFirst({
            where: {
                userId: session.user.id,
                moduleId: module.id
            }
        })

        return {
            success: true,
            data: {
                module,
                progress
            }
        }
    } catch (error) {
        console.error('Error fetching module details:', error)
        return { success: false, error: 'Failed to fetch module details' }
    }
}

// Update user's language preference
export async function updateLanguagePreference(language: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { selectedLanguage: language }
        })

        revalidatePath('/foundations')
        revalidatePath('/profile')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Error updating language preference:', error)
        return { success: false, error: 'Failed to update language preference' }
    }
}

// Update module progress
export async function updateModuleProgress(moduleId: string, progressData: {
    status?: ModuleStatus
    progressPercent?: number
    currentSection?: string
    timeSpent?: number
    bestScore?: number
    completedSections?: string
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const module = await prisma.foundationModule.findUnique({
            where: { id: moduleId }
        })

        if (!module) {
            return { success: false, error: 'Module not found' }
        }

        interface ProgressUpdateData {
            status?: ModuleStatus;
            progressPercent?: number;
            currentSection?: string;
            timeSpent?: number;
            bestScore?: number;
            completedSections?: string;
            lastAccessedAt: Date;
            updatedAt: Date;
            completedAt?: Date;
        }

        const updateData: ProgressUpdateData = {
            ...progressData,
            lastAccessedAt: new Date(),
            updatedAt: new Date()
        }

        if (progressData.status === 'COMPLETED') {
            updateData.completedAt = new Date()
        }

        await prisma.moduleProgress.upsert({
            where: {
                userId_moduleId: {
                    userId: session.user.id,
                    moduleId: moduleId
                }
            },
            update: updateData,
            create: {
                userId: session.user.id,
                moduleId: moduleId,
                language: module.language,
                ...updateData
            }
        })

        // Record daily activity for streak tracking
        try {
            await recordDailyActivity({
                moduleProgress: 1,
                timeSpent: progressData.timeSpent || 0,
                creditsEarned: progressData.status === 'COMPLETED' ? module.creditsReward : 0
            })
        } catch (error) {
            console.error('Error recording daily activity:', error)
            // Don't fail the main operation if activity recording fails
        }

        revalidatePath('/foundations')
        return { success: true }
    } catch (error) {
        console.error('Error updating module progress:', error)
        return { success: false, error: 'Failed to update progress' }
    }
}

// Submit quiz attempt
export async function submitQuizAttempt(moduleId: string, quizData: {
    quizType: string
    score: number
    totalQuestions: number
    correctAnswers: number
    timeSpent: number
    answers: QuizAnswer[]
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const module = await prisma.foundationModule.findUnique({
            where: { id: moduleId }
        })

        if (!module) {
            return { success: false, error: 'Module not found' }
        }

        const passed = quizData.score >= module.requiredScore

        await prisma.quizAttempt.create({
            data: {
                userId: session.user.id,
                moduleId: moduleId,
                language: module.language,
                quizType: 'MULTIPLE_CHOICE' as any,
                score: quizData.score,
                totalQuestions: quizData.totalQuestions,
                correctAnswers: quizData.correctAnswers,
                timeSpent: quizData.timeSpent,
                answers: JSON.parse(JSON.stringify(quizData.answers)),
                passed
            }
        })

        // Update module progress if quiz passed
        if (passed) {
            await updateModuleProgress(moduleId, {
                status: 'COMPLETED',
                progressPercent: 100,
                bestScore: quizData.score
            })

            // Award credits
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    credits: { increment: module.creditsReward }
                }
            })
        }

        // Record daily activity for quiz completion
        try {
            await recordDailyActivity({
                timeSpent: quizData.timeSpent,
                creditsEarned: passed ? module.creditsReward : 0
            })
        } catch (error) {
            console.error('Error recording daily activity:', error)
            // Don't fail the main operation if activity recording fails
        }

        return { success: true, passed, creditsAwarded: passed ? module.creditsReward : 0 }
    } catch (error) {
        console.error('Error submitting quiz attempt:', error)
        return { success: false, error: 'Failed to submit quiz' }
    }
}

// Check if user has access to major features
export async function checkFeatureAccess() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { selectedLanguage: true }
        })

        if (!user?.selectedLanguage) {
            return { success: false, hasAccess: false, reason: 'No language selected' }
        }

        // Check foundation module completion
        const foundationModules = await getCachedFoundationModules(user.selectedLanguage)

        const completedModules = await prisma.moduleProgress.count({
            where: {
                userId: session.user.id,
                language: user.selectedLanguage,
                status: 'COMPLETED'
            }
        })

        const foundationComplete = completedModules >= foundationModules.length && foundationModules.length > 0

        return {
            success: true,
            hasAccess: foundationComplete,
            reason: foundationComplete ? 'Access granted' : 'Complete foundation modules first',
            progress: {
                completed: completedModules,
                total: foundationModules.length,
                percentage: foundationModules.length > 0 ? Math.round((completedModules / foundationModules.length) * 100) : 0
            }
        }
    } catch (error) {
        console.error('Error checking feature access:', error)
        return { success: false, error: 'Failed to check access' }
    }
}

// Initialize foundation modules for a language (admin function)
export async function initializeFoundationModules(language: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        // Check if modules already exist
        const existingModules = await prisma.foundationModule.findMany({
            where: { language }
        })

        if (existingModules.length > 0) {
            return { success: true, message: 'Modules already exist' }
        }

        // Define module templates based on language
        const moduleTemplates = getModuleTemplates(language)

        // Create modules
        await prisma.foundationModule.createMany({
            data: moduleTemplates.map(template => ({
                ...template,
                content: JSON.parse(JSON.stringify(template.content))
            }))
        })

        return { success: true, message: 'Foundation modules initialized' }
    } catch (error) {
        console.error('Error initializing modules:', error)
        return { success: false, error: 'Failed to initialize modules' }
    }
}

// Get module templates based on language
function getModuleTemplates(language: string) {
    const baseModules = [
        {
            moduleType: ModuleType.SCRIPT_WRITING,
            language,
            title: getModuleTitle(language, ModuleType.SCRIPT_WRITING),
            description: getModuleDescription(language, ModuleType.SCRIPT_WRITING),
            content: getModuleContent(language, ModuleType.SCRIPT_WRITING),
            orderIndex: 1,
            requiredScore: 85,
            creditsReward: 100
        },
        {
            moduleType: ModuleType.PHONETICS_PRONUNCIATION,
            language,
            title: getModuleTitle(language, ModuleType.PHONETICS_PRONUNCIATION),
            description: getModuleDescription(language, ModuleType.PHONETICS_PRONUNCIATION),
            content: getModuleContent(language, ModuleType.PHONETICS_PRONUNCIATION),
            orderIndex: 2,
            requiredScore: 80,
            creditsReward: 100
        },
        {
            moduleType: ModuleType.VOCABULARY_BUILDING,
            language,
            title: getModuleTitle(language, ModuleType.VOCABULARY_BUILDING),
            description: getModuleDescription(language, ModuleType.VOCABULARY_BUILDING),
            content: getModuleContent(language, ModuleType.VOCABULARY_BUILDING),
            orderIndex: 3,
            requiredScore: 75,
            creditsReward: 100
        },
        {
            moduleType: ModuleType.GRAMMAR_FUNDAMENTALS,
            language,
            title: getModuleTitle(language, ModuleType.GRAMMAR_FUNDAMENTALS),
            description: getModuleDescription(language, ModuleType.GRAMMAR_FUNDAMENTALS),
            content: getModuleContent(language, ModuleType.GRAMMAR_FUNDAMENTALS),
            orderIndex: 4,
            requiredScore: 75,
            creditsReward: 100
        },
        {
            moduleType: ModuleType.CULTURAL_CONTEXT,
            language,
            title: getModuleTitle(language, ModuleType.CULTURAL_CONTEXT),
            description: getModuleDescription(language, ModuleType.CULTURAL_CONTEXT),
            content: getModuleContent(language, ModuleType.CULTURAL_CONTEXT),
            orderIndex: 5,
            requiredScore: 70,
            creditsReward: 100
        }
    ]

    return baseModules
}

function getModuleTitle(language: string, moduleType: ModuleType): string {
    const titles: Record<string, Record<ModuleType, string>> = {
        russian: {
            SCRIPT_WRITING: 'Cyrillic Alphabet Mastery',
            PHONETICS_PRONUNCIATION: 'Russian Phonetics & Pronunciation',
            VOCABULARY_BUILDING: 'Essential Russian Vocabulary',
            GRAMMAR_FUNDAMENTALS: 'Russian Grammar Basics',
            CULTURAL_CONTEXT: 'Russian Culture & Etiquette'
        },
        japanese: {
            SCRIPT_WRITING: 'Hiragana, Katakana & Basic Kanji',
            PHONETICS_PRONUNCIATION: 'Japanese Phonetics & Pitch Accent',
            VOCABULARY_BUILDING: 'Essential Japanese Vocabulary',
            GRAMMAR_FUNDAMENTALS: 'Japanese Grammar Fundamentals',
            CULTURAL_CONTEXT: 'Japanese Culture & Social Etiquette'
        },
        korean: {
            SCRIPT_WRITING: 'Hangul Writing System',
            PHONETICS_PRONUNCIATION: 'Korean Phonetics & Pronunciation',
            VOCABULARY_BUILDING: 'Essential Korean Vocabulary',
            GRAMMAR_FUNDAMENTALS: 'Korean Grammar Basics',
            CULTURAL_CONTEXT: 'Korean Culture & Hierarchy'
        }
    }

    return titles[language]?.[moduleType] || `${moduleType} for ${language}`
}

function getModuleDescription(language: string, moduleType: ModuleType): string {
    const descriptions: Record<string, Record<ModuleType, string>> = {
        russian: {
            SCRIPT_WRITING: 'Master the 33 letters of the Cyrillic alphabet, including uppercase, lowercase, and handwriting practice.',
            PHONETICS_PRONUNCIATION: 'Learn Russian sound system, stress patterns, and pronunciation rules for clear communication.',
            VOCABULARY_BUILDING: 'Build a foundation of 1000+ essential Russian words for daily communication.',
            GRAMMAR_FUNDAMENTALS: 'Understand Russian case system, verb conjugation, and sentence structure basics.',
            CULTURAL_CONTEXT: 'Learn Russian social etiquette, cultural norms, and communication styles.'
        },
        japanese: {
            SCRIPT_WRITING: 'Master Hiragana (46), Katakana (46), and 50 essential Kanji characters with proper stroke order.',
            PHONETICS_PRONUNCIATION: 'Learn Japanese mora system, pitch accent, and natural pronunciation patterns.',
            VOCABULARY_BUILDING: 'Build essential vocabulary for daily life, work, and social interactions in Japanese.',
            GRAMMAR_FUNDAMENTALS: 'Understand Japanese sentence structure, particles, and verb forms.',
            CULTURAL_CONTEXT: 'Learn Japanese social hierarchy, keigo (honorific language), and cultural practices.'
        },
        korean: {
            SCRIPT_WRITING: 'Master Hangul consonants, vowels, and syllable block formation for reading and writing.',
            PHONETICS_PRONUNCIATION: 'Learn Korean sound system, consonant tensing, and pronunciation rules.',
            VOCABULARY_BUILDING: 'Build essential Korean vocabulary for daily communication and social interaction.',
            GRAMMAR_FUNDAMENTALS: 'Understand Korean sentence structure, honorific system, and verb conjugation.',
            CULTURAL_CONTEXT: 'Learn Korean social hierarchy, age-based respect system, and cultural customs.'
        }
    }

    return descriptions[language]?.[moduleType] || `Learn ${moduleType} for ${language}`
}

interface ModuleContentStructure {
    sections: Array<{
        id: number;
        title: string;
        type: string;
        content: Record<string, unknown>;
        duration: number;
    }>;
    totalDuration: number;
    difficulty: string;
    estimatedCompletionTime?: string;
}

function getModuleContent(language: string, moduleType: ModuleType): ModuleContentStructure {
    // Return detailed content based on language and module type
    if (language === 'russian' && moduleType === ModuleType.SCRIPT_WRITING) {
        return getRussianCyrillicContent()
    } else if (language === 'japanese' && moduleType === ModuleType.SCRIPT_WRITING) {
        return getJapaneseScriptContent()
    } else if (language === 'korean' && moduleType === ModuleType.SCRIPT_WRITING) {
        return getKoreanHangulContent()
    }
    
    // Return basic structure for other modules
    return {
        sections: [
            {
                id: 1,
                title: 'Introduction',
                type: 'lesson',
                content: {
                    overview: 'Introduction to ${moduleType} in ${language}',
                    keyPoints: [
                        'Cyrillic has 33 letters',
                        'Some letters look like Latin but sound different',
                        'Each letter has uppercase and lowercase forms',
                        'Used in Russian, Bulgarian, Serbian, and other languages'
                    ]
                },
                duration: 10
            },
            {
                id: 2,
                title: 'Practice Exercises',
                type: 'exercise',
                content: {
                    description: 'Interactive practice exercises',
                    exercises: []
                },
                duration: 20
            },
            {
                id: 3,
                title: 'Assessment',
                type: 'quiz',
                content: {
                    description: 'Module assessment quiz',
                    questions: [],
                    passingScore: 70
                },
                duration: 15
            }
        ],
        totalDuration: 45,
        difficulty: 'beginner'
    }
}

function getRussianCyrillicContent() {
    return {
        sections: [
            {
                id: 1,
                title: 'Introduction to Cyrillic',
                type: 'lesson',
                content: {
                    overview: 'Learn about the history and structure of the Cyrillic alphabet',
                    keyPoints: [
                        'Cyrillic has 33 letters',
                        'Some letters look like Latin but sound different',
                        'Each letter has uppercase and lowercase forms',
                        'Used in Russian, Bulgarian, Serbian, and other languages'
                    ]
                },
                duration: 10
            },
            {
                id: 2,
                title: 'Vowels (Гласные)',
                type: 'interactive-lesson',
                content: {
                    letters: [
                        { cyrillic: 'А', latin: 'A', sound: 'ah', examples: ['мама', 'папа'] },
                        { cyrillic: 'Е', latin: 'E', sound: 'yeh', examples: ['лето', 'мне'] },
                        { cyrillic: 'Ё', latin: 'Yo', sound: 'yo', examples: ['ёлка', 'всё'] },
                        { cyrillic: 'И', latin: 'I', sound: 'ee', examples: ['мир', 'они'] },
                        { cyrillic: 'О', latin: 'O', sound: 'oh', examples: ['дом', 'окно'] },
                        { cyrillic: 'У', latin: 'U', sound: 'oo', examples: ['утро', 'рука'] },
                        { cyrillic: 'Ы', latin: 'Y', sound: 'ih', examples: ['сын', 'мы'] },
                        { cyrillic: 'Э', latin: 'E', sound: 'eh', examples: ['это', 'эхо'] },
                        { cyrillic: 'Ю', latin: 'Yu', sound: 'yoo', examples: ['юг', 'люди'] },
                        { cyrillic: 'Я', latin: 'Ya', sound: 'yah', examples: ['я', 'моя'] }
                    ]
                },
                duration: 25
            },
            {
                id: 3,
                title: 'Consonants (Согласные) - Part 1',
                type: 'interactive-lesson',
                content: {
                    letters: [
                        { cyrillic: 'Б', latin: 'B', sound: 'b', examples: ['брат', 'хлеб'] },
                        { cyrillic: 'В', latin: 'V', sound: 'v', examples: ['вода', 'дерево'] },
                        { cyrillic: 'Г', latin: 'G', sound: 'g', examples: ['город', 'друг'] },
                        { cyrillic: 'Д', latin: 'D', sound: 'd', examples: ['дом', 'сад'] },
                        { cyrillic: 'Ж', latin: 'Zh', sound: 'zh', examples: ['жизнь', 'муж'] },
                        { cyrillic: 'З', latin: 'Z', sound: 'z', examples: ['зима', 'глаз'] },
                        { cyrillic: 'К', latin: 'K', sound: 'k', examples: ['кот', 'рука'] },
                        { cyrillic: 'Л', latin: 'L', sound: 'l', examples: ['лето', 'стол'] }
                    ]
                },
                duration: 25
            },
            {
                id: 4,
                title: 'Consonants (Согласные) - Part 2',
                type: 'interactive-lesson',
                content: {
                    letters: [
                        { cyrillic: 'М', latin: 'M', sound: 'm', examples: ['мама', 'дом'] },
                        { cyrillic: 'Н', latin: 'N', sound: 'n', examples: ['нос', 'окно'] },
                        { cyrillic: 'П', latin: 'P', sound: 'p', examples: ['папа', 'суп'] },
                        { cyrillic: 'Р', latin: 'R', sound: 'r', examples: ['рука', 'мир'] },
                        { cyrillic: 'С', latin: 'S', sound: 's', examples: ['сын', 'лес'] },
                        { cyrillic: 'Т', latin: 'T', sound: 't', examples: ['тут', 'кот'] },
                        { cyrillic: 'Ф', latin: 'F', sound: 'f', examples: ['фото', 'граф'] },
                        { cyrillic: 'Х', latin: 'Kh', sound: 'kh', examples: ['хлеб', 'тих'] }
                    ]
                },
                duration: 25
            },
            {
                id: 5,
                title: 'Special Letters & Sounds',
                type: 'interactive-lesson',
                content: {
                    letters: [
                        { cyrillic: 'Ц', latin: 'Ts', sound: 'ts', examples: ['цвет', 'отец'] },
                        { cyrillic: 'Ч', latin: 'Ch', sound: 'ch', examples: ['час', 'ночь'] },
                        { cyrillic: 'Ш', latin: 'Sh', sound: 'sh', examples: ['школа', 'наш'] },
                        { cyrillic: 'Щ', latin: 'Shch', sound: 'shch', examples: ['щука', 'площадь'] },
                        { cyrillic: 'Ъ', latin: 'Hard sign', sound: '', examples: ['объект', 'съел'] },
                        { cyrillic: 'Ь', latin: 'Soft sign', sound: '', examples: ['день', 'мать'] }
                    ]
                },
                duration: 20
            },
            {
                id: 6,
                title: 'Writing Practice',
                type: 'writing-exercise',
                content: {
                    exercises: [
                        { type: 'trace', letters: ['А', 'Б', 'В', 'Г', 'Д'] },
                        { type: 'copy', words: ['мама', 'папа', 'дом', 'кот'] },
                        { type: 'dictation', audio: true, words: ['вода', 'хлеб', 'рука', 'лето'] }
                    ]
                },
                duration: 30
            },
            {
                id: 7,
                title: 'Letter Recognition Game',
                type: 'game',
                content: {
                    gameType: 'letter-match',
                    levels: [
                        { name: 'Vowels', letters: ['А', 'Е', 'И', 'О', 'У'] },
                        { name: 'Common Consonants', letters: ['Б', 'В', 'Г', 'Д', 'М', 'Н', 'П', 'Р', 'С', 'Т'] },
                        { name: 'All Letters', letters: 'all' }
                    ]
                },
                duration: 20
            },
            {
                id: 8,
                title: 'Final Assessment',
                type: 'quiz',
                content: {
                    questions: [
                        {
                            type: 'multiple-choice',
                            question: 'Which letter makes the "ah" sound?',
                            options: ['А', 'Е', 'И', 'О'],
                            correct: 0
                        },
                        {
                            type: 'audio-recognition',
                            question: 'Select the letter you hear',
                            audio: 'russian-letter-b.mp3',
                            options: ['Б', 'В', 'П', 'Ф'],
                            correct: 0
                        },
                        {
                            type: 'writing',
                            question: 'Write the word "мама" in Cyrillic',
                            correct: 'мама'
                        }
                    ],
                    passingScore: 85
                },
                duration: 15
            }
        ],
        totalDuration: 170,
        difficulty: 'beginner',
        estimatedCompletionTime: '3-4 hours'
    }
}

function getJapaneseScriptContent() {
    return {
        sections: [
            {
                id: 1,
                title: 'Introduction to Japanese Writing',
                type: 'lesson',
                content: {
                    overview: 'Learn about the three Japanese writing systems',
                    keyPoints: [
                        'Hiragana: 46 basic characters for native Japanese words',
                        'Katakana: 46 characters for foreign words',
                        'Kanji: Chinese characters for meaning',
                        'All three are used together in modern Japanese'
                    ]
                },
                duration: 10
            },
            {
                id: 2,
                title: 'Hiragana - Basic Vowels',
                type: 'interactive-lesson',
                content: {
                    characters: [
                        { hiragana: 'あ', romaji: 'a', sound: 'ah' },
                        { hiragana: 'い', romaji: 'i', sound: 'ee' },
                        { hiragana: 'う', romaji: 'u', sound: 'oo' },
                        { hiragana: 'え', romaji: 'e', sound: 'eh' },
                        { hiragana: 'お', romaji: 'o', sound: 'oh' }
                    ]
                },
                duration: 20
            }
            // More sections would follow...
        ],
        totalDuration: 200,
        difficulty: 'beginner'
    }
}

function getKoreanHangulContent() {
    return {
        sections: [
            {
                id: 1,
                title: 'Introduction to Hangul',
                type: 'lesson',
                content: {
                    overview: 'Learn about the Korean writing system',
                    keyPoints: [
                        'Hangul has 24 basic letters (14 consonants, 10 vowels)',
                        'Letters combine to form syllable blocks',
                        'Each block represents one syllable',
                        'Created by King Sejong in 1443'
                    ]
                },
                duration: 10
            },
            {
                id: 2,
                title: 'Basic Vowels',
                type: 'interactive-lesson',
                content: {
                    vowels: [
                        { hangul: 'ㅏ', romaji: 'a', sound: 'ah' },
                        { hangul: 'ㅓ', romaji: 'eo', sound: 'uh' },
                        { hangul: 'ㅗ', romaji: 'o', sound: 'oh' },
                        { hangul: 'ㅜ', romaji: 'u', sound: 'oo' },
                        { hangul: 'ㅡ', romaji: 'eu', sound: 'eu' },
                        { hangul: 'ㅣ', romaji: 'i', sound: 'ee' }
                    ]
                },
                duration: 20
            }
            // More sections would follow...
        ],
        totalDuration: 180,
        difficulty: 'beginner'
    }
} 