"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Trophy, Target, Flame, BookOpen, MessageSquare,
    TrendingUp, CheckCircle, Lock, ArrowRight,
    Coins, Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getUserProgress, getProgressAnalytics } from '@/actions/progress.action'
import { getUserCredits } from '@/actions/credits.action'
import Link from 'next/link'

interface UserStats {
    id: string;
    userId: string;
    totalSpeakingTime: number;
    weeklyTalkingTime: number;
    totalConversations: number;
    weeklyConversations: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: Date;
    weekStartDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface ModuleProgress {
    id: string;
    status: string;
    progressPercent: number;
    bestScore?: number | null;
    completedAt?: Date | null;
    module: {
        title: string;
        moduleType: string;
        language: string;
    };
}

interface Milestone {
    id: string;
    milestoneType: string;
    milestone: string;
    creditsAwarded: number;
    achieved: boolean;
    achievedAt?: Date | null;
    metadata?: Record<string, unknown> | null;
}

interface Achievement {
    id: string;
    achievementType: string;
    title: string;
    description: string;
    badgeIcon?: string | null;
    badgeColor?: string | null;
    creditsAwarded: number;
    unlockedAt: Date;
}

interface ConversationSession {
    id: string;
    language: string;
    duration?: number | null;
    createdAt: Date;
}

interface ProgressStatistics {
    overallProgress: number;
    totalModules: number;
    completedModules: number;
    weeklyConversations: number;
    weeklyMilestones: number;
    totalMilestones: number;
    totalAchievements: number;
    totalCreditsEarned: number;
}

interface ProgressData {
    userStats: UserStats | null;
    moduleProgress: ModuleProgress[];
    milestones: Milestone[];
    achievements: Achievement[];
    conversationSessions: ConversationSession[];
    statistics: ProgressStatistics;
}

const ProgressPage = () => {
    const [progressData, setProgressData] = useState<ProgressData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progressResult] = await Promise.all([
                    getUserProgress(),
                    getProgressAnalytics(),
                    getUserCredits()
                ])

