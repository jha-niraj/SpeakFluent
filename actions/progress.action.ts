'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { addCredits } from './credits.action';

export async function checkAndAwardMilestones(userId: string, milestoneType: string, language?: string, metadata?: any) {
    try {
        // Check if milestone already achieved
        const existingMilestone = await prisma.userMilestone.findUnique({
            where: {
                userId_milestoneType_language: {
                    userId,
                    milestoneType,
                    language: language || ""
                }
            }
        });

        if (existingMilestone?.achieved) {
            return { success: false, message: 'Milestone already achieved' };
        }

        // Define milestone rewards
        const milestoneRewards = {
            'FIRST_CONVERSATION': { credits: 100, milestone: 'Completed your first conversation!' },
            'FIRST_MODULE_COMPLETE': { credits: 150, milestone: 'Completed your first foundation module!' },
            'WEEK_STREAK_3': { credits: 75, milestone: 'Maintained a 3-day learning streak!' },
            'WEEK_STREAK_7': { credits: 200, milestone: 'Achieved a 7-day learning streak!' },
            'WEEK_STREAK_30': { credits: 500, milestone: 'Amazing! 30-day learning streak!' },
            'CONVERSATION_COUNT_10': { credits: 150, milestone: 'Completed 10 conversations!' },
            'CONVERSATION_COUNT_50': { credits: 300, milestone: 'Conversation master! 50 conversations completed!' },
            'MODULE_PERFECT_SCORE': { credits: 100, milestone: 'Perfect score on a foundation module!' },
            'DAILY_GOAL_WEEK': { credits: 100, milestone: 'Met daily goals for a full week!' }
        };

        const reward = milestoneRewards[milestoneType as keyof typeof milestoneRewards];
        if (!reward) {
            return { success: false, message: 'Unknown milestone type' };
        }

        // Create or update milestone
        const milestone = await prisma.userMilestone.upsert({
            where: {
                userId_milestoneType_language: {
                    userId,
                    milestoneType,
                    language: language || ''
                }
            },
            update: {
                achieved: true,
                achievedAt: new Date(),
                creditsAwarded: reward.credits,
                metadata
            },
            create: {
                userId,
                milestoneType,
                language,
                milestone: reward.milestone,
                creditsAwarded: reward.credits,
                achieved: true,
                achievedAt: new Date(),
                metadata
            }
        });

        // Award credits
        await addCredits(userId, reward.credits, `Milestone: ${reward.milestone}`);

        return {
            success: true,
            milestone,
            creditsAwarded: reward.credits,
            message: reward.milestone
        };
    } catch (error) {
        console.error('Error checking milestone:', error);
        return { success: false, error: 'Failed to check milestone' };
    }
}

export async function unlockAchievement(userId: string, achievementType: string, title: string, description: string, badgeIcon?: string, badgeColor?: string, creditsAwarded = 0) {
    try {
        // Check if achievement already exists
        const existingAchievement = await prisma.userAchievement.findFirst({
            where: {
                userId,
                achievementType
            }
        });

        if (existingAchievement) {
            return { success: false, message: 'Achievement already unlocked' };
        }

        const achievement = await prisma.userAchievement.create({
            data: {
                userId,
                achievementType,
                title,
                description,
                badgeIcon: badgeIcon || '🏆',
                badgeColor: badgeColor || 'gold',
                creditsAwarded,
                unlockedAt: new Date()
            }
        });

        if (creditsAwarded > 0) {
            await addCredits(userId, creditsAwarded, `Achievement: ${title}`);
        }

        return {
            success: true,
            achievement,
            message: `Achievement unlocked: ${title}!`
        };
    } catch (error) {
        console.error('Error unlocking achievement:', error);
        return { success: false, error: 'Failed to unlock achievement' };
    }
}

export async function getUserProgress() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        const userId = session.user.id;

        // Get user stats
        const userStats = await prisma.userStats.findUnique({
            where: { userId }
        });

        // Get module progress
        const moduleProgress = await prisma.moduleProgress.findMany({
            where: { userId },
            include: {
                module: {
                    select: {
                        title: true,
                        moduleType: true,
                        language: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Get milestones
        const milestones = await prisma.userMilestone.findMany({
            where: { userId },
            orderBy: { achievedAt: 'desc' }
        });

        // Get achievements
        const achievements = await prisma.userAchievement.findMany({
            where: { userId },
            orderBy: { unlockedAt: 'desc' }
        });

        // Get conversation sessions
        const conversationSessions = await prisma.conversationSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Calculate progress statistics
        const totalModules = await prisma.foundationModule.count({
            where: { isActive: true }
        });

        const completedModules = moduleProgress.filter(mp => mp.status === 'COMPLETED').length;
        const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        // Calculate weekly progress
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weeklyConversations = await prisma.conversationSession.count({
            where: {
                userId,
                createdAt: { gte: weekStart }
            }
        });

        const weeklyMilestones = milestones.filter(m =>
            m.achievedAt && m.achievedAt >= weekStart
        ).length;

        return {
            success: true,
            data: {
                userStats,
                moduleProgress,
                milestones,
                achievements,
                conversationSessions,
                statistics: {
                    overallProgress,
                    totalModules,
                    completedModules,
                    weeklyConversations,
                    weeklyMilestones,
                    totalMilestones: milestones.filter(m => m.achieved).length,
                    totalAchievements: achievements.length,
                    totalCreditsEarned: milestones.reduce((sum, m) => sum + m.creditsAwarded, 0) +
                        achievements.reduce((sum, a) => sum + a.creditsAwarded, 0)
                }
            }
        };
    } catch (error) {
        console.error('Error getting user progress:', error);
        return { success: false, error: 'Failed to get user progress' };
    }
}

export async function getProgressAnalytics() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        const userId = session.user.id;

        // Get activity data for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyActivity = await prisma.conversationSession.groupBy({
            by: ['createdAt'],
            where: {
                userId,
                createdAt: { gte: thirtyDaysAgo }
            },
            _count: { id: true },
            _sum: { duration: true }
        });

        // Get module completion over time
        const moduleCompletions = await prisma.moduleProgress.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: thirtyDaysAgo }
            },
            include: {
                module: {
                    select: {
                        title: true,
                        moduleType: true
                    }
                }
            },
            orderBy: { completedAt: 'asc' }
        });

        // Get streak data
        const userStats = await prisma.userStats.findUnique({
            where: { userId }
        });

        return {
            success: true,
            data: {
                dailyActivity,
                moduleCompletions,
                streakData: {
                    currentStreak: userStats?.currentStreak || 0,
                    longestStreak: userStats?.longestStreak || 0,
                    lastActivity: userStats?.lastActivityDate
                }
            }
        };
    } catch (error) {
        console.error('Error getting progress analytics:', error);
        return { success: false, error: 'Failed to get progress analytics' };
    }
} 