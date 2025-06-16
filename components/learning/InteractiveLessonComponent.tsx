"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Volume2, VolumeX, CheckCircle,
    ArrowLeft, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type CyrillicLetter = {
    cyrillic: string;
    latin: string;
    sound: string;
    examples: string[];
};

type JapaneseCharacter = {
    hiragana: string;
    romaji: string;
    sound: string;
};

type KoreanVowel = {
    hangul: string;
    romaji: string;
    sound: string;
};

type Character = CyrillicLetter | JapaneseCharacter | KoreanVowel;

interface InteractiveLessonComponentProps {
    section: {
        id: number;
        title: string;
        content: {
            letters?: CyrillicLetter[];
            characters?: JapaneseCharacter[];
            vowels?: KoreanVowel[];
        };
        duration: number;
    };
    onComplete: () => void;
    language: string;
}

// Type guard functions
const isCyrillicLetter = (char: Character): char is CyrillicLetter => {
    return 'cyrillic' in char;
};

const isJapaneseCharacter = (char: Character): char is JapaneseCharacter => {
    return 'hiragana' in char;
};

const isKoreanVowel = (char: Character): char is KoreanVowel => {
    return 'hangul' in char;
};

const InteractiveLessonComponent: React.FC<InteractiveLessonComponentProps> = ({
    section,
    onComplete,
    language
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [completedLetters, setCompletedLetters] = useState<Set<number>>(new Set());
    const [isPlaying, setIsPlaying] = useState(false);
    // const audioRef = useRef<HTMLAudioElement>(null);

    // Get the letters array from content
    const letters: Character[] = (section.content.letters || section.content.characters || section.content.vowels || []) as Character[];

    const currentLetter = letters[currentIndex];
    const progressPercent = Math.round(((completedLetters.size) / letters.length) * 100);

    // Helper function to get language code for TTS
    const getLanguageCode = (language: string) => {
        const languageCodes: Record<string, string> = {
            russian: 'ru-RU',
            japanese: 'ja-JP',
            korean: 'ko-KR',
            english: 'en-US',
            spanish: 'es-ES',
            french: 'fr-FR',
            german: 'de-DE',
            chinese: 'zh-CN'
        };
        return languageCodes[language] || 'en-US';
    };

    // Simplified pronunciation function
    const playPronunciation = async (character: Character) => {
        if (isPlaying) return;

        console.log(character);

        setIsPlaying(true);
        const textToSpeak = character.sound;
        const languageCode = getLanguageCode(language);

        try {
            // Try ElevenLabs API first
            const response = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: textToSpeak,
                    languageCode
                })
            });

            if (response.ok && response.headers.get('content-type')?.includes('audio')) {
                // ElevenLabs returned audio
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                const audio = new Audio(audioUrl);
                audio.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl); // Clean up
                };
                audio.onerror = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl);
                    // Fallback to Web Speech API
                    playWebSpeechFallback(textToSpeak, languageCode);
                };

                await audio.play();
                toast.success('Audio played');

            } else {
                // API returned fallback message, use Web Speech API
                playWebSpeechFallback(textToSpeak, languageCode);
            }

        } catch (error) {
            console.error('Error with TTS API:', error);
            setIsPlaying(false);
            // Fallback to Web Speech API
            playWebSpeechFallback(textToSpeak, languageCode);
        }
    };

    // Web Speech API fallback
    const playWebSpeechFallback = (text: string, languageCode: string) => {
        if (!('speechSynthesis' in window)) {
            setIsPlaying(false);
            toast.error('Speech synthesis not supported');
            return;
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = languageCode;
            utterance.rate = 0.7;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Try to find a better voice for the language
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice =>
                voice.lang.startsWith(languageCode.split('-')[0]) &&
                (voice.name.includes('Google') || voice.name.includes('Microsoft'))
            );

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => {
                setIsPlaying(false);
                toast.error('Audio playback failed');
            };

            speechSynthesis.speak(utterance);
            toast.success('Audio played');

        } catch (error) {
            console.error('Web Speech API error:', error);
            setIsPlaying(false);
            toast.error('Audio playback failed');
        }
    };

    const markLetterAsLearned = () => {
        setCompletedLetters(prev => new Set([...prev, currentIndex]));

        // Auto-advance to next letter
        if (currentIndex < letters.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 500);
        }

        // Check if all letters completed
        if (completedLetters.size + 1 >= letters.length) {
            setTimeout(() => {
                onComplete();
                toast.success('Section completed!');
            }, 1000);
        }
    };

    const navigateToLetter = (index: number) => {
        if (index >= 0 && index < letters.length) {
            setCurrentIndex(index);
        }
    };

    const getCharacterDisplay = (char: Character) => {
        if (isCyrillicLetter(char)) {
            return char.cyrillic;
        } else if (isJapaneseCharacter(char)) {
            return char.hiragana;
        } else if (isKoreanVowel(char)) {
            return char.hangul;
        }
        return '';
    };

    const getRomanization = (char: Character) => {
        if (isCyrillicLetter(char)) {
            return char.latin;
        } else if (isJapaneseCharacter(char)) {
            return char.romaji;
        } else if (isKoreanVowel(char)) {
            return char.romaji;
        }
        return '';
    };

    const getExamples = (char: Character) => {
        if (isCyrillicLetter(char)) {
            return char.examples;
        }
        return [];
    };

    if (!currentLetter) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No characters available for this lesson.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Badge variant="outline">Interactive Lesson</Badge>
                    <Badge variant="secondary">
                        {currentIndex + 1} of {letters.length}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{progressPercent}% Complete</span>
                    <Progress value={progressPercent} className="w-24" />
                </div>
            </div>
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
                <CardContent className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="text-center space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="text-8xl font-bold text-teal-700 mb-4">
                                    {getCharacterDisplay(currentLetter)}
                                </div>
                                {
                                    showTransliteration && (
                                        <div className="text-2xl text-teal-600 font-medium">
                                            [{getRomanization(currentLetter)}]
                                        </div>
                                    )
                                }
                                <div className="text-lg text-gray-700">
                                    Sound: <span className="font-medium">{currentLetter.sound}</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => playPronunciation(currentLetter)}
                                    disabled={isPlaying}
                                    className="border-teal-300 text-teal-700 hover:bg-teal-50"
                                >
                                    {
                                        isPlaying ? (
                                            <>
                                                <VolumeX className="w-5 h-5 mr-2" />
                                                Playing...
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 className="w-5 h-5 mr-2" />
                                                Listen
                                            </>
                                        )
                                    }
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setShowTransliteration(!showTransliteration)}
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                >
                                    {
                                        showTransliteration ? (
                                            <>
                                                <EyeOff className="w-5 h-5 mr-2" />
                                                Hide
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-5 h-5 mr-2" />
                                                Show
                                            </>
                                        )
                                    }
                                </Button>
                                {
                                    !completedLetters.has(currentIndex) && (
                                        <Button
                                            onClick={markLetterAsLearned}
                                            size="lg"
                                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Got it!
                                        </Button>
                                    )
                                }
                                {
                                    completedLetters.has(currentIndex) && (
                                        <Badge variant="default" className="px-4 py-2">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Learned
                                        </Badge>
                                    )
                                }
                            </div>
                            {
                                isCyrillicLetter(currentLetter) && (
                                    <div className="bg-white rounded-lg p-4 border border-teal-200">
                                        <h4 className="font-medium text-gray-800 mb-2">Examples:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {
                                                getExamples(currentLetter).map((example: string, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="text-center p-2 bg-teal-50 rounded border border-teal-100"
                                                    >
                                                        <div className="font-bold text-teal-700">{example}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigateToLetter(currentIndex - 1)}
                    disabled={currentIndex === 0}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <div className="flex gap-2 max-w-md overflow-x-auto">
                    {
                        letters.map((letter, index) => (
                            <button
                                key={index}
                                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${index === currentIndex
                                    ? 'bg-teal-500 text-white'
                                    : completedLetters.has(index)
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                onClick={() => navigateToLetter(index)}
                            >
                                {getCharacterDisplay(letter)}
                            </button>
                        ))
                    }
                </div>
                {
                    currentIndex < letters.length - 1 ? (
                        <Button
                            onClick={() => navigateToLetter(currentIndex + 1)}
                            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={onComplete}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            disabled={!completedLetters.has(currentIndex)}
                        >
                            Complete
                            <CheckCircle className="w-4 h-4 ml-2" />
                        </Button>
                    )
                }
            </div>
            <Card className="bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Character Grid</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-6 md:grid-cols-10 gap-3">
                        {
                            letters.map((letter, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square rounded-lg border-2 text-lg font-bold transition-all ${completedLetters.has(index)
                                        ? 'bg-green-500 text-white'
                                        : index === currentIndex
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300'
                                        }`}
                                    onClick={() => navigateToLetter(index)}
                                >
                                    {getCharacterDisplay(letter)}
                                </button>
                            ))
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InteractiveLessonComponent; 