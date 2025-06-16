"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BookOpenText, Languages, Award, Lock, CheckCircle,
    Play, Settings, Mic, Globe, PenTool, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getUserFoundationProgress, initializeFoundationModules } from '@/actions/foundations.action';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface FoundationModule {
    id: string;
    moduleType: string;
    language: string;
    title: string;
    description: string;
    content: any;
    orderIndex: number;
    requiredScore: number;
    creditsReward: number;
    isActive: boolean;
}

interface ModuleProgress {
    id: string;
    userId: string;
    moduleId: string;
    language: string;
    status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
    progressPercent: number;
    currentSection?: string;
    timeSpent: number;
    bestScore?: number;
    completedAt?: Date;
    lastAccessedAt?: Date;
    module: FoundationModule;
}

const FoundationsPage = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [foundationData, setFoundationData] = useState<any>(null);
    const [modules, setModules] = useState<FoundationModule[]>([]);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);

    useEffect(() => {
        const fetchFoundationData = async () => {
            if (session?.user?.id) {
                try {
                    const result = await getUserFoundationProgress();

                    if (result.success) {
                        setFoundationData(result.data);
                        setModules(result?.data?.modules || []);
                        setModuleProgress(result?.data?.moduleProgress || []);

                        // Initialize modules if none exist for the selected language
                        if (result?.data?.modules.length === 0 && result?.data?.user?.selectedLanguage) {
                            await initializeFoundationModules(result.data.user.selectedLanguage);
                            // Refetch data after initialization
                            const updatedResult = await getUserFoundationProgress();
                            if (updatedResult.success) {
                                setFoundationData(updatedResult.data);
                                setModules(updatedResult?.data?.modules || []);
                                setModuleProgress(updatedResult?.data?.moduleProgress || []);
                            }
                        }
                    } else {
                        toast.error(result.error || 'Failed to load foundation data');
                    }
                } catch (error) {
                    console.error('Error fetching foundation data:', error);
                    toast.error('Failed to load foundation data');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchFoundationData();
        }
    }, [session, status]);

    const getModuleIcon = (moduleType: string) => {
        switch (moduleType) {
            case 'SCRIPT_WRITING':
                return PenTool;
            case 'PHONETICS_PRONUNCIATION':
                return Mic;
            case 'VOCABULARY_BUILDING':
                return BookOpenText;
            case 'GRAMMAR_FUNDAMENTALS':
                return Languages;
            case 'CULTURAL_CONTEXT':
                return Globe;
            default:
                return BookOpenText;
        }
    };

    const getModuleColor = (moduleType: string) => {
        switch (moduleType) {
            case 'SCRIPT_WRITING':
                return 'from-teal-500 to-emerald-600';
            case 'PHONETICS_PRONUNCIATION':
                return 'from-emerald-500 to-green-600';
            case 'VOCABULARY_BUILDING':
                return 'from-green-500 to-teal-500';
            case 'GRAMMAR_FUNDAMENTALS':
                return 'from-teal-600 to-emerald-700';
            case 'CULTURAL_CONTEXT':
                return 'from-emerald-600 to-green-700';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getProgressForModule = (moduleId: string) => {
        return moduleProgress.find(p => p.moduleId === moduleId);
    };

    const getModuleStatus = (module: FoundationModule, index: number) => {
        const progress = getProgressForModule(module.id);
        if (progress) return progress.status;

        // First module is always available, others are locked until previous is completed
        if (index === 0) return 'AVAILABLE';

        const previousModule = modules[index - 1];
        const previousProgress = getProgressForModule(previousModule.id);

        return previousProgress?.status === 'COMPLETED' ? 'AVAILABLE' : 'LOCKED';
    };

    const formatLanguageName = (language: string) => {
        return language.charAt(0).toUpperCase() + language.slice(1);
    };

    const getLanguageFlag = (language: string) => {
        const flags: Record<string, string> = {
            russian: '🇷🇺',
            japanese: '🇯🇵',
            korean: '🇰🇷',
            spanish: '🇪🇸',
            french: '🇫🇷',
            german: '🇩🇪',
            chinese: '🇨🇳',
            english: '🇺🇸'
        };
        return flags[language] || '🌍';
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <BookOpenText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600">Loading foundation modules...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access foundation modules</h1>
                    <Link href="/signin">
                        <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!foundationData?.user?.selectedLanguage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Languages className="w-10 h-10 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Select Your Language</h1>
                    <p className="text-gray-600 mb-6">
                        Please complete your onboarding or select a language in your profile to access foundation modules.
                    </p>
                    <div className="space-y-3">
                        <Link href="/profile">
                            <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                                <Settings className="w-4 h-4 mr-2" />
                                Go to Profile
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <BookOpenText className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Foundation Modules
                    </h1>
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Badge className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2 text-lg">
                            {getLanguageFlag(foundationData.user.selectedLanguage)} {formatLanguageName(foundationData.user.selectedLanguage)}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                            {foundationData.user.selectedLevel || 'Beginner'}
                        </Badge>
                    </div>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Master the fundamentals before advancing to AI conversations. Complete these modules to build a strong foundation in {formatLanguageName(foundationData.user.selectedLanguage)}.
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-100 shadow-lg max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                            <Badge variant="outline" className="text-teal-600 border-teal-200">
                                {foundationData.stats.overallProgress}%
                            </Badge>
                        </div>
                        <Progress
                            value={foundationData.stats.overallProgress}
                            className="h-3 mb-3"
                        />
                        <p className="text-sm text-gray-600">
                            {foundationData.stats.completedModules} of {foundationData.stats.totalModules} modules completed
                        </p>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">
                            Want to learn a different language?
                            <Link href="/profile" className="text-teal-600 hover:text-teal-700 ml-1 underline">
                                Change in Profile
                            </Link>
                        </p>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {
                        modules.map((module, index) => {
                            const IconComponent = getModuleIcon(module.moduleType);
                            const progress = getProgressForModule(module.id);
                            const status = getModuleStatus(module, index);
                            const isLocked = status === 'LOCKED';
                            const isCompleted = status === 'COMPLETED';

                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full ${isLocked
                                            ? 'bg-gray-50 opacity-75'
                                            : isCompleted
                                                ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                                                : 'bg-white hover:scale-105'
                                        }`}>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${getModuleColor(module.moduleType)} ${isLocked ? 'opacity-50' : ''
                                                    }`}>
                                                    {
                                                        isLocked ? (
                                                            <Lock className="w-8 h-8 text-white" />
                                                        ) : isCompleted ? (
                                                            <CheckCircle className="w-8 h-8 text-white" />
                                                        ) : (
                                                            <IconComponent className="w-8 h-8 text-white" />
                                                        )
                                                    }
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={
                                                        isCompleted
                                                            ? 'bg-emerald-500 text-white'
                                                            : isLocked
                                                                ? 'bg-gray-400 text-white'
                                                                : 'bg-teal-500 text-white'
                                                    }>
                                                        {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardTitle className={`text-xl mb-2 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                                {module.title}
                                            </CardTitle>
                                            <CardDescription className={`text-base leading-relaxed ${isLocked ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                {module.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isLocked ? 'text-gray-400' : 'text-teal-600'}`}>
                                                        {module.content?.totalDuration || 45}
                                                    </div>
                                                    <div className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Minutes
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isLocked ? 'text-gray-400' : 'text-emerald-600'}`}>
                                                        {module.requiredScore}%
                                                    </div>
                                                    <div className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Pass Score
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isLocked ? 'text-gray-400' : 'text-amber-600'}`}>
                                                        {module.creditsReward}
                                                    </div>
                                                    <div className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Credits
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                progress && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {progress.progressPercent}%
                                                            </span>
                                                        </div>
                                                        <Progress value={progress.progressPercent} className="h-2" />
                                                        {
                                                            progress.bestScore && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Best Score: {progress.bestScore}%
                                                                </p>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                            <div className="space-y-2 mb-6">
                                                <h4 className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    What you&apos;ll learn:
                                                </h4>
                                                <div className="space-y-1">
                                                    {
                                                        module.content?.sections?.slice(0, 3).map((section: any, idx: number) => (
                                                            <div key={idx} className={`flex items-center text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isLocked ? 'bg-gray-300' : 'bg-teal-500'
                                                                    }`}></div>
                                                                {section.title}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <Button
                                                disabled={isLocked}
                                                className={`w-full ${isLocked
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : isCompleted
                                                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                                                            : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                                                    } transition-all duration-300`}
                                            >
                                                {
                                                    isLocked ? (
                                                        <>
                                                            <Lock className="w-4 h-4 mr-2" />
                                                            Complete Previous Module
                                                        </>
                                                    ) : isCompleted ? (
                                                        <>
                                                            <Award className="w-4 h-4 mr-2" />
                                                            Review Module
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="w-4 h-4 mr-2" />
                                                            {progress ? 'Continue Learning' : 'Start Module'}
                                                        </>
                                                    )
                                                }
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    }
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 rounded-3xl p-12 border border-teal-200/50">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                            Ready to Master {formatLanguageName(foundationData.user.selectedLanguage)}?
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Complete all foundation modules to unlock advanced AI conversations and premium features.
                            Each module builds upon the previous one for optimal learning.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="outline" size="lg" className="px-8">
                                    Back to Dashboard
                                </Button>
                            </Link>
                            {
                                foundationData.stats.overallProgress === 100 && (
                                    <Link href="/conversation">
                                        <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8">
                                            <MessageSquare className="w-5 h-5 mr-2" />
                                            Start AI Conversations
                                        </Button>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FoundationsPage; 