"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
    CheckCircle, X, Clock, Volume2, Trophy,
    RotateCcw, AlertCircle, Star, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { submitQuizAttempt } from '@/actions/foundations.action';

interface QuizQuestion {
    type: string;
    question: string;
    options: string[];
    correct: number;
    audio?: string;
}

interface QuizComponentProps {
    section: {
        id: number;
        title: string;
        content: {
            questions: QuizQuestion[];
            passingScore: number;
            description?: string;
        };
        duration: number;
    };
    onComplete: () => void;
    language: string;
    moduleId?: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
    section,
    onComplete,
    language,
    moduleId
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(section.duration * 60);
    const [startTime] = useState(new Date());
    const [results, setResults] = useState<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        passed: boolean;
        timeSpent: number;
    } | null>(null);

    const currentQuestion = section.content.questions[currentQuestionIndex];
    const totalQuestions = section.content.questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    // Timer effect
    useEffect(() => {
        if (!showResults && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !showResults) {
            handleQuizComplete();
        }
    }, [timeLeft, showResults]);

    const handleAnswerSelect = (answer: number) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            handleQuizComplete();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuizComplete = async () => {
        // Calculate results
        const correctCount = section.content.questions.filter((question, index) => 
            selectedAnswers[index] === question.correct
        ).length;
        const totalQuestions = section.content.questions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= section.content.passingScore;
        const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

        const quizResults = {
            score,
            correctAnswers: correctCount,
            totalQuestions,
            passed,
            timeSpent
        };

        setResults(quizResults);
        setShowResults(true);

        // Submit to backend if moduleId is provided
        if (moduleId) {
            try {
                await submitQuizAttempt(moduleId, {
                    quizType: 'MULTIPLE_CHOICE',
                    score,
                    totalQuestions,
                    correctAnswers: correctCount,
                    timeSpent,
                    answers: Object.entries(selectedAnswers).map(([questionIndex, answer]) => ({
                        questionIndex: parseInt(questionIndex),
                        userAnswer: answer,
                        correct: section.content.questions[parseInt(questionIndex)].correct,
                        isCorrect: answer === section.content.questions[parseInt(questionIndex)].correct
                    }))
                });

                if (passed) {
                    toast.success('Quiz passed! Credits awarded.');
                    onComplete();
                } else {
                    toast.error('Quiz failed. Try again to improve your score.');
                }
            } catch (error) {
                console.error('Error submitting quiz:', error);
                toast.error('Failed to submit quiz results');
            }
        }
    };

    const playAudio = (audioFile: string) => {
        // In a real implementation, you would play the actual audio file
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Audio sample');
            utterance.lang = language === 'russian' ? 'ru-RU' : 
                            language === 'japanese' ? 'ja-JP' : 
                            language === 'korean' ? 'ko-KR' : 'en-US';
            speechSynthesis.speak(utterance);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setResults(null);
        setTimeLeft(section.duration * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const canProceed = selectedAnswers[currentQuestionIndex] !== undefined;

    if (showResults && results) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        {results.passed ? '🏆' : '📚'}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Quiz {results.passed ? 'Completed!' : 'Results'}
                    </h2>
                    <div className={`text-xl mb-6 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                        Score: {results.score}% ({results.correctAnswers}/{results.totalQuestions})
                    </div>
                </div>

                <Card className={`border-2 ${results.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className={`text-2xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {results.score}%
                                </div>
                                <div className="text-sm text-gray-600">Final Score</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {results.correctAnswers}/{results.totalQuestions}
                                </div>
                                <div className="text-sm text-gray-600">Correct Answers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {formatTime(results.timeSpent)}
                                </div>
                                <div className="text-sm text-gray-600">Time Taken</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {results.passed ? '⭐' : '🔄'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {results.passed ? 'Passed' : 'Try Again'}
                                </div>
                            </div>
                        </div>

                        {!results.passed && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-medium">
                                        You need {section.content.passingScore}% to pass this quiz.
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button
                        onClick={restartQuiz}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                    </Button>
                    {results.passed && (
                        <Button
                            onClick={onComplete}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {section.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline">Final Assessment</Badge>
                    <Badge variant="secondary">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </Badge>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                            Time: {formatTime(timeLeft)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-600">
                            Pass: {section.content.passingScore}%
                        </span>
                    </div>
                </div>

                <Progress value={(currentQuestionIndex / totalQuestions) * 100} className="w-full max-w-md mx-auto" />
            </div>

            {/* Question Card */}
            <Card className="border-2 border-teal-200 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-teal-50 to-emerald-50">
                    <CardTitle className="text-center text-xl">
                        {currentQuestion.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Question Content */}
                            {currentQuestion.type === 'multiple-choice' && (
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, index) => (
                                        <button
                                            key={index}
                                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                                selectedAnswers[currentQuestionIndex] === index
                                                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                            }`}
                                            onClick={() => handleAnswerSelect(index)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    selectedAnswers[currentQuestionIndex] === index
                                                        ? 'border-teal-500 bg-teal-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedAnswers[currentQuestionIndex] === index && (
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <span className="font-medium">{option}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === 'audio-recognition' && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                        >
                                            <Volume2 className="w-5 h-5 mr-2" />
                                            Play Audio
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, index) => (
                                            <button
                                                key={index}
                                                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                                    selectedAnswers[currentQuestionIndex] === index
                                                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                        : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                                }`}
                                                onClick={() => handleAnswerSelect(index)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                        selectedAnswers[currentQuestionIndex] === index
                                                            ? 'border-teal-500 bg-teal-500'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {selectedAnswers[currentQuestionIndex] === index && (
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium">{option}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </p>
                    <p className="text-xs text-gray-500">
                        Time remaining: {formatTime(timeLeft)}
                    </p>
                </div>

                <Button
                    onClick={handleNextQuestion}
                    disabled={!canProceed}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                >
                    {isLastQuestion ? 'Finish Quiz' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default QuizComponent; 