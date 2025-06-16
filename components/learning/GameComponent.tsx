"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    GamepadIcon, Trophy, RotateCcw, CheckCircle,
    Timer, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface GameLevel {
    name: string;
    letters: string[] | string;
    difficulty: number;
}

interface GameContent {
    gameType: string;
    levels: GameLevel[];
    description?: string;
}

interface GameComponentProps {
    section: {
        id: number;
        title: string;
        content: GameContent;
        duration: number;
    };
    onComplete: () => void;
    language: string;
}

const GameComponent: React.FC<GameComponentProps> = ({
    section,
    onComplete,
    language
}) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [gameData, setGameData] = useState<any[]>([]);

    const currentLevelData = section.content.levels[currentLevel];

    // Initialize game based on type
    useEffect(() => {
        if (gameState === 'playing') {
            initializeGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentLevel]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timeLeft > 0 && gameState === 'playing') {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft, gameState]);

    const initializeGame = () => {
        switch (section.content.gameType) {
            case 'letter-match':
                initializeLetterMatch();
                break;
            case 'memory-game':
                initializeMemoryGame();
                break;
            case 'speed-typing':
                initializeSpeedTyping();
                break;
            default:
                initializeLetterMatch();
        }
        setIsTimerActive(true);
        setTimeLeft(60);
        setScore(0);
        setMatchedPairs(new Set());
        setSelectedCards([]);
    };

    const initializeLetterMatch = () => {
        const letters = currentLevelData.letters === 'all' 
            ? getAllLettersForLanguage() 
            : currentLevelData.letters as string[];
        
        const pairs = letters.slice(0, 8).flatMap(letter => [
            { id: Math.random(), type: 'cyrillic', value: letter, matched: false },
            { id: Math.random(), type: 'latin', value: getLatinEquivalent(letter), matched: false }
        ]);
        
        setGameData(shuffleArray(pairs));
    };

    const initializeMemoryGame = () => {
        const letters = currentLevelData.letters === 'all' 
            ? getAllLettersForLanguage() 
            : currentLevelData.letters as string[];
        
        const cards = letters.slice(0, 6).flatMap(letter => [
            { id: Math.random(), value: letter, type: 'letter', matched: false },
            { id: Math.random(), value: letter, type: 'letter', matched: false }
        ]);
        
        setGameData(shuffleArray(cards));
    };

    const initializeSpeedTyping = () => {
        const letters = currentLevelData.letters === 'all' 
            ? getAllLettersForLanguage() 
            : currentLevelData.letters as string[];
        
        setGameData(shuffleArray(letters.slice(0, 10)));
    };

    const getAllLettersForLanguage = () => {
        // This would come from your language data
        if (language === 'russian') {
            return ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
        }
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    };

    const getLatinEquivalent = (letter: string) => {
        const map: Record<string, string> = {
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
            'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
            'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
            'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
            'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
            'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
            'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
        };
        return map[letter] || letter;
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleCardClick = (index: number) => {
        if (section.content.gameType === 'memory-game') {
            handleMemoryGameClick(index);
        } else if (section.content.gameType === 'letter-match') {
            handleLetterMatchClick(index);
        }
    };

    const handleMemoryGameClick = (index: number) => {
        if (selectedCards.length < 2 && !selectedCards.includes(index) && !matchedPairs.has(index)) {
            const newSelected = [...selectedCards, index];
            setSelectedCards(newSelected);

            if (newSelected.length === 2) {
                const [first, second] = newSelected;
                if (gameData[first].value === gameData[second].value) {
                    // Match found
                    setMatchedPairs(prev => new Set([...prev, first, second]));
                    setScore(prev => prev + 10);
                    setSelectedCards([]);
                    
                    if (matchedPairs.size + 2 === gameData.length) {
                        setTimeout(() => completeLevel(), 500);
                    }
                } else {
                    // No match
                    setTimeout(() => setSelectedCards([]), 1000);
                }
            }
        }
    };

    const handleLetterMatchClick = (index: number) => {
        if (selectedCards.length < 2 && !selectedCards.includes(index) && !matchedPairs.has(index)) {
            const newSelected = [...selectedCards, index];
            setSelectedCards(newSelected);

            if (newSelected.length === 2) {
                const [first, second] = newSelected;
                const firstCard = gameData[first];
                const secondCard = gameData[second];
                
                // Check if they match (cyrillic with its latin equivalent)
                const isMatch = (firstCard.type === 'cyrillic' && secondCard.type === 'latin' && 
                               getLatinEquivalent(firstCard.value) === secondCard.value) ||
                              (firstCard.type === 'latin' && secondCard.type === 'cyrillic' && 
                               firstCard.value === getLatinEquivalent(secondCard.value));

                if (isMatch) {
                    setMatchedPairs(prev => new Set([...prev, first, second]));
                    setScore(prev => prev + 15);
                    setSelectedCards([]);
                    
                    if (matchedPairs.size + 2 === gameData.length) {
                        setTimeout(() => completeLevel(), 500);
                    }
                } else {
                    setTimeout(() => setSelectedCards([]), 1000);
                }
            }
        }
    };

    const completeLevel = () => {
        setIsTimerActive(false);
        const timeBonus = Math.max(0, timeLeft * 2);
        setScore(prev => prev + timeBonus);
        
        if (currentLevel < section.content.levels.length - 1) {
            toast.success(`Level ${currentLevel + 1} completed! +${timeBonus} time bonus`);
            setTimeout(() => {
                setCurrentLevel(prev => prev + 1);
                setGameState('playing');
            }, 2000);
        } else {
            setGameState('completed');
            toast.success('All levels completed! Great job!');
        }
    };

    const endGame = () => {
        setIsTimerActive(false);
        setGameState('completed');
    };

    const restartGame = () => {
        setCurrentLevel(0);
        setGameState('menu');
        setScore(0);
    };

    const startGame = () => {
        setGameState('playing');
    };

    const handleComplete = () => {
        onComplete();
    };

    if (gameState === 'menu') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {section.title}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Test your knowledge with fun interactive games!
                    </p>
                </div>

                {/* Game Levels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.content.levels.map((level, index) => (
                        <Card key={index} className="border-2 border-teal-200 hover:border-teal-400 transition-colors">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl mb-2">
                                    {index === 0 ? '🌟' : index === 1 ? '⚡' : '🏆'}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                                <div className="flex justify-center gap-1 mb-3">
                                    {Array.from({ length: level.difficulty }, (_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Badge variant="outline" className="mb-3">
                                    {Array.isArray(level.letters) ? level.letters.length : 'All'} letters
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={startGame}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                        <GamepadIcon className="w-5 h-5 mr-2" />
                        Start Game
                    </Button>
                </div>
            </div>
        );
    }

    if (gameState === 'completed') {
        return (
            <div className="space-y-6 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Game Completed!
                </h2>
                <div className="text-xl text-gray-600 mb-6">
                    Final Score: <span className="font-bold text-green-600">{score}</span>
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{score}</div>
                                <div className="text-sm text-gray-600">Total Score</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{section.content.levels.length}</div>
                                <div className="text-sm text-gray-600">Levels Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">⭐</div>
                                <div className="text-sm text-gray-600">Achievement Unlocked</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={restartGame}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                    </Button>
                    <Button
                        onClick={handleComplete}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    // Playing state
    return (
        <div className="space-y-6">
            {/* Game Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {currentLevelData.name}
                    </h2>
                    <Badge variant="outline">Level {currentLevel + 1}</Badge>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold">{score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-red-500" />
                        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                            {timeLeft}s
                        </span>
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <Card className="border-2 border-teal-200">
                <CardContent className="p-6">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {gameData.map((item, index) => (
                            <motion.button
                                key={item.id || index}
                                className={`
                                    aspect-square rounded-lg text-lg font-bold transition-all duration-200
                                    ${matchedPairs.has(index) 
                                        ? 'bg-green-500 text-white' 
                                        : selectedCards.includes(index)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                                    }
                                `}
                                onClick={() => handleCardClick(index)}
                                disabled={matchedPairs.has(index) || selectedCards.includes(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {selectedCards.includes(index) || matchedPairs.has(index) 
                                    ? item.value 
                                    : '?'
                                }
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Game Instructions */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <p className="text-blue-800 text-sm">
                        {section.content.gameType === 'letter-match' 
                            ? 'Match each Cyrillic letter with its Latin equivalent!'
                            : section.content.gameType === 'memory-game'
                            ? 'Find matching pairs by remembering card positions!'
                            : 'Complete the challenge as quickly as possible!'
                        }
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameComponent; 