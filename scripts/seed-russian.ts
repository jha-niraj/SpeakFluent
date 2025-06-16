import { PrismaClient, ModuleType } from '@prisma/client';

const prisma = new PrismaClient();

const russianFoundationModules = [
    {
        moduleType: ModuleType.SCRIPT_WRITING,
        language: 'russian',
        title: 'Cyrillic Alphabet Mastery',
        description: 'Master the 33 letters of the Cyrillic alphabet, including uppercase, lowercase, and pronunciation.',
        orderIndex: 1,
        requiredScore: 85,
        creditsReward: 100,
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
                        ],
                        history: 'The Cyrillic script was developed in the 9th century by Saints Cyril and Methodius.',
                        importance: 'Mastering Cyrillic is essential for reading and writing in Russian.'
                    },
                    duration: 10
                },
                {
                    id: 2,
                    title: 'Vowels (Гласные)',
                    type: 'interactive-lesson',
                    content: {
                        letters: [
                            { cyrillic: 'А', latin: 'A', sound: 'ah', examples: ['мама', 'папа', 'дача', 'каша'] },
                            { cyrillic: 'Е', latin: 'Ye', sound: 'yeh', examples: ['лето', 'мне', 'где', 'тебе'] },
                            { cyrillic: 'Ё', latin: 'Yo', sound: 'yo', examples: ['ёлка', 'всё', 'её', 'моё'] },
                            { cyrillic: 'И', latin: 'I', sound: 'ee', examples: ['мир', 'они', 'дети', 'книги'] },
                            { cyrillic: 'О', latin: 'O', sound: 'oh', examples: ['дом', 'окно', 'молоко', 'хорошо'] },
                            { cyrillic: 'У', latin: 'U', sound: 'oo', examples: ['утро', 'рука', 'муж', 'друг'] },
                            { cyrillic: 'Ы', latin: 'Y', sound: 'ih', examples: ['сын', 'мы', 'выход', 'быстро'] },
                            { cyrillic: 'Э', latin: 'E', sound: 'eh', examples: ['это', 'эхо', 'поэт', 'экран'] },
                            { cyrillic: 'Ю', latin: 'Yu', sound: 'yoo', examples: ['юг', 'люди', 'рисую', 'пою'] },
                            { cyrillic: 'Я', latin: 'Ya', sound: 'yah', examples: ['я', 'моя', 'земля', 'семья'] }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 3,
                    title: 'Common Consonants (Согласные) - Part 1',
                    type: 'interactive-lesson',
                    content: {
                        letters: [
                            { cyrillic: 'Б', latin: 'B', sound: 'b', examples: ['брат', 'хлеб', 'собака', 'рыба'] },
                            { cyrillic: 'В', latin: 'V', sound: 'v', examples: ['вода', 'дерево', 'новый', 'здоровье'] },
                            { cyrillic: 'Г', latin: 'G', sound: 'g', examples: ['город', 'друг', 'гора', 'нога'] },
                            { cyrillic: 'Д', latin: 'D', sound: 'd', examples: ['дом', 'сад', 'дорога', 'день'] },
                            { cyrillic: 'Ж', latin: 'Zh', sound: 'zh', examples: ['жизнь', 'муж', 'жить', 'может'] },
                            { cyrillic: 'З', latin: 'Z', sound: 'z', examples: ['зима', 'глаз', 'зелёный', 'звезда'] },
                            { cyrillic: 'К', latin: 'K', sound: 'k', examples: ['кот', 'рука', 'как', 'книга'] },
                            { cyrillic: 'Л', latin: 'L', sound: 'l', examples: ['лето', 'стол', 'люди', 'лицо'] }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 4,
                    title: 'Common Consonants (Согласные) - Part 2',
                    type: 'interactive-lesson',
                    content: {
                        letters: [
                            { cyrillic: 'М', latin: 'M', sound: 'm', examples: ['мама', 'дом', 'время', 'семья'] },
                            { cyrillic: 'Н', latin: 'N', sound: 'n', examples: ['нос', 'окно', 'день', 'жена'] },
                            { cyrillic: 'П', latin: 'P', sound: 'p', examples: ['папа', 'суп', 'группа', 'капуста'] },
                            { cyrillic: 'Р', latin: 'R', sound: 'r', examples: ['рука', 'мир', 'работа', 'говорить'] },
                            { cyrillic: 'С', latin: 'S', sound: 's', examples: ['сын', 'лес', 'собака', 'класс'] },
                            { cyrillic: 'Т', latin: 'T', sound: 't', examples: ['тут', 'кот', 'стол', 'студент'] },
                            { cyrillic: 'Ф', latin: 'F', sound: 'f', examples: ['фото', 'граф', 'телефон', 'кофе'] },
                            { cyrillic: 'Х', latin: 'Kh', sound: 'kh', examples: ['хлеб', 'тих', 'хорошо', 'характер'] }
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
                            { cyrillic: 'Ц', latin: 'Ts', sound: 'ts', examples: ['цвет', 'отец', 'цирк', 'курица'] },
                            { cyrillic: 'Ч', latin: 'Ch', sound: 'ch', examples: ['час', 'ночь', 'учить', 'человек'] },
                            { cyrillic: 'Ш', latin: 'Sh', sound: 'sh', examples: ['школа', 'наш', 'машина', 'хорошо'] },
                            { cyrillic: 'Щ', latin: 'Shch', sound: 'shch', examples: ['щука', 'площадь', 'ещё', 'борщ'] },
                            { cyrillic: 'Ъ', latin: 'Hard sign', sound: '', examples: ['объект', 'съел', 'подъезд', 'объявление'] },
                            { cyrillic: 'Ь', latin: 'Soft sign', sound: '', examples: ['день', 'мать', 'учитель', 'июль'] }
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
                            { 
                                type: 'trace', 
                                letters: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И'],
                                description: 'Trace these letters to practice writing'
                            },
                            { 
                                type: 'copy', 
                                words: ['мама', 'папа', 'дом', 'кот', 'молоко', 'хлеб'],
                                description: 'Copy these common Russian words'
                            },
                            { 
                                type: 'dictation', 
                                audio: true, 
                                words: ['вода', 'лето', 'рука', 'семья', 'работа', 'учитель'],
                                description: 'Listen and write what you hear'
                            }
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
                        description: 'Match Cyrillic letters with their sounds',
                        levels: [
                            { 
                                name: 'Vowels', 
                                letters: ['А', 'Е', 'И', 'О', 'У'],
                                sounds: ['ah', 'yeh', 'ee', 'oh', 'oo']
                            },
                            { 
                                name: 'Common Consonants', 
                                letters: ['Б', 'В', 'Г', 'Д', 'М', 'Н', 'П', 'Р', 'С', 'Т'],
                                sounds: ['b', 'v', 'g', 'd', 'm', 'n', 'p', 'r', 's', 't']
                            },
                            { 
                                name: 'Challenge Round', 
                                letters: ['Ж', 'Ч', 'Ш', 'Щ', 'Ц', 'Ы'],
                                sounds: ['zh', 'ch', 'sh', 'shch', 'ts', 'ih']
                            }
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
                                type: 'multiple-choice',
                                question: 'What sound does the letter "Ж" make?',
                                options: ['zh', 'sh', 'ch', 'j'],
                                correct: 0
                            },
                            {
                                type: 'multiple-choice',
                                question: 'Which letter is the "soft sign"?',
                                options: ['Ъ', 'Ь', 'Ы', 'Э'],
                                correct: 1
                            },
                            {
                                type: 'multiple-choice',
                                question: 'How many letters are in the Russian alphabet?',
                                options: ['26', '30', '33', '36'],
                                correct: 2
                            },
                            {
                                type: 'multiple-choice',
                                question: 'Which letter combination makes the "yo" sound?',
                                options: ['Ю', 'Я', 'Ё', 'Е'],
                                correct: 2
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
    },
    {
        moduleType: ModuleType.PHONETICS_PRONUNCIATION,
        language: 'russian',
        title: 'Russian Phonetics & Pronunciation',
        description: 'Learn Russian sound system, stress patterns, and pronunciation rules for clear communication.',
        orderIndex: 2,
        requiredScore: 80,
        creditsReward: 100,
        content: {
            sections: [
                {
                    id: 1,
                    title: 'Introduction to Russian Sounds',
                    type: 'lesson',
                    content: {
                        overview: 'Understanding the Russian phonetic system',
                        keyPoints: [
                            'Russian has 42 phonemes (distinct sounds)',
                            'Stress patterns affect vowel pronunciation',
                            'Hard and soft consonants change meaning',
                            'Voiced consonants become voiceless at word endings'
                        ]
                    },
                    duration: 15
                },
                {
                    id: 2,
                    title: 'Vowel Sounds & Stress',
                    type: 'interactive-lesson',
                    content: {
                        letters: [
                            { cyrillic: 'А', latin: 'A', sound: 'stressed: [a], unstressed: [ə]', examples: ['мáма', 'собáка'] },
                            { cyrillic: 'О', latin: 'O', sound: 'stressed: [o], unstressed: [ə]', examples: ['дóм', 'молокó'] },
                            { cyrillic: 'И', latin: 'I', sound: 'always [i]', examples: ['мир', 'книги'] },
                            { cyrillic: 'Е', latin: 'E', sound: 'stressed: [je], unstressed: [jɪ]', examples: ['лéто', 'земля́'] },
                            { cyrillic: 'У', latin: 'U', sound: 'always [u]', examples: ['рука́', 'друг'] }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 3,
                    title: 'Hard vs Soft Consonants',
                    type: 'interactive-lesson',
                    content: {
                        letters: [
                            { cyrillic: 'т - ть', latin: 't - tʲ', sound: 'hard [t] vs soft [tʲ]', examples: ['том - тёмный'] },
                            { cyrillic: 'д - дь', latin: 'd - dʲ', sound: 'hard [d] vs soft [dʲ]', examples: ['дом - дядя'] },
                            { cyrillic: 'н - нь', latin: 'n - nʲ', sound: 'hard [n] vs soft [nʲ]', examples: ['нос - конь'] },
                            { cyrillic: 'л - ль', latin: 'l - lʲ', sound: 'hard [l] vs soft [lʲ]', examples: ['лук - люди'] },
                            { cyrillic: 'р - рь', latin: 'r - rʲ', sound: 'hard [r] vs soft [rʲ]', examples: ['рад - ряд'] }
                        ]
                    },
                    duration: 30
                },
                {
                    id: 4,
                    title: 'Pronunciation Practice',
                    type: 'interactive-lesson',
                    content: {
                        words: [
                            { word: 'здравствуйте', transcription: '[zdrástvujtɪ]', meaning: 'hello (formal)' },
                            { word: 'пожалуйста', transcription: '[pəžálustə]', meaning: 'please/you\'re welcome' },
                            { word: 'извините', transcription: '[ɪzvɪnítɪ]', meaning: 'excuse me' },
                            { word: 'спасибо', transcription: '[spəsíbə]', meaning: 'thank you' },
                            { word: 'до свидания', transcription: '[də svɪdánɪjə]', meaning: 'goodbye' }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 5,
                    title: 'Assessment',
                    type: 'quiz',
                    content: {
                        questions: [
                            {
                                type: 'multiple-choice',
                                question: 'How does stress affect the vowel "о" in Russian?',
                                options: ['No change', 'Becomes [a] when unstressed', 'Becomes [ə] when unstressed', 'Disappears when unstressed'],
                                correct: 2
                            },
                            {
                                type: 'multiple-choice',
                                question: 'What makes a consonant "soft" in Russian?',
                                options: ['Following vowels я, ё, ю, е, и or soft sign ь', 'Being at the end of a word', 'Being stressed', 'Being doubled'],
                                correct: 0
                            }
                        ],
                        passingScore: 80
                    },
                    duration: 10
                }
            ],
            totalDuration: 105,
            difficulty: 'beginner',
            estimatedCompletionTime: '2 hours'
        }
    },
    {
        moduleType: ModuleType.VOCABULARY_BUILDING,
        language: 'russian',
        title: 'Essential Russian Vocabulary',
        description: 'Build a foundation of 500+ essential Russian words for daily communication.',
        orderIndex: 3,
        requiredScore: 75,
        creditsReward: 100,
        content: {
            sections: [
                {
                    id: 1,
                    title: 'Family & People',
                    type: 'interactive-lesson',
                    content: {
                        vocabulary: [
                            { russian: 'семья', english: 'family', pronunciation: '[sɪmʲjá]' },
                            { russian: 'мама', english: 'mom', pronunciation: '[máma]' },
                            { russian: 'папа', english: 'dad', pronunciation: '[pápa]' },
                            { russian: 'сын', english: 'son', pronunciation: '[sɨn]' },
                            { russian: 'дочь', english: 'daughter', pronunciation: '[dɔtʂ]' },
                            { russian: 'брат', english: 'brother', pronunciation: '[brat]' },
                            { russian: 'сестра', english: 'sister', pronunciation: '[sɪstrá]' },
                            { russian: 'дедушка', english: 'grandfather', pronunciation: '[dédʊʂkə]' },
                            { russian: 'бабушка', english: 'grandmother', pronunciation: '[bábuʂkə]' },
                            { russian: 'друг', english: 'friend (male)', pronunciation: '[druk]' }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 2,
                    title: 'Numbers 1-20',
                    type: 'interactive-lesson',
                    content: {
                        vocabulary: [
                            { russian: 'один', english: 'one', pronunciation: '[ɐdín]' },
                            { russian: 'два', english: 'two', pronunciation: '[dva]' },
                            { russian: 'три', english: 'three', pronunciation: '[tri]' },
                            { russian: 'четыре', english: 'four', pronunciation: '[tʂɪtɨ́rɪ]' },
                            { russian: 'пять', english: 'five', pronunciation: '[pʲatʲ]' },
                            { russian: 'шесть', english: 'six', pronunciation: '[ʂestʲ]' },
                            { russian: 'семь', english: 'seven', pronunciation: '[sʲemʲ]' },
                            { russian: 'восемь', english: 'eight', pronunciation: '[vósʲɪmʲ]' },
                            { russian: 'девять', english: 'nine', pronunciation: '[dévʲɪtʲ]' },
                            { russian: 'десять', english: 'ten', pronunciation: '[dʲésʲɪtʲ]' }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 3,
                    title: 'Common Verbs',
                    type: 'interactive-lesson',
                    content: {
                        vocabulary: [
                            { russian: 'быть', english: 'to be', pronunciation: '[bɨtʲ]' },
                            { russian: 'иметь', english: 'to have', pronunciation: '[ɪmʲétʲ]' },
                            { russian: 'делать', english: 'to do/make', pronunciation: '[dʲélatʲ]' },
                            { russian: 'говорить', english: 'to speak', pronunciation: '[gəvərítʲ]' },
                            { russian: 'идти', english: 'to go (on foot)', pronunciation: '[ɪdtí]' },
                            { russian: 'есть', english: 'to eat', pronunciation: '[jestʲ]' },
                            { russian: 'пить', english: 'to drink', pronunciation: '[pʲitʲ]' },
                            { russian: 'жить', english: 'to live', pronunciation: '[ʐɨtʲ]' },
                            { russian: 'работать', english: 'to work', pronunciation: '[rabótatʲ]' },
                            { russian: 'учить', english: 'to study/learn', pronunciation: '[utʂítʲ]' }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 4,
                    title: 'Food & Drinks',
                    type: 'interactive-lesson',
                    content: {
                        vocabulary: [
                            { russian: 'хлеб', english: 'bread', pronunciation: '[xlʲep]' },
                            { russian: 'молоко', english: 'milk', pronunciation: '[məlakó]' },
                            { russian: 'мясо', english: 'meat', pronunciation: '[mʲásə]' },
                            { russian: 'рыба', english: 'fish', pronunciation: '[rɨ́ba]' },
                            { russian: 'овощи', english: 'vegetables', pronunciation: '[óvəʂtʂi]' },
                            { russian: 'фрукты', english: 'fruits', pronunciation: '[frúktɨ]' },
                            { russian: 'вода', english: 'water', pronunciation: '[vadá]' },
                            { russian: 'чай', english: 'tea', pronunciation: '[tʂaj]' },
                            { russian: 'кофе', english: 'coffee', pronunciation: '[kófɪ]' },
                            { russian: 'сок', english: 'juice', pronunciation: '[sok]' }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 5,
                    title: 'Vocabulary Quiz',
                    type: 'quiz',
                    content: {
                        questions: [
                            {
                                type: 'multiple-choice',
                                question: 'How do you say "family" in Russian?',
                                options: ['дом', 'семья', 'друзья', 'люди'],
                                correct: 1
                            },
                            {
                                type: 'multiple-choice',
                                question: 'What does "хлеб" mean?',
                                options: ['milk', 'bread', 'meat', 'water'],
                                correct: 1
                            },
                            {
                                type: 'multiple-choice',
                                question: 'How do you say "to speak" in Russian?',
                                options: ['слушать', 'читать', 'говорить', 'писать'],
                                correct: 2
                            }
                        ],
                        passingScore: 75
                    },
                    duration: 15
                }
            ],
            totalDuration: 100,
            difficulty: 'beginner',
            estimatedCompletionTime: '2 hours'
        }
    },
    {
        moduleType: ModuleType.GRAMMAR_FUNDAMENTALS,
        language: 'russian',
        title: 'Russian Grammar Basics',
        description: 'Understand Russian case system, verb conjugation, and sentence structure basics.',
        orderIndex: 4,
        requiredScore: 75,
        creditsReward: 100,
        content: {
            sections: [
                {
                    id: 1,
                    title: 'Introduction to Russian Grammar',
                    type: 'lesson',
                    content: {
                        overview: 'Russian grammar fundamentals',
                        keyPoints: [
                            'Russian has 6 cases that change word endings',
                            'Verbs change based on person and number',
                            'Adjectives agree with nouns in gender, number, and case',
                            'Word order is more flexible than English'
                        ]
                    },
                    duration: 15
                },
                {
                    id: 2,
                    title: 'Gender & Noun Endings',
                    type: 'interactive-lesson',
                    content: {
                        examples: [
                            { word: 'стол', gender: 'masculine', ending: 'consonant', meaning: 'table' },
                            { word: 'мама', gender: 'feminine', ending: 'а/я', meaning: 'mom' },
                            { word: 'окно', gender: 'neuter', ending: 'о/е', meaning: 'window' },
                            { word: 'учитель', gender: 'masculine', ending: 'ь', meaning: 'teacher (m)' },
                            { word: 'тетрадь', gender: 'feminine', ending: 'ь', meaning: 'notebook' }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 3,
                    title: 'Present Tense Verbs',
                    type: 'interactive-lesson',
                    content: {
                        verbs: [
                            {
                                infinitive: 'читать (to read)',
                                conjugation: {
                                    'я': 'читаю',
                                    'ты': 'читаешь',
                                    'он/она': 'читает',
                                    'мы': 'читаем',
                                    'вы': 'читаете',
                                    'они': 'читают'
                                }
                            },
                            {
                                infinitive: 'говорить (to speak)',
                                conjugation: {
                                    'я': 'говорю',
                                    'ты': 'говоришь',
                                    'он/она': 'говорит',
                                    'мы': 'говорим',
                                    'вы': 'говорите',
                                    'они': 'говорят'
                                }
                            }
                        ]
                    },
                    duration: 25
                },
                {
                    id: 4,
                    title: 'Basic Sentence Patterns',
                    type: 'interactive-lesson',
                    content: {
                        patterns: [
                            { 
                                pattern: 'Subject + Verb', 
                                example: 'Я читаю', 
                                translation: 'I read/am reading' 
                            },
                            { 
                                pattern: 'Subject + Verb + Object', 
                                example: 'Я читаю книгу', 
                                translation: 'I read a book' 
                            },
                            { 
                                pattern: 'Subject + быть + Adjective/Noun', 
                                example: 'Он студент', 
                                translation: 'He is a student' 
                            }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 5,
                    title: 'Grammar Assessment',
                    type: 'quiz',
                    content: {
                        questions: [
                            {
                                type: 'multiple-choice',
                                question: 'What gender is the word "мама"?',
                                options: ['masculine', 'feminine', 'neuter'],
                                correct: 1
                            },
                            {
                                type: 'multiple-choice',
                                question: 'How do you conjugate "читать" for "ты"?',
                                options: ['читаю', 'читаешь', 'читает', 'читаем'],
                                correct: 1
                            }
                        ],
                        passingScore: 75
                    },
                    duration: 15
                }
            ],
            totalDuration: 95,
            difficulty: 'beginner',
            estimatedCompletionTime: '2 hours'
        }
    },
    {
        moduleType: ModuleType.CULTURAL_CONTEXT,
        language: 'russian',
        title: 'Russian Culture & Etiquette',
        description: 'Learn Russian social etiquette, cultural norms, and communication styles.',
        orderIndex: 5,
        requiredScore: 70,
        creditsReward: 100,
        content: {
            sections: [
                {
                    id: 1,
                    title: 'Russian Cultural Overview',
                    type: 'lesson',
                    content: {
                        overview: 'Understanding Russian culture and values',
                        keyPoints: [
                            'Russians value deep, meaningful relationships',
                            'Formality is important in initial interactions',
                            'Direct communication style is preferred',
                            'Family and education are highly valued'
                        ]
                    },
                    duration: 15
                },
                {
                    id: 2,
                    title: 'Greetings & Politeness',
                    type: 'interactive-lesson',
                    content: {
                        phrases: [
                            { russian: 'Здравствуйте', english: 'Hello (formal)', when: 'Formal situations, older people' },
                            { russian: 'Привет', english: 'Hi (informal)', when: 'Friends, peers, family' },
                            { russian: 'Добро пожаловать', english: 'Welcome', when: 'Welcoming guests' },
                            { russian: 'Спасибо', english: 'Thank you', when: 'Expressing gratitude' },
                            { russian: 'Пожалуйста', english: 'Please/You\'re welcome', when: 'Making requests or responding to thanks' },
                            { russian: 'Извините', english: 'Excuse me/Sorry', when: 'Apologizing or getting attention' }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 3,
                    title: 'Russian Traditions',
                    type: 'lesson',
                    content: {
                        traditions: [
                            {
                                name: 'Maslenitsa (Butter Week)',
                                description: 'Traditional Russian festival before Lent, featuring blini (pancakes)',
                                significance: 'Saying goodbye to winter and welcoming spring'
                            },
                            {
                                name: 'New Year Celebration',
                                description: 'Most important holiday in Russia, more significant than Christmas',
                                significance: 'Family gatherings, gift-giving, and Ded Moroz (Russian Santa)'
                            },
                            {
                                name: 'Tea Culture',
                                description: 'Traditional Russian tea drinking with samovar',
                                significance: 'Social bonding and hospitality'
                            }
                        ]
                    },
                    duration: 20
                },
                {
                    id: 4,
                    title: 'Cultural Assessment',
                    type: 'quiz',
                    content: {
                        questions: [
                            {
                                type: 'multiple-choice',
                                question: 'Which greeting is appropriate for formal situations?',
                                options: ['Привет', 'Здравствуйте', 'Салют', 'Пока'],
                                correct: 1
                            },
                            {
                                type: 'multiple-choice',
                                question: 'What is the most important holiday in Russia?',
                                options: ['Christmas', 'Easter', 'New Year', 'Victory Day'],
                                correct: 2
                            }
                        ],
                        passingScore: 70
                    },
                    duration: 10
                }
            ],
            totalDuration: 65,
            difficulty: 'beginner',
            estimatedCompletionTime: '1.5 hours'
        }
    }
];

async function seedRussianModules() {
    try {
        console.log('🌱 Starting Russian modules seeding...');

        // Delete existing Russian modules
        await prisma.foundationModule.deleteMany({
            where: { language: 'russian' }
        });

        console.log('🗑️ Deleted existing Russian modules');

        // Create new modules
        for (const moduleData of russianFoundationModules) {
            const module = await prisma.foundationModule.create({
                data: {
                    ...moduleData,
                    content: moduleData.content as any
                }
            });
            
            console.log(`✅ Created module: ${module.title}`);
        }

        console.log('🎉 Russian modules seeding completed successfully!');
        console.log(`📚 Total modules created: ${russianFoundationModules.length}`);

    } catch (error) {
        console.error('❌ Error seeding Russian modules:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeding
async function main() {
    try {
        await seedRussianModules();
        console.log('✨ Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    }
}

// Only run if this is the main module
if (process.argv[1].endsWith('seed-russian.ts') || process.argv[1].endsWith('seed-russian.js')) {
    main();
}

export { seedRussianModules }; 