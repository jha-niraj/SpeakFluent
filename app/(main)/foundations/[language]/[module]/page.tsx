"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BookOpenText, Clock, ArrowLeft, ArrowRight,
    Play, CheckCircle, Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getModuleDetails, updateModuleProgress } from '@/actions/foundations.action';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Import learning components
import LessonComponent from '@/components/learning/LessonComponent';
import InteractiveLessonComponent from '@/components/learning/InteractiveLessonComponent';
import WritingExerciseComponent from '@/components/learning/WritingExerciseComponent';
import GameComponent from '@/components/learning/GameComponent';
import QuizComponent from '@/components/learning/QuizComponent';

interface ModuleSection {
    id: number;
    title: string;
    type: string;
    content: Record<string, unknown>;
    duration: number;
}

interface ModuleContent {
    sections: ModuleSection[];
    totalDuration: number;
    difficulty: string;
    estimatedCompletionTime?: string;
}

interface FoundationModule {
    id: string;
    moduleType: string;
    language: string;
    title: string;
    description: string;
    content: ModuleContent;
    orderIndex: number;
    requiredScore: number;
    creditsReward: number;
}

interface ModuleProgress {
    id: string;
    moduleId: string;
    status: string;
    progressPercent: number;
    currentSection?: string;
    timeSpent?: number;
    bestScore?: number;
    completedSections?: string; // JSON string of completed section IDs
}

