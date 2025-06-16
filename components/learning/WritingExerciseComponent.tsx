"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    PenTool, RotateCcw, CheckCircle, Volume2,
    ArrowRight, ArrowLeft, Target, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface WritingExercise {
    type: string;
    letters?: string[];
    words?: string[];
    audio?: boolean;
}

interface WritingExerciseContent {
    exercises: WritingExercise[];
    description?: string;
}

interface WritingExerciseComponentProps {
    section: {
        id: number;
        title: string;
        content: {
            exercises: WritingExercise[];
        };
        duration: number;
    };
    onComplete: () => void;
    language: string;
}

const WritingExerciseComponent: React.FC<WritingExerciseComponentProps> = ({
    section,
    onComplete,
    language
}) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
    const [showSolution, setShowSolution] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showGuide, setShowGuide] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

    const currentExercise = section.content.exercises[currentExerciseIndex];
    const currentItems = currentExercise.letters || currentExercise.words || [];
    const currentItem = currentItems[currentItemIndex];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                setCanvasContext(ctx);
                setupCanvas(ctx);
            }
        }
    }, [currentExerciseIndex, currentItemIndex]);

    const setupCanvas = (ctx: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw guide lines
        if (showGuide) {
            drawGuideLines(ctx);
        }

        // Draw template for tracing
        if (currentExercise.type === 'trace' && currentItem) {
            drawTemplate(ctx, currentItem);
        }
    };

    const drawGuideLines = (ctx: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        // Horizontal guide lines
        const lineSpacing = canvas.height / 4;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * lineSpacing);
            ctx.lineTo(canvas.width, i * lineSpacing);
            ctx.stroke();
        }

        // Vertical center line
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        ctx.setLineDash([]);
    };

    const drawTemplate = (ctx: CanvasRenderingContext2D, text: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the letter/word as a template
        ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvasContext;
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasContext) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        canvasContext.lineTo(x, y);
        canvasContext.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (canvasContext) {
            setupCanvas(canvasContext);
        }
    };

    const nextItem = () => {
        if (currentItemIndex < currentItems.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        } else {
            // Mark exercise as completed
            setCompletedExercises(prev => new Set([...prev, currentExerciseIndex]));
            
            if (currentExerciseIndex < section.content.exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setCurrentItemIndex(0);
            } else {
                // All exercises completed
                toast.success('All writing exercises completed!');
                onComplete();
            }
        }
    };

    const previousItem = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(prev => prev - 1);
        } else if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            const prevExercise = section.content.exercises[currentExerciseIndex - 1];
            const prevItems = prevExercise.letters || prevExercise.words || [];
            setCurrentItemIndex(prevItems.length - 1);
        }
    };

    const playAudio = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'russian' ? 'ru-RU' : 
                            language === 'japanese' ? 'ja-JP' : 
                            language === 'korean' ? 'ko-KR' : 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    const getExerciseIcon = (type: string) => {
        switch (type) {
            case 'trace':
                return '✏️';
            case 'copy':
                return '📝';
            case 'dictation':
                return '🎤';
            default:
                return '✍️';
        }
    };

    const getExerciseInstructions = (type: string) => {
        switch (type) {
            case 'trace':
                return 'Trace over the dotted letters to practice proper formation';
            case 'copy':
                return 'Look at the reference and write it yourself';
            case 'dictation':
                return 'Listen to the audio and write what you hear';
            default:
                return 'Practice writing the characters';
        }
    };

    return (
        <div className="space-y-6">
            {/* Exercise Header */}
            <div className="text-center">
                <div className="text-4xl mb-2">
                    {getExerciseIcon(currentExercise.type)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {section.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline">
                        {currentExercise.type.charAt(0).toUpperCase() + currentExercise.type.slice(1)}
                    </Badge>
                    <Badge variant="secondary">
                        {currentItemIndex + 1} of {currentItems.length}
                    </Badge>
                </div>
                <p className="text-gray-600">
                    {getExerciseInstructions(currentExercise.type)}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                        width: `${((currentExerciseIndex * currentItems.length + currentItemIndex + 1) / 
                                  (section.content.exercises.reduce((acc, ex) => acc + (ex.letters?.length || ex.words?.length || 0), 0))) * 100}%` 
                    }}
                />
            </div>

            {/* Current Item Display */}
            <Card className="border-2 border-purple-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-purple-600 mb-4">
                        {currentItem}
                    </CardTitle>
                    
                    {currentExercise.audio && (
                        <Button
                            variant="outline"
                            onClick={() => playAudio(currentItem)}
                            className="mx-auto"
                        >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Listen
                        </Button>
                    )}
                </CardHeader>
            </Card>

            {/* Writing Canvas */}
            <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <PenTool className="w-5 h-5" />
                        Practice Area
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowGuide(!showGuide)}
                        >
                            {showGuide ? 'Hide' : 'Show'} Guide
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearCanvas}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className="border border-gray-300 rounded-lg cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Writing Tips</span>
                    </div>
                    <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Take your time to form each stroke carefully</li>
                        <li>• Follow the guide lines to maintain proper size</li>
                        <li>• Practice each letter multiple times for muscle memory</li>
                        {currentExercise.type === 'trace' && (
                            <li>• Trace directly over the gray template</li>
                        )}
                        {currentExercise.type === 'dictation' && currentExercise.audio && (
                            <li>• Click the Listen button to hear the pronunciation</li>
                        )}
                    </ul>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={previousItem}
                    disabled={currentExerciseIndex === 0 && currentItemIndex === 0}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                <div className="text-center">
                    <div className="text-sm text-gray-600">
                        Exercise {currentExerciseIndex + 1} of {section.content.exercises.length}
                    </div>
                    <div className="text-xs text-gray-500">
                        Item {currentItemIndex + 1} of {currentItems.length}
                    </div>
                </div>

                <Button
                    onClick={nextItem}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                    {currentItemIndex === currentItems.length - 1 && 
                     currentExerciseIndex === section.content.exercises.length - 1 ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>

            {/* Exercise Overview */}
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg">Exercise Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {section.content.exercises.map((exercise, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg text-center ${
                                    completedExercises.has(index)
                                        ? 'bg-green-500 text-white'
                                        : index === currentExerciseIndex
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white border-2 border-gray-200'
                                }`}
                            >
                                <div className="text-2xl mb-1">
                                    {getExerciseIcon(exercise.type)}
                                </div>
                                <div className="font-medium text-sm">
                                    {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                                </div>
                                <div className="text-xs opacity-75">
                                    {exercise.letters?.length || exercise.words?.length || 0} items
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WritingExerciseComponent; 