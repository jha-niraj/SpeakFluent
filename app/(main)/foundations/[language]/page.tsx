"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BookOpenText, Clock, Award, Lock, CheckCircle,
    Play, ArrowLeft, Trophy, Star, Target
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserFoundationProgress } from '@/actions/foundations.action';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ModuleContent {
    sections?: Array<{ title: string; duration: number;[key: string]: unknown }>;
    totalDuration?: number;
    difficulty?: string;
    estimatedCompletionTime?: string;
    [key: string]: unknown;
}

interface FoundationModule {
    id: string;
    moduleType: string;
    language: string;
    title: string;
    description: string;
    content: ModuleContent | null;
    orderIndex: number;
    requiredScore: number;
    creditsReward: number;
    isActive: boolean;
}

interface ModuleProgress {
    id: string;
    moduleId: string;
    status: string;
    progressPercent: number;
    bestScore?: number | null;
    completedAt?: Date | null;
    timeSpent?: number;
    module: {
        id: string;
        title: string;
        description: string;
        moduleType: string;
    };
}

interface FoundationData {
    modules: FoundationModule[];
    moduleProgress: ModuleProgress[];
    user: {
        selectedLanguage: string;
        selectedLevel: string;
    };
    stats: {
        overallProgress: number;
        completedModules: number;
        totalModules: number;
    };
}

