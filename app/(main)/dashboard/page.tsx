"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Mic, MessageSquare, BookOpenText, Users, Clock, Star, Coins, 
    TrendingUp, Calendar, Globe, ArrowRight, Plus, Settings,
    CreditCard, User
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getUserCredits } from '@/actions/credits.action';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { data: session } = useSession();
    const [credits, setCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const userCredits = await getUserCredits();
                setCredits(userCredits);
            } catch (error) {
                console.error('Error fetching credits:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchCredits();
        }
    }, [session]);

    const statsData = [
        {
            title: "Practice Time",
            value: "47 mins",
            icon: Clock,
            description: "This week",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            change: "+12%"
        },
        {
            title: "XP Earned",
            value: "1,250",
            icon: Star,
            description: "Total points",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            change: "+8%"
        },
        {
            title: "Credits",
            value: isLoading ? "..." : credits.toString(),
            icon: Coins,
            description: "Available",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            change: "0"
        },
        {
            title: "Streak",
            value: "7 days",
            icon: Calendar,
            description: "Current streak",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            change: "+1"
        }
    ];

    const learningTools = [
        {
            id: 'voicevoyage',
            title: 'VoiceVoyage',
            subtitle: 'Conversation AI',
            description: 'Practice speaking with AI tutors in real-time conversations.',
            icon: Mic,
            color: 'from-teal-500 to-emerald-600',
            textColor: 'text-teal-600',
            bgColor: 'bg-teal-50',
            credits: 'Free + Premium',
            level: 'Beginner to Advanced',
            href: '/tools/voice-voyage'
        },
        {
            id: 'storyspeak',
            title: 'StorySpeak',
            subtitle: 'Interactive Dialogues',
            description: 'Learn through immersive story-based conversations.',
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            credits: '10-20 credits',
            level: 'Intermediate',
            href: '/tools/story-speak'
        },
        {
            id: 'chatquest',
            title: 'ChatQuest',
            subtitle: 'Free-form Chat',
            description: 'Open conversations with guided learning paths.',
            icon: MessageSquare,
            color: 'from-teal-400 to-emerald-500',
            textColor: 'text-teal-600',
            bgColor: 'bg-teal-50',
            credits: '5-10 credits',
            level: 'All Levels',
            href: '/tools/chat-quest'
        },
        {
            id: 'phraseforge',
            title: 'PhraseForge',
            subtitle: 'Structured Learning',
            description: 'Master essential phrases through interactive lessons.',
            icon: BookOpenText,
            color: 'from-emerald-400 to-teal-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            credits: '20 credits per unit',
            level: 'Structured',
            href: '/tools/phrase-forge'
        }
    ];

    const quickActions = [
        {
            title: 'Buy Credits',
            description: 'Purchase credits to unlock premium features',
            icon: CreditCard,
            color: 'bg-gradient-to-r from-teal-500 to-emerald-600',
            href: '/buy-credits'
        },
        {
            title: 'Profile',
            description: 'Manage your account and preferences',
            icon: User,
            color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            href: '/profile'
        },
        {
            title: 'Settings',
            description: 'Customize your learning experience',
            icon: Settings,
            color: 'bg-gradient-to-r from-teal-400 to-emerald-500',
            href: '/settings'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {session?.user?.name?.split(' ')[0] || 'Learner'}! 👋
                        </h2>
                        <p className="text-lg text-gray-600">
                            Continue your language learning journey
                        </p>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="pb-2 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-2 lg:p-3 rounded-xl ${stat.bgColor}`}>
                                                <IconComponent className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center text-xs text-emerald-600">
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    {stat.change}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="space-y-1">
                                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                                            <p className="text-xs text-gray-500">{stat.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer group">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{action.title}</h4>
                                                        <p className="text-sm text-gray-600">{action.description}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Tools */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Learning Tools</h3>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                            4 Tools Available
                        </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {learningTools.map((tool, index) => {
                            const IconComponent = tool.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/90 backdrop-blur-sm">
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                                        <CardHeader className="relative p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-2xl ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent className={`h-6 w-6 ${tool.textColor}`} />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold text-gray-900">
                                                            {tool.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-sm font-medium text-gray-600">
                                                            {tool.subtitle}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="text-xs mb-1">
                                                        {tool.level}
                                                    </Badge>
                                                    <p className="text-xs text-gray-500">{tool.credits}</p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="relative pt-0 p-6">
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                {tool.description}
                                            </p>

                                            <Link href={tool.href}>
                                                <Button
                                                    className={`w-full bg-gradient-to-r ${tool.color} text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-300`}
                                                >
                                                    Start Learning
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;