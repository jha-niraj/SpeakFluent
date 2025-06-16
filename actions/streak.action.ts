'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { addCredits } from './credits.action'

// Record daily activity for a user
export async function recordDailyActivity(activityData: {
    conversationCount?: number;
    moduleProgress?: number;
    timeSpent?: number;
    creditsEarned?: number;
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Update or create daily activity record
        const dailyActivity = await prisma.dailyActivity.upsert({
            where: {
                userId_date: {
                    userId: session.user.id,
                    date: today
                }
            },
            update: {
                hasActivity: true,
                conversationCount: { increment: activityData.conversationCount || 0 },
                moduleProgress: { increment: activityData.moduleProgress || 0 },
                totalTimeSpent: { increment: activityData.timeSpent || 0 },
                creditsEarned: { increment: activityData.creditsEarned || 0 },
                updatedAt: new Date()
            },
            create: {
                userId: session.user.id,
                date: today,
                hasActivity: true,
                conversationCount: activityData.conversationCount || 0,
                moduleProgress: activityData.moduleProgress || 0,
                totalTimeSpent: activityData.timeSpent || 0,
                creditsEarned: activityData.creditsEarned || 0
            }
        })

        // Calculate and update streak
        await updateUserStreak(session.user.id)

        return { success: true, activity: dailyActivity }
    } catch (error) {
        console.error('Error recording daily activity:', error)
        return { success: false, error: 'Failed to record activity' }
    }
}

