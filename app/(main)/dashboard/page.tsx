"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mic, MessageSquare, BookOpenText, Users, Clock, Star, Coins } from 'lucide-react';
import {
    SidebarProvider, SidebarTrigger, SidebarInset
} from '@/components/ui/sidebar';
import { AppSidebar } from '../_components/appsidebar';

const Dashboard = () => {
    const statsData = [
        {
            title: "Practice Time",
            value: "47 mins",
            icon: Clock,
            description: "This week",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "XP Earned",
            value: "1,250",
            icon: Star,
            description: "Total points",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Credits",
            value: "340",
            icon: Coins,
            description: "Available",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Last Used",
            value: "VoiceVoyage",
            icon: Mic,
            description: "2 hours ago",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    const services = [
        {
            id: 'voicevoyage',
            title: 'VoiceVoyage',
            subtitle: 'Conversation AI',
            description: 'Immersive voice sessions with native greetings and real-life call simulations.',
            icon: Mic,
            features: ['Real-time feedback', 'Adaptive difficulty', 'Cultural context'],
            color: 'from-blue-500 to-purple-600',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            difficulty: 'Beginner to Advanced',
            credits: 'Free + Premium'
        },
        {
            id: 'storyspeak',
            title: 'StorySpeak',
            subtitle: 'Interactive Dialogues',
            description: 'Scenario-based practice with visual storyboards and live conversations.',
            icon: Users,
            features: ['Visual storyboards', 'Unit structure', 'Explorer badges'],
            color: 'from-green-500 to-teal-600',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            difficulty: 'Intermediate',
            credits: '10-20 credits reward'
        },
        {
            id: 'chatquest',
            title: 'ChatQuest',
            subtitle: 'Free-form Chat',
            description: 'Open conversation with AI tutor and guided prompts.',
            icon: MessageSquare,
            features: ['Open dialogue', 'Instant feedback', 'Progress tracking'],
            color: 'from-orange-500 to-red-600',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            difficulty: 'All Levels',
            credits: '5 free, 10 credits each'
        },
        {
            id: 'phraseforge',
            title: 'PhraseForge',
            subtitle: 'Structured Learning',
            description: 'Daily life phrases through interactive units and cultural quizzes.',
            icon: BookOpenText,
            features: ['Unit-based lessons', 'Interactive activities', 'Fluency tests'],
            color: 'from-violet-500 to-pink-600',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-50',
            difficulty: 'Structured',
            credits: '20 credits per unit'
        }
    ];

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <SidebarInset>
                    <div className="flex-1">
                        {/* Header with Trigger */}
                        <div className="flex items-center gap-4 p-6 border-b md:hidden">
                            <SidebarTrigger />
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
                            <div className="max-w-7xl mx-auto">
                                {/* Header - Hidden on mobile since we have it above */}
                                <div className="mb-8 hidden md:block">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Learning Dashboard</h1>
                                    <p className="text-lg text-gray-600">Track your progress and continue your language journey</p>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                                    {statsData.map((stat, index) => {
                                        const IconComponent = stat.icon;
                                        return (
                                            <Card key={index} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                                <CardHeader className="pb-2 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`p-2 lg:p-3 rounded-xl ${stat.bgColor}`}>
                                                            <IconComponent className={`h-4 w-4 lg:h-6 lg:w-6 ${stat.color}`} />
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
                                        );
                                    })}
                                </div>

                                <Separator className="my-8" />

                                {/* Learning Tools Section */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Tools</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {services.map((service, index) => {
                                            const IconComponent = service.icon;
                                            return (
                                                <Card key={index} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/90 backdrop-blur-sm">
                                                    {/* Gradient Background */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                                                    <CardHeader className="relative p-6">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className={`p-3 rounded-2xl ${service.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                                                    <IconComponent className={`h-6 w-6 ${service.textColor}`} />
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-xl font-bold text-gray-900">
                                                                        {service.title}
                                                                    </CardTitle>
                                                                    <CardDescription className="text-sm font-medium text-gray-600">
                                                                        {service.subtitle}
                                                                    </CardDescription>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500 mb-1">{service.difficulty}</p>
                                                                <p className="text-xs font-medium text-gray-700">{service.credits}</p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="relative pt-0 p-6">
                                                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.description}</p>

                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex flex-wrap gap-2">
                                                                {service.features.map((feature, featureIndex) => (
                                                                    <span key={featureIndex} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${service.bgColor} ${service.textColor}`}>
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            className={`w-full bg-gradient-to-r ${service.color} text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-300`}
                                                        >
                                                            Start Learning
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                                        <CardDescription>Jump back into your learning journey</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-all bg-white/80">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                                <span className="text-sm">Continue Last Session</span>
                                            </Button>
                                            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-green-50 hover:border-green-200 transition-all bg-white/80">
                                                <Star className="h-5 w-5 text-green-600" />
                                                <span className="text-sm">View Progress</span>
                                            </Button>
                                            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-all bg-white/80">
                                                <Coins className="h-5 w-5 text-purple-600" />
                                                <span className="text-sm">Buy Credits</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default Dashboard;