const ModulePage = () => {
    const params = useParams();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [module, setModule] = useState<FoundationModule | null>(null);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress | null>(null);
    console.log('moduleProgress', moduleProgress);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [sectionProgress, setSectionProgress] = useState<Record<number, boolean>>({});
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [sectionStartTime, setSectionStartTime] = useState<Date | null>(null);

    const language = params?.language as string;
    const moduleSlug = params?.module as string;

    // Convert module slug back to module type
    const getModuleTypeFromSlug = (slug: string) => {
        return slug.toUpperCase().replace('-', '_');
    };

    useEffect(() => {
        const fetchModuleData = async () => {
            if (session?.user?.id && language && moduleSlug) {
                try {
                    const moduleType = getModuleTypeFromSlug(moduleSlug);
                    const result = await getModuleDetails(language, moduleType);

                    if (result.success && result.data) {
                        const moduleData = result.data.module;
                        const progressData = result.data.progress;

                        const moduleWithTypedContent: FoundationModule = {
                            ...moduleData,
                            content: moduleData.content as unknown as ModuleContent
                        };
                        setModule(moduleWithTypedContent);
                        setModuleProgress(progressData as ModuleProgress);

                        // Restore progress from database
                        if (progressData) {
                            setTotalTimeSpent(progressData.timeSpent || 0);

                            // Parse completed sections
                            let completedSectionsData: Record<number, boolean> = {};
                            if (progressData.completedSections) {
                                try {
                                    const completedSectionIds = JSON.parse(progressData.completedSections);
                                    completedSectionsData = completedSectionIds.reduce((acc: Record<number, boolean>, sectionId: number) => {
                                        acc[sectionId] = true;
                                        return acc;
                                    }, {});
                                } catch (error) {
                                    console.error('Error parsing completed sections:', error);
                                }
                            }
                            setSectionProgress(completedSectionsData);

                            // Determine current section to resume from
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const contentSections = (moduleData.content as any)?.sections || [];
                            if (progressData.status === 'COMPLETED') {
                                // Module is completed, start from the last section
                                setCurrentSectionIndex(contentSections.length);
                            } else if (progressData.currentSection) {
                                // Resume from saved section
                                const sectionId = parseInt(progressData.currentSection);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const sectionIndex = contentSections.findIndex((s: any) => s.id === sectionId);
                                if (sectionIndex !== -1) {
                                    setCurrentSectionIndex(sectionIndex + 1);
                                } else {
                                    // Find the next incomplete section
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const nextIncompleteIndex = contentSections.findIndex((s: any) => !completedSectionsData[s.id]);
                                    setCurrentSectionIndex(nextIncompleteIndex >= 0 ? nextIncompleteIndex : 0);
                                }
                            } else {
                                // Find the first incomplete section
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const nextIncompleteIndex = contentSections.findIndex((s: any) => !completedSectionsData[s.id]);
                                setCurrentSectionIndex(nextIncompleteIndex >= 0 ? nextIncompleteIndex + 1 : 0);
                            }
                        }
                    } else {
                        toast.error(result.error || 'Failed to load module');
                    }
                } catch (error) {
                    console.error('Error fetching module data:', error);
                    toast.error('Failed to load module');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchModuleData();
        }
    }, [session, status, language, moduleSlug]);

    console.log(module);
    console.log(currentSectionIndex);

    // Track time spent in current section
    useEffect(() => {
        setSectionStartTime(new Date());
        return () => {
            if (sectionStartTime) {
                const timeInSection = Math.floor((new Date().getTime() - sectionStartTime.getTime()) / 1000);
                setTotalTimeSpent(prev => prev + timeInSection);
            }
        };
    }, [currentSectionIndex, sectionStartTime]);

    const handleSectionComplete = async (sectionId: number) => {
        const newSectionProgress = { ...sectionProgress, [sectionId]: true };
        setSectionProgress(newSectionProgress);

        // Calculate progress percentage
        const completedSections = Object.keys(newSectionProgress).length;
        const totalSections = module?.content.sections.length || 1;
        const progressPercent = Math.round((completedSections / totalSections) * 100);

        // Prepare completed sections for database
        const completedSectionIds = Object.keys(newSectionProgress).map(key => parseInt(key));
        const completedSectionsJson = JSON.stringify(completedSectionIds);

        // Update progress in database
        if (module) {
            try {
                const newTimeSpent = totalTimeSpent + (sectionStartTime ?
                    Math.floor((new Date().getTime() - sectionStartTime.getTime()) / 1000) : 0);

                await updateModuleProgress(module.id, {
                    progressPercent,
                    currentSection: sectionId.toString(),
                    timeSpent: newTimeSpent,
                    status: progressPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS',
                    completedSections: completedSectionsJson
                });

                // Auto-advance to next incomplete section
                if (progressPercent < 100) {
                    const nextIncompleteSection = module.content.sections.find(section => !newSectionProgress[section.id]);
                    if (nextIncompleteSection) {
                        const nextIndex = module.content.sections.findIndex(s => s.id === nextIncompleteSection.id);
                        setTimeout(() => {
                            setCurrentSectionIndex(nextIndex);
                            toast.success('Section completed! Moving to next section...');
                        }, 1500);
                    }
                } else {
                    toast.success('Module completed! 🎉');
                }
            } catch (error) {
                console.error('Error updating progress:', error);
                toast.error('Failed to save progress');
            }
        }
    };

    const navigateToSection = (index: number) => {
        if (index >= 0 && index < (module?.content.sections.length || 0)) {
            setCurrentSectionIndex(index);
        }
    };

    const formatLanguageName = (lang: string) => {
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    };

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

    const renderSectionContent = (section: ModuleSection) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commonProps: any = {
            section: {
                ...section,
                content: section.content
            },
            onComplete: () => handleSectionComplete(section.id),
            language,
            moduleType: module?.moduleType
        };

        switch (section.type) {
            case 'lesson':
                return <LessonComponent {...commonProps} />;
            case 'interactive-lesson':
                return <InteractiveLessonComponent {...commonProps} />;
            case 'writing-exercise':
                return <WritingExerciseComponent {...commonProps} />;
            case 'game':
                return <GameComponent {...commonProps} />;
            case 'quiz':
                return <QuizComponent {...commonProps} moduleId={module?.id} />;
            default:
                return <LessonComponent {...commonProps} />;
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <BookOpenText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-teal-600 font-medium">Loading module...</p>
                </div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">{getLanguageFlag(language)}</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Module Not Found
                        </h1>
                        <p className="text-gray-600 mb-8">
                            The requested module could not be found.
                        </p>
                        <Link href={`/foundations/${language}`}>
                            <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to {formatLanguageName(language)} Modules
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentSection = module.content.sections[currentSectionIndex];
    const completedSections = Object.keys(sectionProgress).length;
    const totalSections = module.content.sections.length;
    const overallProgress = Math.round((completedSections / totalSections) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-6">
                    <Link
                        href={`/foundations/${language}`}
                        className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {formatLanguageName(language)} Modules
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{getLanguageFlag(language)}</div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {module.title}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {module.description}
                            </p>
                        </div>
                    </div>
                    <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Overall Progress</div>
                                    <div className="flex items-center gap-2">
                                        <Progress value={overallProgress} className="flex-1" />
                                        <span className="text-sm font-medium">{overallProgress}%</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-teal-600">
                                        {currentSectionIndex + 1} / {totalSections}
                                    </div>
                                    <div className="text-sm text-gray-600">Current Section</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-emerald-600">
                                        {Math.floor(totalTimeSpent / 60)}m
                                    </div>
                                    <div className="text-sm text-gray-600">Time Spent</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">
                                        {module.creditsReward}
                                    </div>
                                    <div className="text-sm text-gray-600">Credits Reward</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 sticky top-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Sections</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {
                                        module.content.sections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`p-3 rounded-lg cursor-pointer transition-all ${index === currentSectionIndex
                                                        ? 'bg-teal-500 text-white'
                                                        : sectionProgress[section.id]
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                onClick={() => navigateToSection(index)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-shrink-0">
                                                        {
                                                            sectionProgress[section.id] ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : index === currentSectionIndex ? (
                                                                <Play className="w-4 h-4" />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full border-2 border-current" />
                                                            )
                                                        }
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium text-sm truncate">
                                                            {section.title}
                                                        </div>
                                                        <div className="text-xs opacity-75">
                                                            {section.duration}m • {section.type.replace('-', ' ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-3">
                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 min-h-[600px]">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {currentSection?.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {currentSection?.duration} minutes
                                            </span>
                                            <Badge variant="outline">
                                                {currentSection?.type.replace('-', ' ')}
                                            </Badge>
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigateToSection(currentSectionIndex - 1)}
                                            disabled={currentSectionIndex === 0}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigateToSection(currentSectionIndex + 1)}
                                            disabled={currentSectionIndex === module.content.sections.length - 1}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSection?.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentSection && renderSectionContent(currentSection)}
                                    </motion.div>
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                        <div className="flex justify-between items-center mt-6">
                            <div>
                                {
                                    currentSectionIndex > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => navigateToSection(currentSectionIndex - 1)}
                                            className="border-teal-200 text-teal-700 hover:bg-teal-50"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Previous Section
                                        </Button>
                                    )
                                }
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Section {currentSectionIndex + 1} of {totalSections}
                                </p>
                            </div>
                            <div>
                                {
                                    currentSectionIndex < module.content.sections.length - 1 ? (
                                        <Button
                                            onClick={() => navigateToSection(currentSectionIndex + 1)}
                                            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                                            disabled={!sectionProgress[currentSection?.id]}
                                        >
                                            Next Section
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : sectionProgress[currentSection?.id] ? (
                                        <Button
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                        >
                                            <Trophy className="w-4 h-4 mr-2" />
                                            Module Complete!
                                        </Button>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModulePage; 