                if (progressResult.success) {
                    setProgressData(progressResult.data as ProgressData)
                }
            } catch (error) {
                console.error('Error fetching progress data:', error)
                toast.error('Failed to load progress data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Progress</h2>
                    <p className="text-gray-600">Gathering your learning achievements...</p>
                </motion.div>
            </div>
        )
    }

    // If no data or user hasn't started learning yet
    if (!progressData || (
        progressData.statistics.totalModules === 0 && 
        progressData.statistics.totalMilestones === 0 && 
        progressData.statistics.totalAchievements === 0 &&
        progressData.conversationSessions.length === 0
    )) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        {/* Hero Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-32 h-32 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                        >
                            <Target className="w-16 h-16 text-white" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6"
                        >
                            Your Learning Journey Awaits! 🚀
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            You haven&apos;t started your language learning adventure yet. Begin with foundation modules or jump into conversations to start tracking your amazing progress!
                        </motion.p>

                        {/* Action Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto"
                        >
                            {/* Foundation Card */}
                            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-teal-100">
                                <CardContent className="p-8 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Start with Foundations</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Master the fundamentals with our structured learning modules. Build a solid foundation in your target language.
                                    </p>
                                    <Link href="/foundations">
                                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl group-hover:scale-105 transition-transform duration-300">
                                            <BookOpen className="w-5 h-5 mr-2" />
                                            Explore Foundations
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Conversation Card */}
                            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-emerald-100">
                                <CardContent className="p-8 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <MessageSquare className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Practice Conversations</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Jump into AI-powered conversations and start speaking immediately. Perfect for confident learners.
                                    </p>
                                    <Link href="/conversation">
                                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl group-hover:scale-105 transition-transform duration-300">
                                            <MessageSquare className="w-5 h-5 mr-2" />
                                            Start Talking
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Features Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-teal-100"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Track</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Target className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Milestones</h4>
                                    <p className="text-sm text-gray-600">Earn credits for achievements</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Flame className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Streaks</h4>
                                    <p className="text-sm text-gray-600">Daily learning consistency</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Trophy className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Achievements</h4>
                                    <p className="text-sm text-gray-600">Special accomplishments</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <TrendingUp className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Progress</h4>
                                    <p className="text-sm text-gray-600">Overall learning analytics</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        )
    }

    const { statistics, moduleProgress, milestones, achievements, conversationSessions } = progressData

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        Your Learning Progress
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track your journey to fluency and celebrate your achievements
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-100 text-sm font-medium">Overall Progress</p>
                                    <p className="text-3xl font-bold">{statistics.overallProgress}%</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-teal-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Credits Earned</p>
                                    <p className="text-3xl font-bold text-teal-600">{statistics.totalCreditsEarned}</p>
                                </div>
                                <Coins className="w-8 h-8 text-teal-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Milestones</p>
                                    <p className="text-3xl font-bold text-teal-600">{statistics.totalMilestones}</p>
                                </div>
                                <Target className="w-8 h-8 text-teal-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Achievements</p>
                                    <p className="text-3xl font-bold text-teal-600">{statistics.totalAchievements}</p>
                                </div>
                                <Trophy className="w-8 h-8 text-teal-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="modules">Modules</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Foundation Progress */}
                            <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-teal-600" />
                                        Foundation Modules
                                    </CardTitle>
                                    <CardDescription>
                                        Complete foundation modules to unlock major features
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Progress</span>
                                        <span className="text-sm text-gray-600">
                                            {statistics.completedModules} of {statistics.totalModules}
                                        </span>
                                    </div>
                                    <Progress value={statistics.overallProgress} className="h-2" />
                                    
                                    {statistics.completedModules < statistics.totalModules && (
                                        <Link href="/foundations">
                                            <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                                                Continue Learning
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Weekly Activity */}
                            <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-teal-600" />
                                        This Week
                                    </CardTitle>
                                    <CardDescription>
                                        Your learning activity this week
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-teal-500" />
                                            <span className="text-sm">Conversations</span>
                                        </div>
                                        <Badge variant="secondary">{statistics.weeklyConversations}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-teal-500" />
                                            <span className="text-sm">Milestones</span>
                                        </div>
                                        <Badge variant="secondary">{statistics.weeklyMilestones}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm">Current Streak</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {progressData.userStats?.currentStreak || 0} days
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your latest learning sessions and achievements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 max-h-80 overflow-y-auto">
                                    <AnimatePresence>
                                        {conversationSessions.slice(0, 5).map((session: ConversationSession) => (
                                            <div key={session.id} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare className="w-4 h-4 text-teal-600" />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {session.language} Conversation
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {new Date(session.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    {session.duration ? `${Math.round(session.duration / 60)}min` : 'Completed'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Modules Tab */}
                    <TabsContent value="modules" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                            <CardHeader>
                                <CardTitle>Foundation Modules Progress</CardTitle>
                                <CardDescription>
                                    Complete these modules to unlock major features and earn credits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {moduleProgress.map((module: ModuleProgress) => (
                                        <div key={module.id} className="border border-teal-100 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium text-gray-800">
                                                    {module.module.title}
                                                </h3>
                                                <Badge variant={module.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                    {module.status}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>{module.progressPercent}%</span>
                                                </div>
                                                <Progress value={module.progressPercent} className="h-2" />
                                                {module.bestScore && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span>Best Score</span>
                                                        <span className="text-teal-600 font-medium">{module.bestScore}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {moduleProgress.length === 0 && (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No modules started yet</p>
                                        <Link href="/foundations">
                                            <Button className="mt-4">Start Your First Module</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Milestones Tab */}
                    <TabsContent value="milestones" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                            <CardHeader>
                                <CardTitle>Learning Milestones</CardTitle>
                                <CardDescription>
                                    Track your progress and earn credits for reaching milestones
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {milestones.map((milestone: Milestone) => (
                                        <motion.div
                                            key={milestone.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`border rounded-lg p-4 ${
                                                milestone.achieved 
                                                    ? 'border-teal-200 bg-teal-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                {milestone.achieved ? (
                                                    <CheckCircle className="w-6 h-6 text-teal-600" />
                                                ) : (
                                                    <Lock className="w-6 h-6 text-gray-400" />
                                                )}
                                                <div>
                                                    <h3 className="font-medium text-gray-800">
                                                        {milestone.milestone}
                                                    </h3>
                                                    <p className="text-xs text-gray-600">
                                                        {milestone.milestoneType.replace(/_/g, ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Coins className="w-4 h-4 text-teal-600" />
                                                    <span className="text-sm font-medium text-teal-600">
                                                        {milestone.creditsAwarded} credits
                                                    </span>
                                                </div>
                                                {milestone.achievedAt && (
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(milestone.achievedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {milestones.length === 0 && (
                                    <div className="text-center py-8">
                                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No milestones yet</p>
                                        <p className="text-sm text-gray-500">Start learning to unlock your first milestone</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Achievements Tab */}
                    <TabsContent value="achievements" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                            <CardHeader>
                                <CardTitle>Achievements & Badges</CardTitle>
                                <CardDescription>
                                    Special achievements you&apos;ve unlocked on your learning journey
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {achievements.map((achievement: Achievement) => (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4"
                                        >
                                            <div className="text-center mb-3">
                                                <div className="text-3xl mb-2">{achievement.badgeIcon}</div>
                                                <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                {achievement.creditsAwarded > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Coins className="w-4 h-4 text-teal-600" />
                                                        <span className="text-sm font-medium text-teal-600">
                                                            {achievement.creditsAwarded} credits
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {achievements.length === 0 && (
                                    <div className="text-center py-8">
                                        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No achievements yet</p>
                                        <p className="text-sm text-gray-500">Keep learning to unlock your first achievement</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProgressPage;