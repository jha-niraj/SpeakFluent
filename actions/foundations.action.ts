'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ModuleType, ModuleStatus, FeatureAccessLevel } from '@prisma/client'
import { revalidatePath } from 'next/cache'

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

        // Get foundation modules for the selected language
        const modules = await prisma.foundationModule.findMany({
            where: {
                language: user.selectedLanguage,
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        })

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
        const foundationModules = await prisma.foundationModule.findMany({
            where: {
                language: user.selectedLanguage,
                isActive: true
            }
        })

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
            data: moduleTemplates
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

function getModuleContent(language: string, moduleType: ModuleType): any {
    // This would contain the actual module content structure
    // For now, returning a basic structure
    return {
        sections: [
            {
                id: 1,
                title: 'Introduction',
                type: 'lesson',
                content: `Introduction to ${moduleType} in ${language}`,
                duration: 10
            },
            {
                id: 2,
                title: 'Practice Exercises',
                type: 'exercise',
                content: 'Interactive practice exercises',
                duration: 20
            },
            {
                id: 3,
                title: 'Assessment',
                type: 'quiz',
                content: 'Module assessment quiz',
                duration: 15
            }
        ],
        totalDuration: 45,
        difficulty: 'beginner'
    }
} 