const LanguageFoundationsPage = () => {
    const params = useParams();
    // const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [foundationData, setFoundationData] = useState<FoundationData | null>(null);
    const [modules, setModules] = useState<FoundationModule[]>([]);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);

    const language = params?.language as string;

    useEffect(() => {
        const fetchLanguageModules = async () => {
            if (session?.user?.id && language) {
                try {
                    const result = await getUserFoundationProgress();

                    if (result.success && result.data) {
                        const data = result.data as FoundationData;

                        // Filter modules for the specific language
                        const languageModules = data.modules.filter(m => m.language === language);
                        const languageProgress = data.moduleProgress.filter(p =>
                            languageModules.some(m => m.id === p.moduleId)
                        );

                        setFoundationData({
                            ...data,
                            modules: languageModules,
                            moduleProgress: languageProgress,
                            stats: {
                                ...data.stats,
                                totalModules: languageModules.length,
                                completedModules: languageProgress.filter(p => p.status === 'COMPLETED').length,
                                overallProgress: languageModules.length > 0
                                    ? Math.round((languageProgress.filter(p => p.status === 'COMPLETED').length / languageModules.length) * 100)
                                    : 0
                            }
                        });
                        setModules(languageModules.map(module => ({
                            ...module,
                            content: module.content as ModuleContent | null
                        })));
                        setModuleProgress(languageProgress);
                    } else {
                        toast.error(result.error || 'Failed to load modules');
                    }
                } catch (error) {
                    console.error('Error fetching language modules:', error);
                    toast.error('Failed to load modules');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchLanguageModules();
        }
    }, [session, status, language]);

    const getLanguageFlag = (lang: string) => {
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
        return flags[lang] || '🌍';
    };

    const formatLanguageName = (lang: string) => {
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    };

    const getModuleIcon = (moduleType: string) => {
        switch (moduleType) {
            case 'SCRIPT_WRITING':
                return '✍️';
            case 'PHONETICS_PRONUNCIATION':
                return '🗣️';
            case 'VOCABULARY_BUILDING':
                return '📚';
            case 'GRAMMAR_FUNDAMENTALS':
                return '📝';
            case 'CULTURAL_CONTEXT':
                return '🏛️';
            default:
                return '📖';
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

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const getModuleSlug = (moduleType: string) => {
        return moduleType.toLowerCase().replace('_', '-');
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <BookOpenText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-teal-600 font-medium">Loading modules...</p>
                </div>
            </div>
        );
    }

    if (!foundationData || modules.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">{getLanguageFlag(language)}</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {formatLanguageName(language)} Modules Not Available
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Foundation modules for {formatLanguageName(language)} are being prepared.
                        </p>
                        <Link href="/foundations">
                            <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Foundations
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-8">
                    <Link href="/foundations" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Languages
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{getLanguageFlag(language)}</div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {formatLanguageName(language)} Foundation
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Master the fundamentals of {formatLanguageName(language)}
                            </p>
                        </div>
                    </div>
                    <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-teal-600">
                                        {foundationData.stats.overallProgress}%
                                    </div>
                                    <div className="text-sm text-gray-600">Overall Progress</div>
                                    <Progress value={foundationData.stats.overallProgress} className="mt-2" />
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {foundationData.stats.completedModules}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed Modules</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {foundationData.stats.totalModules}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Modules</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {
                                            modules.reduce((total, module) => {
                                                const progress = getProgressForModule(module.id);
                                                return total + (progress?.bestScore || 0);
                                            }, 0)
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Total Points</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        modules.map((module, index) => {
                            const progress = getProgressForModule(module.id);
                            const status = getModuleStatus(module, index);
                            const isLocked = status === 'LOCKED';
                            const isCompleted = status === 'COMPLETED';
                            // const isAvailable = status === 'AVAILABLE' || status === 'IN_PROGRESS';

                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`relative overflow-hidden transition-all duration-300 ${isLocked
                                            ? 'bg-gray-100 border-gray-200'
                                            : 'bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg hover:scale-105'
                                        }`}>
                                        <div className={`h-2 bg-gradient-to-r ${getModuleColor(module.moduleType)}`} />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">
                                                        {getModuleIcon(module.moduleType)}
                                                    </div>
                                                    <div>
                                                        <CardTitle className={`text-lg ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                                            {module.title}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
                                                                Module {module.orderIndex}
                                                            </Badge>
                                                            {
                                                                module.content?.difficulty && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {module.content.difficulty}
                                                                    </Badge>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                                                {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <CardDescription className={`mb-4 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {module.description}
                                            </CardDescription>
                                            <div className="space-y-3 mb-4">
                                                {
                                                    module.content?.totalDuration && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock className="w-4 h-4" />
                                                            {formatDuration(module.content.totalDuration)}
                                                            {
                                                                module.content.estimatedCompletionTime && (
                                                                    <span className="text-gray-500">
                                                                        ({module.content.estimatedCompletionTime})
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Award className="w-4 h-4" />
                                                    {module.creditsReward} credits reward
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Target className="w-4 h-4" />
                                                    {module.requiredScore}% required to pass
                                                </div>
                                                {
                                                    module.content?.sections && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <BookOpenText className="w-4 h-4" />
                                                            {module.content.sections.length} sections
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {
                                                progress && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="font-medium">{progress.progressPercent}%</span>
                                                        </div>
                                                        <Progress value={progress.progressPercent} />
                                                        {
                                                            progress.bestScore && (
                                                                <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
                                                                    <Star className="w-3 h-3" />
                                                                    Best Score: {progress.bestScore}%
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                            <div className="mt-4">
                                                {
                                                    isLocked ? (
                                                        <Button disabled className="w-full">
                                                            <Lock className="w-4 h-4 mr-2" />
                                                            Locked
                                                        </Button>
                                                    ) : (
                                                        <Link href={`/foundations/${language}/${getModuleSlug(module.moduleType)}`}>
                                                            <Button
                                                                className={`w-full bg-gradient-to-r ${getModuleColor(module.moduleType)} hover:opacity-90`}
                                                            >
                                                                {
                                                                    isCompleted ? (
                                                                        <>
                                                                            <Trophy className="w-4 h-4 mr-2" />
                                                                            Review Module
                                                                        </>
                                                                    ) : progress ? (
                                                                        <>
                                                                            <Play className="w-4 h-4 mr-2" />
                                                                            Continue
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Play className="w-4 h-4 mr-2" />
                                                                            Start Module
                                                                        </>
                                                                    )
                                                                }
                                                            </Button>
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default LanguageFoundationsPage;