// Calculate and update user's current streak
export async function updateUserStreak(userId: string) {
    try {
        // Get all daily activities for this user, ordered by date desc
        const activities = await prisma.dailyActivity.findMany({
            where: {
                userId: userId,
                hasActivity: true
            },
            orderBy: { date: 'desc' }
        })

        if (activities.length === 0) {
            // No activities yet, streak is 0
            await prisma.userStats.upsert({
                where: { userId },
                update: { currentStreak: 0 },
                create: {
                    userId,
                    currentStreak: 0,
                    longestStreak: 0
                }
            })
            return { currentStreak: 0, longestStreak: 0 }
        }

        // Calculate current streak
        let currentStreak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Check if user was active today or yesterday (allow for timezone differences)
        const latestActivity = new Date(activities[0].date)
        const daysDiff = Math.floor((today.getTime() - latestActivity.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 1) {
            // Start counting streak from the most recent activity
            let checkDate = new Date(latestActivity)
            
            for (const activity of activities) {
                const activityDate = new Date(activity.date)
                
                // If this activity is on the expected date, continue streak
                if (activityDate.getTime() === checkDate.getTime()) {
                    currentStreak++
                    // Move to previous day
                    checkDate.setDate(checkDate.getDate() - 1)
                } else {
                    // Gap found, break streak
                    break
                }
            }
        }

        // Calculate longest streak
        let longestStreak = 0
        let tempStreak = 0
        let expectedDate = activities.length > 0 ? new Date(activities[0].date) : null

        for (const activity of activities) {
            const activityDate = new Date(activity.date)
            
            if (expectedDate && activityDate.getTime() === expectedDate.getTime()) {
                tempStreak++
                longestStreak = Math.max(longestStreak, tempStreak)
                expectedDate.setDate(expectedDate.getDate() - 1)
            } else {
                // Reset streak calculation
                tempStreak = 1
                expectedDate = new Date(activityDate)
                expectedDate.setDate(expectedDate.getDate() - 1)
            }
        }

        // Update user stats
        const userStats = await prisma.userStats.upsert({
            where: { userId },
            update: {
                currentStreak,
                longestStreak: Math.max(longestStreak, currentStreak),
                lastActivityDate: activities[0] ? new Date(activities[0].date) : null
            },
            create: {
                userId,
                currentStreak,
                longestStreak: Math.max(longestStreak, currentStreak),
                lastActivityDate: activities[0] ? new Date(activities[0].date) : null
            }
        })

        // Check for streak rewards
        await checkStreakRewards(userId, currentStreak)

        return {
            currentStreak: userStats.currentStreak,
            longestStreak: userStats.longestStreak
        }
    } catch (error) {
        console.error('Error updating user streak:', error)
        throw error
    }
}

// Check and award streak rewards
export async function checkStreakRewards(userId: string, currentStreak: number) {
    try {
        // Define streak reward milestones
        const rewardMilestones = [
            { days: 3, credits: 25 },
            { days: 7, credits: 50 },
            { days: 15, credits: 100 },
            { days: 30, credits: 200 },
            { days: 60, credits: 400 },
            { days: 100, credits: 750 },
            { days: 180, credits: 1500 },
            { days: 365, credits: 3000 }
        ]

        for (const milestone of rewardMilestones) {
            if (currentStreak >= milestone.days) {
                // Check if reward was already given for this milestone
                const existingReward = await prisma.streakReward.findFirst({
                    where: {
                        userId,
                        streakDays: milestone.days
                    }
                })

                if (!existingReward) {
                    // Award the reward
                    await prisma.streakReward.create({
                        data: {
                            userId,
                            streakDays: milestone.days,
                            creditsAwarded: milestone.credits
                        }
                    })

                    // Add credits to user account
                    await addCredits(userId, milestone.credits, `${milestone.days}-day streak reward`)

                    // Create achievement for significant streaks
                    if (milestone.days >= 15) {
                        await prisma.userAchievement.create({
                            data: {
                                userId,
                                achievementType: `STREAK_${milestone.days}`,
                                title: `${milestone.days}-Day Streak Master`,
                                description: `Maintained a ${milestone.days}-day learning streak!`,
                                badgeIcon: milestone.days >= 100 ? '🔥' : milestone.days >= 30 ? '⚡' : '🌟',
                                badgeColor: milestone.days >= 100 ? 'gold' : milestone.days >= 30 ? 'orange' : 'blue',
                                creditsAwarded: 0, // Credits already awarded via streak reward
                                unlockedAt: new Date()
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error checking streak rewards:', error)
    }
}

// Get user's streak data and calendar
export async function getUserStreakData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        // Get user stats
        const userStats = await prisma.userStats.findUnique({
            where: { userId: session.user.id }
        })

        // Get last 365 days of activity for calendar
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 365)

        const activities = await prisma.dailyActivity.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { date: 'asc' }
        })

        // Get streak rewards
        const streakRewards = await prisma.streakReward.findMany({
            where: { userId: session.user.id },
            orderBy: { streakDays: 'asc' }
        })

        // Calculate next milestone
        const currentStreak = userStats?.currentStreak || 0
        const nextMilestones = [3, 7, 15, 30, 60, 100, 180, 365]
        const nextMilestone = nextMilestones.find(milestone => milestone > currentStreak)

        return {
            success: true,
            data: {
                currentStreak: userStats?.currentStreak || 0,
                longestStreak: userStats?.longestStreak || 0,
                lastActivityDate: userStats?.lastActivityDate,
                activities,
                streakRewards,
                nextMilestone
            }
        }
    } catch (error) {
        console.error('Error fetching streak data:', error)
        return { success: false, error: 'Failed to fetch streak data' }
    }
}

// Get streak calendar data for visualization
export async function getStreakCalendar(year?: number, month?: number) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const currentDate = new Date()
        const targetYear = year || currentDate.getFullYear()
        const targetMonth = month !== undefined ? month : currentDate.getMonth()

        // Get first and last day of the month
        const startDate = new Date(targetYear, targetMonth, 1)
        const endDate = new Date(targetYear, targetMonth + 1, 0)

        const activities = await prisma.dailyActivity.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: startDate,
                    lte: endDate
                },
                hasActivity: true
            },
            select: {
                date: true,
                conversationCount: true,
                moduleProgress: true,
                totalTimeSpent: true,
                creditsEarned: true
            }
        })

        // Create calendar grid
        const calendar = []
        const daysInMonth = endDate.getDate()
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(targetYear, targetMonth, day)
            const activity = activities.find(a => 
                new Date(a.date).getDate() === day
            )
            
            calendar.push({
                date,
                hasActivity: !!activity,
                activity: activity || null
            })
        }

        return {
            success: true,
            data: {
                calendar,
                year: targetYear,
                month: targetMonth,
                totalActiveDays: activities.length
            }
        }
    } catch (error) {
        console.error('Error fetching streak calendar:', error)
        return { success: false, error: 'Failed to fetch calendar data' }
    }
} 