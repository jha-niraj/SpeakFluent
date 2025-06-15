"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Mic, MessageSquare, Star, Coins, Globe, Plus, 
    Target, Flame, LogIn, Languages, Headphones, 
    Video, Zap, Shield, X, Trash2, ArrowRight, Users, 
    BookOpenText, CreditCard, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getUserCredits } from '@/actions/credits.action';
import { getUserWeeklyGoals, createWeeklyGoal, createMultipleGoals, toggleGoalCompletion, deleteWeeklyGoal, createPresetGoals } from '@/actions/dashboard.action';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface WeeklyGoalProps {
    id: string;
    title: string;
    description: string | null;
    category: string;
    type: 'PRESET' | 'CUSTOM';
    completed: boolean;
    completedAt: Date | null;
}

const Dashboard = () => {
    const { data: session, status } = useSession();
    const [credits, setCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoalProps[]>([]);
    
    // Weekly Goals Dialog States
    const [showGoalsDialog, setShowGoalsDialog] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState('');
    const [selectedPresetGoals, setSelectedPresetGoals] = useState<string[]>([]);
    const [isCreatingGoal, setIsCreatingGoal] = useState(false);
    const [activeTab, setActiveTab] = useState('preset');

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const [userCredits, goalsResult] = await Promise.all([
                        getUserCredits(),
                        getUserWeeklyGoals()
                    ]);
                    
                    setCredits(userCredits);
                    
                    if (goalsResult.success) {
                        setWeeklyGoals(goalsResult.goals || []);
                        
                        // Create preset goals if none exist
                        if (goalsResult.goals?.length === 0) {
                            await createPresetGoals();
                            const updatedGoals = await getUserWeeklyGoals();
                            if (updatedGoals.success) {
                                setWeeklyGoals(updatedGoals.goals || []);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchData();
        }
    }, [session, status]);

    const handleCreateGoal = async () => {
        if (activeTab === 'preset') {
            // Handle preset goals creation
            if (selectedPresetGoals.length === 0) {
                toast.error('Please select at least one goal');
                return;
            }

            setIsCreatingGoal(true);
            try {
                const presetGoalsData = selectedPresetGoals.map(goalTitle => {
                    const goalInfo = getPresetGoalInfo(goalTitle);
                    return {
                        title: goalTitle,
                        category: goalInfo.category,
                        type: 'PRESET' as const
                    };
                });

                const result = await createMultipleGoals(presetGoalsData);

                if (result.success) {
                    setWeeklyGoals(prev => [...(result.goals || []), ...prev]);
                    setSelectedPresetGoals([]);
                    setShowGoalsDialog(false);
                    toast.success(`${selectedPresetGoals.length} goals created successfully! 🎯`);
                } else {
                    toast.error(result.error || 'Failed to create goals');
                }
            } catch (error) {
                console.error('Error creating preset goals:', error);
                toast.error('Failed to create goals');
            } finally {
                setIsCreatingGoal(false);
            }
        } else {
            // Handle custom goal creation
            if (!newGoalTitle.trim()) {
                toast.error('Please enter a goal title');
                return;
            }

            setIsCreatingGoal(true);
            try {
                const result = await createWeeklyGoal({
                    title: newGoalTitle,
                    description: newGoalDescription,
                    category: newGoalCategory || 'custom',
                    type: 'CUSTOM'
                });

                if (result.success) {
                    setWeeklyGoals(prev => [result.goal || {
                        id: '', 
                        title: '', 
                        description: '', 
                        category: '', 
                        type: 'CUSTOM', 
                        completed: false, 
                        completedAt: null 
                    }, ...prev]);
                    setNewGoalTitle('');
                    setNewGoalDescription('');
                    setNewGoalCategory('');
                    setShowGoalsDialog(false);
                    toast.success('Goal created successfully! 🎯');
                } else {
                    toast.error(result.error || 'Failed to create goal');
                }
            } catch (error) {
                console.error('Error creating goal:', error);
                toast.error('Failed to create goal');
            } finally {
                setIsCreatingGoal(false);
            }
        }
    };

    const getPresetGoalInfo = (title: string) => {
        const goalMap: Record<string, { category: string }> = {
            "Complete 3 conversations this week": { category: "conversations" },
            "Practice speaking for 30 minutes daily": { category: "speaking" },
            "Learn 20 new vocabulary words": { category: "vocabulary" },
            "Watch 2 language learning videos": { category: "videos" },
            "Read one article in target language": { category: "reading" },
            "Practice pronunciation for 15 minutes daily": { category: "pronunciation" }
        };
        return goalMap[title] || { category: "custom" };
    };

    const handlePresetGoalToggle = (goalTitle: string) => {
        setSelectedPresetGoals(prev => 
            prev.includes(goalTitle) 
                ? prev.filter(g => g !== goalTitle)
                : [...prev, goalTitle]
        );
    };

    const handleToggleGoal = async (goalId: string) => {
        try {
            const result = await toggleGoalCompletion(goalId);
            
            if (result.success) {
                setWeeklyGoals(prev => 
                    prev.map(goal => 
                        goal.id === goalId 
                            ? { ...goal, completed: !goal.completed, completedAt: !goal.completed ? new Date() : null }
                            : goal
                    )
                );
                toast.success('Goal updated! 🎉');
            } else {
                toast.error(result.error || 'Failed to update goal');
            }
        } catch (error) {
            console.error('Error toggling goal:', error);
            toast.error('Failed to update goal');
        }
    };

    const handleDeleteGoal = async (goalId: string) => {
        try {
            const result = await deleteWeeklyGoal(goalId);
            
            if (result.success) {
                setWeeklyGoals(prev => prev.filter(goal => goal.id !== goalId));
                toast.success('Goal deleted successfully');
            } else {
                toast.error(result.error || 'Failed to delete goal');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            toast.error('Failed to delete goal');
        }
    };

    // Show sign-in prompt if user is not authenticated
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Languages className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        {/* Hero Icon */}
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <Languages className="w-12 h-12 text-white" />
                        </div>

                        {/* Welcome Message */}
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">SpeakFluent</span>! 🌍
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Master any language with AI-powered conversations. Practice with intelligent tutors, get real-time feedback, and speak fluently with confidence.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Conversations</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Practice with intelligent AI tutors that adapt to your level and provide personalized feedback
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Mic className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice Training</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Perfect your pronunciation with real-time analysis and accent coaching technology
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Languages</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Learn any language from Spanish to Mandarin with culturally-aware conversation partners
                                </p>
                            </motion.div>
                        </div>

                        {/* Languages Supported */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Popular Languages</h3>
                            <div className="flex flex-wrap justify-center items-center gap-4">
                                {[
                                    { lang: "🇺🇸 English", color: "bg-blue-50 text-blue-700 border-blue-200" },
                                    { lang: "🇪🇸 Spanish", color: "bg-red-50 text-red-700 border-red-200" },
                                    { lang: "🇫🇷 French", color: "bg-teal-50 text-teal-700 border-teal-200" },
                                    { lang: "🇩🇪 German", color: "bg-gray-50 text-gray-700 border-gray-200" },
                                    { lang: "🇨🇳 Chinese", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                                    { lang: "🇯🇵 Japanese", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                                    { lang: "🇮🇹 Italian", color: "bg-green-50 text-green-700 border-green-200" },
                                    { lang: "🇵🇹 Portuguese", color: "bg-cyan-50 text-cyan-700 border-cyan-200" }
                                ].map((item, index) => (
                                    <Badge key={index} variant="outline" className={`${item.color} px-4 py-2 text-sm font-medium`}>
                                        {item.lang}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 rounded-3xl p-12 border border-teal-200/50"
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                Ready to Start Speaking?
                            </h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Join millions of learners worldwide. Sign in to get started with 300 free credits and begin your language journey today!
                            </p>
                            <Link href="/signin">
                                <Button 
                                    size="lg"
                                    className="bg-gradient-to-r from-teal-500 via-emerald-600 to-green-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Start Learning Free
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 text-center"
                        >
                            <p className="text-sm text-gray-500 mb-6">
                                Trusted by language learners worldwide
                            </p>
                            <div className="flex justify-center items-center space-x-12 text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm font-medium">2M+ Learners</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-sm font-medium">50M+ Conversations</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5" />
                                    <span className="text-sm font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-medium">100+ Languages</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Rest of the existing dashboard code for authenticated users...
    const statsData = [
        {
            title: "Speaking Time",
            value: "47 mins",
            icon: Mic,
            description: "This week",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            change: "+15%"
        },
        {
            title: "Conversations",
            value: "12",
            icon: MessageSquare,
            description: "Completed",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            change: "+3"
        },
        {
            title: "Credits",
            value: isLoading ? "..." : credits.toString(),
            icon: Coins,
            description: "Available",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            change: credits > 50 ? "Good" : "Low"
        },
        {
            title: "Learning Streak",
            value: "7 days",
            icon: Flame,
            description: "Current streak",
            color: "text-green-600",
            bgColor: "bg-green-50",
            change: "+1"
        }
    ];

    const learningModes = [
        {
            id: 'conversation',
            title: 'AI Conversation',
            subtitle: 'Practice with AI Tutor',
            description: 'Have natural conversations with our advanced AI language tutor. Perfect for improving fluency and confidence.',
            icon: MessageSquare,
            color: 'from-teal-500 to-emerald-600',
            textColor: 'text-teal-600',
            bgColor: 'bg-teal-50',
            credits: '10 credits per session',
            level: 'All Levels',
            href: '/conversation',
            available: true,
            popular: true
        },
        {
            id: 'voicecoach',
            title: 'Voice Coach',
            subtitle: 'Pronunciation Training',
            description: 'Advanced pronunciation analysis and correction with real-time feedback to perfect your accent.',
            icon: Mic,
            color: 'from-emerald-500 to-green-600',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            credits: '15 credits per session',
            level: 'Intermediate+',
            href: '/voice-coach',
            available: false,
            popular: false
        },
        {
            id: 'scenarios',
            title: 'Real-Life Scenarios',
            subtitle: 'Situational Practice',
            description: 'Practice common situations like ordering food, job interviews, or asking for directions.',
            icon: Users,
            color: 'from-green-500 to-teal-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            credits: '12 credits per scenario',
            level: 'Beginner+',
            href: '/scenarios',
            available: false,
            popular: false
        },
        {
            id: 'stories',
            title: 'Interactive Stories',
            subtitle: 'Learn Through Stories',
            description: 'Engage with interactive stories that adapt to your responses and teach language naturally.',
            icon: BookOpenText,
            color: 'from-cyan-500 to-teal-600',
            textColor: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            credits: '8 credits per story',
            level: 'All Levels',
            href: '/stories',
            available: false,
            popular: false
        }
    ];

    const quickActions = [
        {
            title: 'Start Conversation',
            description: 'Begin an AI-powered language session',
            icon: MessageSquare,
            color: 'bg-gradient-to-r from-teal-500 to-emerald-600',
            href: '/conversation'
        },
        {
            title: 'Buy Credits',
            description: 'Purchase credits for premium features',
            icon: CreditCard,
            color: 'bg-gradient-to-r from-amber-500 to-orange-600',
            href: '/purchase'
        },
        {
            title: 'Learning Progress',
            description: 'Track your improvement and goals',
            icon: TrendingUp,
            color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            href: '/progress'
        }
    ];

    const platformFeatures = [
        {
            title: "Real-time AI Conversations",
            description: "Practice with advanced AI tutors that understand context and provide meaningful responses",
            icon: MessageSquare,
            color: "from-teal-500 to-emerald-600"
        },
        {
            title: "Pronunciation Analysis",
            description: "Get instant feedback on your pronunciation with our advanced speech recognition technology",
            icon: Headphones,
            color: "from-emerald-500 to-green-600"
        },
        {
            title: "Video Lessons",
            description: "Learn from native speakers with interactive video content and cultural insights",
            icon: Video,
            color: "from-green-500 to-teal-500"
        },
        {
            title: "Progress Tracking",
            description: "Monitor your learning journey with detailed analytics and personalized recommendations",
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-600"
        },
        {
            title: "Interactive Exercises",
            description: "Reinforce your learning with gamified exercises and real-world scenarios",
            icon: Zap,
            color: "from-amber-500 to-orange-600"
        },
        {
            title: "Secure & Private",
            description: "Your learning data is encrypted and secure. Practice with confidence and privacy",
            icon: Shield,
            color: "from-teal-500 to-cyan-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-medium text-gray-900 mb-4">
                            Welcome back, {session?.user?.name?.split(' ')[0] || 'Learner'}! 👋
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Ready to continue your language learning journey? Let&apos;s make today count!
                        </p>
                        <div className="flex justify-center items-center space-x-4 mb-6">
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                                🌍 Global Platform • 100+ Languages
                            </Badge>
                        </div>
                        
                        {/* Weekly Goals Button */}
                        <Button
                            onClick={() => setShowGoalsDialog(true)}
                            className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <Target className="w-5 h-5 mr-2" />
                            Set Weekly Goals
                        </Button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                                    <CardHeader className="pb-3 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                                <IconComponent className={`h-6 w-6 ${stat.color}`} />
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${stat.change.includes('+') ? 'text-emerald-600' : stat.change === 'Low' ? 'text-red-600' : 'text-blue-600'}`}>
                                                    {stat.change.includes('+') && <TrendingUp className="w-4 h-4 inline mr-1" />}
                                                    {stat.change}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-0">
                                        <div className="space-y-2">
                                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-lg font-semibold text-gray-900">{stat.title}</p>
                                            <p className="text-sm text-gray-500">{stat.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <Link href={action.href}>
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer group hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900">{action.title}</h4>
                                                        <p className="text-sm text-gray-600">{action.description}</p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Goals */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-medium text-gray-900">This Week&apos;s Goals</h3>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {weeklyGoals.filter(goal => goal.completed).length} of {weeklyGoals.length} completed
                        </Badge>
                    </div>
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-8">
                            {weeklyGoals.length > 0 ? (
                                <div className="space-y-4">
                                    {weeklyGoals.map((goal, index) => (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                                                goal.completed 
                                                    ? 'bg-emerald-50 border border-emerald-200' 
                                                    : 'bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {goal.type === 'CUSTOM' ? (
                                                    <Checkbox
                                                        checked={goal.completed}
                                                        onCheckedChange={() => handleToggleGoal(goal.id)}
                                                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                    />
                                                ) : (
                                                    <div className={`p-2 rounded-lg ${
                                                        goal.completed ? 'bg-emerald-100' : 'bg-teal-100'
                                                    }`}>
                                                        <Target className={`w-4 h-4 ${
                                                            goal.completed ? 'text-emerald-600' : 'text-teal-600'
                                                        }`} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-base font-medium ${
                                                    goal.completed ? 'text-emerald-900 line-through' : 'text-gray-900'
                                                }`}>
                                                    {goal.title}
                                                </p>
                                                {goal.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                                )}
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {goal.type === 'PRESET' ? 'Auto-tracked' : 'Custom'}
                                                    </Badge>
                                                    {goal.completedAt && (
                                                        <span className="text-xs text-emerald-600">
                                                            Completed {new Date(goal.completedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {goal.type === 'CUSTOM' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No goals set for this week</p>
                                    <Button
                                        onClick={() => setShowGoalsDialog(true)}
                                        variant="outline"
                                        className="text-teal-600 border-teal-200 hover:bg-teal-50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Goal
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Learning Modes */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-bold text-gray-900">Learning Modes</h3>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-sm px-4 py-2">
                            1 Available • 3 Coming Soon
                        </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {learningModes.map((mode, index) => {
                            const IconComponent = mode.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                >
                                    <Card className={`
                                        group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 
                                        ${mode.available ? 'hover:-translate-y-2 bg-white/95' : 'bg-gray-50/90'}
                                        backdrop-blur-sm ${!mode.available ? 'opacity-80' : ''}
                                    `}>
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                                        
                                        <CardHeader className="relative p-8">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-4 rounded-3xl ${mode.bgColor} ${mode.available ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                                                        <IconComponent className={`h-8 w-8 ${mode.textColor}`} />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                                            {mode.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-base font-medium text-gray-600">
                                                            {mode.subtitle}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    {mode.popular && (
                                                        <Badge className="bg-teal-500 text-white">
                                                            Most Popular
                                                        </Badge>
                                                    )}
                                                    {!mode.available && (
                                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                            Coming Soon
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-sm">
                                                        {mode.level}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="relative pt-0 p-8">
                                            <p className="text-gray-600 mb-6 leading-relaxed text-base">
                                                {mode.description}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-6">{mode.credits}</p>

                                            {mode.available ? (
                                                <Link href={mode.href}>
                                                    <Button
                                                        className={`w-full bg-gradient-to-r ${mode.color} text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-300 py-3 text-base font-semibold`}
                                                        disabled={credits < 10}
                                                    >
                                                        {credits < 10 ? 'Need More Credits' : 'Start Session'}
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full py-3 text-base"
                                                    disabled
                                                >
                                                    Coming Soon
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Platform Features Section */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose SpeakFluent?
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Advanced AI technology meets language learning expertise to give you the most effective and engaging experience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {platformFeatures.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3 + index * 0.1 }}
                                >
                                    <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <CardContent className="p-8 text-center">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Credits Warning */}
                {credits < 50 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mb-8"
                    >
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
                            <CardContent className="p-8">
                                <div className="flex items-center space-x-6">
                                    <div className="p-4 rounded-full bg-amber-100">
                                        <Coins className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-amber-900 mb-2">Running Low on Credits?</h4>
                                        <p className="text-base text-amber-700">
                                            You have {credits} credits remaining. Purchase more to continue your learning journey without interruption!
                                        </p>
                                    </div>
                                    <Link href="/purchase">
                                        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 text-base font-semibold hover:shadow-lg">
                                            Buy Credits
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Weekly Goals Dialog */}
            <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                            <Target className="w-6 h-6 mr-3 text-teal-600" />
                            Set Your Weekly Goals
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600">
                            Create personalized learning goals to stay motivated and track your progress. You can mark custom goals as complete when you achieve them.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        {/* Current Goals */}
                        {weeklyGoals.length > 0 && (
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Current Goals</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                    {weeklyGoals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${
                                                goal.completed 
                                                    ? 'bg-emerald-50 border-emerald-200' 
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {goal.type === 'CUSTOM' ? (
                                                    <Checkbox
                                                        checked={goal.completed}
                                                        onCheckedChange={() => handleToggleGoal(goal.id)}
                                                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                    />
                                                ) : (
                                                    <div className={`p-1.5 rounded ${
                                                        goal.completed ? 'bg-emerald-100' : 'bg-teal-100'
                                                    }`}>
                                                        <Target className={`w-3 h-3 ${
                                                            goal.completed ? 'text-emerald-600' : 'text-teal-600'
                                                        }`} />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${
                                                        goal.completed ? 'text-emerald-900 line-through' : 'text-gray-900'
                                                    }`}>
                                                        {goal.title}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {goal.type === 'PRESET' ? 'Auto-tracked' : 'Custom'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            {goal.type === 'CUSTOM' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Goal Form */}
                        <div className="border-t pt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Goals</h4>
                            
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="preset">Preset Goals</TabsTrigger>
                                    <TabsTrigger value="custom">Custom Goal</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="preset" className="space-y-4">
                                    <p className="text-sm text-gray-600 mb-4">Select from common language learning goals (these will be auto-tracked):</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            "Complete 3 conversations this week",
                                            "Practice speaking for 30 minutes daily",
                                            "Learn 20 new vocabulary words",
                                            "Watch 2 language learning videos",
                                            "Read one article in target language",
                                            "Practice pronunciation for 15 minutes daily"
                                        ].map((goalTitle, index) => {
                                            const isSelected = selectedPresetGoals.includes(goalTitle);
                                            const isAlreadyExists = weeklyGoals.some(goal => goal.title === goalTitle);
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                                        isAlreadyExists 
                                                            ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                                                            : isSelected 
                                                                ? 'bg-teal-50 border-teal-300 shadow-md' 
                                                                : 'bg-white border-gray-200 hover:border-teal-200 hover:bg-teal-25'
                                                    }`}
                                                    onClick={() => !isAlreadyExists && handlePresetGoalToggle(goalTitle)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            disabled={isAlreadyExists}
                                                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                                        />
                                                        <div className="flex-1">
                                                            <span className={`text-sm font-medium ${
                                                                isAlreadyExists ? 'text-gray-500' : 'text-gray-900'
                                                            }`}>
                                                                {goalTitle}
                                                            </span>
                                                            {isAlreadyExists && (
                                                                <p className="text-xs text-gray-500 mt-1">Already added</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {selectedPresetGoals.length > 0 && (
                                        <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                                            <p className="text-sm font-medium text-teal-800 mb-2">
                                                Selected Goals ({selectedPresetGoals.length}):
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPresetGoals.map((goal, index) => (
                                                    <Badge key={index} variant="outline" className="bg-teal-100 text-teal-700 border-teal-300">
                                                        {goal}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                
                                <TabsContent value="custom" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="goal-title" className="text-sm font-medium text-gray-700">
                                                    Goal Title *
                                                </Label>
                                                <Input
                                                    id="goal-title"
                                                    placeholder="e.g., Practice Spanish conversation for 20 minutes daily"
                                                    value={newGoalTitle}
                                                    onChange={(e) => setNewGoalTitle(e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="goal-category" className="text-sm font-medium text-gray-700">
                                                    Category
                                                </Label>
                                                <Select value={newGoalCategory} onValueChange={setNewGoalCategory}>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Choose a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="conversations">Conversations</SelectItem>
                                                        <SelectItem value="speaking">Speaking Practice</SelectItem>
                                                        <SelectItem value="vocabulary">Vocabulary</SelectItem>
                                                        <SelectItem value="pronunciation">Pronunciation</SelectItem>
                                                        <SelectItem value="reading">Reading</SelectItem>
                                                        <SelectItem value="writing">Writing</SelectItem>
                                                        <SelectItem value="listening">Listening</SelectItem>
                                                        <SelectItem value="grammar">Grammar</SelectItem>
                                                        <SelectItem value="custom">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="goal-description" className="text-sm font-medium text-gray-700">
                                                Description (Optional)
                                            </Label>
                                            <Textarea
                                                id="goal-description"
                                                placeholder="Add more details about your goal, how you plan to achieve it, or why it's important to you..."
                                                value={newGoalDescription}
                                                onChange={(e) => setNewGoalDescription(e.target.value)}
                                                className="mt-1 resize-none"
                                                rows={6}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowGoalsDialog(false);
                                setNewGoalTitle('');
                                setNewGoalDescription('');
                                setNewGoalCategory('');
                                setSelectedPresetGoals([]);
                                setActiveTab('preset');
                            }}
                            className="px-6"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Close
                        </Button>
                        
                        <Button
                            onClick={handleCreateGoal}
                            disabled={isCreatingGoal || (activeTab === 'preset' ? selectedPresetGoals.length === 0 : !newGoalTitle.trim())}
                            className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 hover:shadow-lg"
                        >
                            {isCreatingGoal ? (
                                <>Creating...</>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {activeTab === 'preset' 
                                        ? `Add ${selectedPresetGoals.length} Goal${selectedPresetGoals.length !== 1 ? 's' : ''}`
                                        : 'Add Goal'
                                    }
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;