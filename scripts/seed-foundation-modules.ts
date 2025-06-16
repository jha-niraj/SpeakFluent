import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFoundationModules() {
    console.log('Starting to seed foundation modules...');

    try {
        // Delete existing modules first
        await prisma.foundationModule.deleteMany({});
        console.log('Cleared existing foundation modules');

        // Seed Russian modules
        const russianModules = [
            {
                moduleType: 'SCRIPT_WRITING',
                language: 'russian',
                title: 'Cyrillic Alphabet Mastery',
                description: 'Master the 33 letters of the Cyrillic alphabet, including uppercase, lowercase, and handwriting practice.',
                content: {
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
                            id: 5,
                            title: 'Letter Recognition Game',
                            type: 'game',
                            content: {
                                gameType: 'letter-match',
                                levels: [
                                    { name: 'Vowels', letters: ['А', 'Е', 'И', 'О', 'У'], difficulty: 1 },
                                    { name: 'Common Consonants', letters: ['Б', 'В', 'Г', 'Д', 'М', 'Н', 'П', 'Р', 'С', 'Т'], difficulty: 2 },
                                    { name: 'All Letters', letters: 'all', difficulty: 3 }
                                ]
                            },
                            duration: 20
                        },
                        {
                            id: 6,
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
                                        type: 'multiple-choice',
                                        question: 'What is the Latin equivalent of Б?',
                                        options: ['B', 'V', 'P', 'F'],
                                        correct: 0
                                    },
                                    {
                                        type: 'writing',
                                        question: 'Write the word "мама" in Cyrillic',
                                        correct: 'мама'
                                    },
                                    {
                                        type: 'multiple-choice',
                                        question: 'How many letters are in the Cyrillic alphabet?',
                                        options: ['26', '30', '33', '36'],
                                        correct: 2
                                    }
                                ],
                                passingScore: 85
                            },
                            duration: 15
                        }
                    ],
                    totalDuration: 125,
                    difficulty: 'beginner',
                    estimatedCompletionTime: '2-3 hours'
                },
                orderIndex: 1,
                requiredScore: 85,
                creditsReward: 100
            },
            {
                moduleType: 'PHONETICS_PRONUNCIATION',
                language: 'russian',
                title: 'Russian Phonetics & Pronunciation',
                description: 'Learn Russian sound system, stress patterns, and pronunciation rules for clear communication.',
                content: {
                    sections: [
                        {
                            id: 1,
                            title: 'Russian Sound System',
                            type: 'lesson',
                            content: {
                                overview: 'Understanding the unique aspects of Russian pronunciation',
                                keyPoints: [
                                    'Russian has 5 vowel phonemes but 10 vowel letters',
                                    'Consonants can be hard or soft (palatalized)',
                                    'Stress affects vowel pronunciation significantly',
                                    'Some consonants change pronunciation based on position'
                                ]
                            },
                            duration: 15
                        },
                        {
                            id: 2,
                            title: 'Stress Patterns',
                            type: 'interactive-lesson',
                            content: {
                                letters: [
                                    { cyrillic: 'мо́локо', latin: 'molóko', sound: 'milk', examples: [] },
                                    { cyrillic: 'до́м', latin: 'dom', sound: 'house', examples: [] },
                                    { cyrillic: 'стол', latin: 'stol', sound: 'table', examples: [] }
                                ]
                            },
                            duration: 20
                        }
                    ],
                    totalDuration: 35,
                    difficulty: 'beginner'
                },
                orderIndex: 2,
                requiredScore: 80,
                creditsReward: 100
            }
        ];

        // Seed Japanese modules
        const japaneseModules = [
            {
                moduleType: 'SCRIPT_WRITING',
                language: 'japanese',
                title: 'Hiragana, Katakana & Basic Kanji',
                description: 'Master Hiragana (46), Katakana (46), and 50 essential Kanji characters with proper stroke order.',
                content: {
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
                                    { hiragana: 'あ', latin: 'a', sound: 'ah', examples: [] },
                                    { hiragana: 'い', latin: 'i', sound: 'ee', examples: [] },
                                    { hiragana: 'う', latin: 'u', sound: 'oo', examples: [] },
                                    { hiragana: 'え', latin: 'e', sound: 'eh', examples: [] },
                                    { hiragana: 'お', latin: 'o', sound: 'oh', examples: [] }
                                ]
                            },
                            duration: 20
                        }
                    ],
                    totalDuration: 30,
                    difficulty: 'beginner'
                },
                orderIndex: 1,
                requiredScore: 85,
                creditsReward: 100
            }
        ];

        // Seed Korean modules
        const koreanModules = [
            {
                moduleType: 'SCRIPT_WRITING',
                language: 'korean',
                title: 'Hangul Writing System',
                description: 'Master Hangul consonants, vowels, and syllable block formation for reading and writing.',
                content: {
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
                                    { hangul: 'ㅏ', latin: 'a', sound: 'ah', examples: [] },
                                    { hangul: 'ㅓ', latin: 'eo', sound: 'uh', examples: [] },
                                    { hangul: 'ㅗ', latin: 'o', sound: 'oh', examples: [] },
                                    { hangul: 'ㅜ', latin: 'u', sound: 'oo', examples: [] },
                                    { hangul: 'ㅡ', latin: 'eu', sound: 'eu', examples: [] },
                                    { hangul: 'ㅣ', latin: 'i', sound: 'ee', examples: [] }
                                ]
                            },
                            duration: 20
                        }
                    ],
                    totalDuration: 30,
                    difficulty: 'beginner'
                },
                orderIndex: 1,
                requiredScore: 85,
                creditsReward: 100
            }
        ];

        // Create all modules
        const allModules = [...russianModules, ...japaneseModules, ...koreanModules];
        
        for (const moduleData of allModules) {
            await prisma.foundationModule.create({
                data: {
                    ...moduleData,
                    moduleType: moduleData.moduleType as any
                }
            });
        }

        console.log(`✅ Successfully seeded ${allModules.length} foundation modules`);
        console.log('Languages: Russian, Japanese, Korean');
        console.log('Module types: SCRIPT_WRITING, PHONETICS_PRONUNCIATION');

    } catch (error) {
        console.error('❌ Error seeding foundation modules:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeding
seedFoundationModules()
    .then(() => {
        console.log('🎉 Foundation modules seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });

export default seedFoundationModules; 