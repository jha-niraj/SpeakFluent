"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Languages, Target, Clock, Globe, ArrowRight, CheckCircle,
    BookOpenText, Mic, Users, Star
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OnboardingData {
    selectedLanguage: string;
    selectedLevel: string;
    selectedGoal: string;
    selectedTime: string;
    dailyMinutes: number;
}

const OnboardingPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleting, setIsCompleting] = useState(false);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        selectedLanguage: '',
        selectedLevel: '',
        selectedGoal: '',
        selectedTime: '',
        dailyMinutes: 0
    });

    const totalSteps = 5;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    const updateOnboardingData = (field: keyof OnboardingData, value: string | number) => {
        setOnboardingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const completeOnboarding = async () => {
        setIsCompleting(true);
        try {
            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(onboardingData),
            });

            if (response.ok) {
                toast.success('Welcome to SpeakFluent! 🎉');
                router.push('/dashboard');
            } else {
                toast.error('Failed to complete onboarding. Please try again.');
            }
        } catch (error) {
            console.error('Error completing onboarding:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return onboardingData.selectedLanguage !== '';
            case 2:
                return onboardingData.selectedLevel !== '';
            case 3:
                return onboardingData.selectedGoal !== '';
            case 4:
                return onboardingData.selectedTime !== '';
            case 5:
                return onboardingData.dailyMinutes > 0;
            default:
                return false;
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Languages className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center mb-6"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Languages className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to SpeakFluent! 🌍
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Let's personalize your language learning journey in just a few steps
                        </p>
                    </motion.div>
                    <div className="max-w-md mx-auto mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
                            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8">
                        {
                            currentStep === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            Which language would you like to learn?
                                        </h2>
                                        <p className="text-gray-600">
                                            Choose your target language to get started with personalized content
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {
                                            [
                                                { value: 'russian', label: 'Russian', flag: '🇷🇺', popular: true },
                                                { value: 'japanese', label: 'Japanese', flag: '🇯🇵', popular: true },
                                                { value: 'korean', label: 'Korean', flag: '🇰🇷', popular: true },
                                                { value: 'spanish', label: 'Spanish', flag: '🇪🇸', popular: false },
                                                { value: 'french', label: 'French', flag: '🇫🇷', popular: false },
                                                { value: 'german', label: 'German', flag: '🇩🇪', popular: false },
                                                { value: 'chinese', label: 'Chinese', flag: '🇨🇳', popular: false },
                                                { value: 'english', label: 'English', flag: '🇺🇸', popular: false }
                                            ].map((language) => (
                                                <motion.div
                                                    key={language.value}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Card
                                                        className={`cursor-pointer transition-all duration-200 relative ${onboardingData.selectedLanguage === language.value
                                                                ? 'ring-2 ring-teal-500 bg-teal-50'
                                                                : 'hover:shadow-lg hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => updateOnboardingData('selectedLanguage', language.value)}
                                                    >
                                                        {
                                                            language.popular && (
                                                                <Badge className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs">
                                                                    Popular
                                                                </Badge>
                                                            )
                                                        }
                                                        <CardContent className="p-4 text-center">
                                                            <div className="text-3xl mb-2">{language.flag}</div>
                                                            <p className="font-medium text-gray-900">{language.label}</p>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                        {
                            currentStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            What's your current level?
                                        </h2>
                                        <p className="text-gray-600">
                                            This helps us customize the difficulty of your lessons
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {
                                            [
                                                {
                                                    value: 'beginner',
                                                    title: 'Beginner',
                                                    description: 'New to the language or know just a few words',
                                                    icon: Star,
                                                    color: 'text-green-600 bg-green-50'
                                                },
                                                {
                                                    value: 'intermediate',
                                                    title: 'Intermediate',
                                                    description: 'Can have basic conversations and understand some content',
                                                    icon: BookOpenText,
                                                    color: 'text-teal-600 bg-teal-50'
                                                },
                                                {
                                                    value: 'advanced',
                                                    title: 'Advanced',
                                                    description: 'Fluent but want to refine skills and expand vocabulary',
                                                    icon: Target,
                                                    color: 'text-emerald-600 bg-emerald-50'
                                                }
                                            ].map((level) => {
                                                const IconComponent = level.icon;
                                                return (
                                                    <motion.div
                                                        key={level.value}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Card
                                                            className={`cursor-pointer transition-all duration-200 h-full ${onboardingData.selectedLevel === level.value
                                                                    ? 'ring-2 ring-teal-500 bg-teal-50'
                                                                    : 'hover:shadow-lg hover:bg-gray-50'
                                                                }`}
                                                            onClick={() => updateOnboardingData('selectedLevel', level.value)}
                                                        >
                                                            <CardContent className="p-6 text-center">
                                                                <div className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center mx-auto mb-4`}>
                                                                    <IconComponent className="w-6 h-6" />
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                    {level.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {level.description}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                        {
                            currentStep === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            What's your main goal?
                                        </h2>
                                        <p className="text-gray-600">
                                            We'll tailor your learning experience based on your objectives
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {
                                            [
                                                {
                                                    value: 'travel',
                                                    title: 'Travel & Tourism',
                                                    description: 'Learn practical phrases for traveling and exploring',
                                                    icon: Globe,
                                                    color: 'text-blue-600 bg-blue-50'
                                                },
                                                {
                                                    value: 'work',
                                                    title: 'Professional Development',
                                                    description: 'Improve language skills for career advancement',
                                                    icon: Target,
                                                    color: 'text-purple-600 bg-purple-50'
                                                },
                                                {
                                                    value: 'conversation',
                                                    title: 'Daily Conversation',
                                                    description: 'Become confident in everyday conversations',
                                                    icon: Mic,
                                                    color: 'text-teal-600 bg-teal-50'
                                                },
                                                {
                                                    value: 'culture',
                                                    title: 'Cultural Understanding',
                                                    description: 'Deepen cultural knowledge and connections',
                                                    icon: Users,
                                                    color: 'text-emerald-600 bg-emerald-50'
                                                }
                                            ].map((goal) => {
                                                const IconComponent = goal.icon;
                                                return (
                                                    <motion.div
                                                        key={goal.value}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Card
                                                            className={`cursor-pointer transition-all duration-200 h-full ${onboardingData.selectedGoal === goal.value
                                                                    ? 'ring-2 ring-teal-500 bg-teal-50'
                                                                    : 'hover:shadow-lg hover:bg-gray-50'
                                                                }`}
                                                            onClick={() => updateOnboardingData('selectedGoal', goal.value)}
                                                        >
                                                            <CardContent className="p-6">
                                                                <div className={`w-12 h-12 rounded-full ${goal.color} flex items-center justify-center mb-4`}>
                                                                    <IconComponent className="w-6 h-6" />
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                    {goal.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {goal.description}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                        {
                            currentStep === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            How much time can you dedicate?
                                        </h2>
                                        <p className="text-gray-600">
                                            We'll adjust your learning plan to fit your schedule
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {
                                            [
                                                {
                                                    value: 'casual',
                                                    title: 'Casual Learner',
                                                    description: 'A few minutes here and there when I have time',
                                                    time: '5-15 min/day',
                                                    color: 'text-green-600 bg-green-50'
                                                },
                                                {
                                                    value: 'regular',
                                                    title: 'Regular Practice',
                                                    description: 'Consistent daily practice with manageable sessions',
                                                    time: '15-30 min/day',
                                                    color: 'text-teal-600 bg-teal-50'
                                                },
                                                {
                                                    value: 'serious',
                                                    title: 'Serious Student',
                                                    description: 'Dedicated learning with longer focused sessions',
                                                    time: '30-60 min/day',
                                                    color: 'text-emerald-600 bg-emerald-50'
                                                },
                                                {
                                                    value: 'intensive',
                                                    title: 'Intensive Learning',
                                                    description: 'Immersive experience with maximum progress',
                                                    time: '1+ hours/day',
                                                    color: 'text-purple-600 bg-purple-50'
                                                }
                                            ].map((timeOption) => (
                                                <motion.div
                                                    key={timeOption.value}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Card
                                                        className={`cursor-pointer transition-all duration-200 h-full ${onboardingData.selectedTime === timeOption.value
                                                                ? 'ring-2 ring-teal-500 bg-teal-50'
                                                                : 'hover:shadow-lg hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => updateOnboardingData('selectedTime', timeOption.value)}
                                                    >
                                                        <CardContent className="p-6">
                                                            <div className={`w-12 h-12 rounded-full ${timeOption.color} flex items-center justify-center mb-4`}>
                                                                <Clock className="w-6 h-6" />
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                {timeOption.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {timeOption.description}
                                                            </p>
                                                            <Badge variant="outline" className="text-xs">
                                                                {timeOption.time}
                                                            </Badge>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                        {
                            currentStep === 5 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            Set your daily goal
                                        </h2>
                                        <p className="text-gray-600">
                                            How many minutes per day would you like to practice?
                                        </p>
                                    </div>
                                    <div className="max-w-md mx-auto">
                                        <Label htmlFor="daily-minutes" className="text-base font-medium text-gray-700 mb-4 block">
                                            Daily Practice Goal
                                        </Label>
                                        <Select
                                            value={onboardingData.dailyMinutes.toString()}
                                            onValueChange={(value) => updateOnboardingData('dailyMinutes', parseInt(value))}
                                        >
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select daily minutes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10 minutes</SelectItem>
                                                <SelectItem value="20">20 minutes</SelectItem>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="45">45 minutes</SelectItem>
                                                <SelectItem value="60">60 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {
                                            onboardingData.dailyMinutes > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-6 p-4 bg-teal-50 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <CheckCircle className="w-5 h-5 text-teal-600" />
                                                        <span className="font-medium text-teal-900">
                                                            Perfect! You're all set.
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-teal-700">
                                                        With {onboardingData.dailyMinutes} minutes daily, you'll make great progress in {onboardingData.selectedLanguage}!
                                                    </p>
                                                </motion.div>
                                            )
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                        <div className="flex justify-between items-center pt-8 border-t mt-8">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6"
                            >
                                Previous
                            </Button>
                            {
                                currentStep < totalSteps ? (
                                    <Button
                                        onClick={nextStep}
                                        disabled={!isStepValid()}
                                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={completeOnboarding}
                                        disabled={!isStepValid() || isCompleting}
                                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8"
                                    >
                                        {isCompleting ? 'Setting up...' : 'Complete Setup'}
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                    </Button>
                                )
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingPage;