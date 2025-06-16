"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BookOpenText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonContent {
    overview: string;
    keyPoints: string[];
    examples?: string[];
    notes?: string[];
}

interface LessonComponentProps {
    section: {
        id: number;
        title: string;
        content: LessonContent;
        duration: number;
    };
    onComplete: () => void;
    language: string;
    moduleType?: string;
}

const LessonComponent: React.FC<LessonComponentProps> = ({
    section,
    onComplete,
    language,
    moduleType
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [completed, setCompleted] = useState(false);

    const slides = [
        {
            title: 'Overview',
            content: section.content.overview
        },
        ...section.content.keyPoints.map((point, index) => ({
            title: `Key Point ${index + 1}`,
            content: point
        }))
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {section.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline">Lesson</Badge>
                    <Badge variant="secondary">
                        {currentSlide + 1} of {slides.length}
                    </Badge>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>

            {/* Content Card */}
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-2 border-blue-200 min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">
                            {slides[currentSlide].title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <div className="text-lg text-gray-700 leading-relaxed mb-6">
                                {slides[currentSlide].content}
                            </div>
                            
                            {currentSlide === 0 && section.content.examples && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">Examples:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {section.content.examples.map((example, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                <span className="font-medium">{example}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                >
                    Previous
                </Button>

                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentSlide
                                    ? 'bg-blue-500'
                                    : index < currentSlide
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>

                {!completed ? (
                    <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                        {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleComplete}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                    </Button>
                )}
            </div>

            {/* Lesson Summary */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpenText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Lesson Summary</span>
                    </div>
                    <ul className="text-blue-700 text-sm space-y-1">
                        {section.content.keyPoints.map((point, index) => (
                            <li key={index}>• {point}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default LessonComponent; 