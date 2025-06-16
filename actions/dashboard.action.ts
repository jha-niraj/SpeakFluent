'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { GoalType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface WeeklyGoal {
    id: string
    userId: string
    title: string
    description?: string
    type: 'PRESET' | 'CUSTOM'
    category: string
    completed: boolean
    completedAt?: Date
    createdAt: Date
    updatedAt: Date
}

export interface CreateGoalData {
    title: string
    description?: string
    category: string
    type?: 'PRESET' | 'CUSTOM'
}

// Get user's weekly goals
export async function getUserWeeklyGoals() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const goals = await prisma.weeklyGoal.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, goals }
    } catch (error) {
        console.error('Error fetching weekly goals:', error)
        return { success: false, error: 'Failed to fetch goals' }
    }
}

// Create a new weekly goal (handles both PRESET and CUSTOM)
export async function createWeeklyGoal(data: CreateGoalData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const goal = await prisma.weeklyGoal.create({
            data: {
                userId: session.user.id,
                title: data.title,
                description: data.description,
                category: data.category,
                type: data.type || 'CUSTOM',
                completed: false
            }
        })

        revalidatePath('/dashboard')
        return { success: true, goal }
    } catch (error) {
        console.error('Error creating weekly goal:', error)
        return { success: false, error: 'Failed to create goal' }
    }
}

// Create multiple preset goals
export async function createMultipleGoals(goals: CreateGoalData[]) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const createdGoals = await Promise.all(
            goals.map(goalData =>
                prisma.weeklyGoal.create({
                    data: {
                        userId: session.user.id,
                        title: goalData.title,
                        description: goalData.description,
                        category: goalData.category,
                        type: goalData.type || 'PRESET',
                        completed: false
                    }
                })
            )
        )

        revalidatePath('/dashboard')
        return { success: true, goals: createdGoals }
    } catch (error) {
        console.error('Error creating multiple goals:', error)
        return { success: false, error: 'Failed to create goals' }
    }
}

// Create preset goals for new users
export async function createPresetGoals() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        // Check if user already has preset goals
        const existingGoals = await prisma.weeklyGoal.findFirst({
            where: {
                userId: session.user.id,
                type: 'PRESET'
            }
        })

        if (existingGoals) {
            return { success: true, message: 'Preset goals already exist' }
        }

        const presetGoals = [
            {
                title: 'Complete 5 conversations this week',
                category: 'conversations',
                type: 'PRESET' as const
            },
            {
                title: 'Practice pronunciation daily',
                category: 'pronunciation',
                type: 'PRESET' as const
            },
            {
                title: 'Reach 30-day learning streak',
                category: 'streak',
                type: 'PRESET' as const
            }
        ]

        const goals = await prisma.weeklyGoal.createMany({
            data: presetGoals.map(goal => ({
                ...goal,
                userId: session.user.id,
                completed: false
            }))
        })

        revalidatePath('/dashboard')
        return { success: true, goals }
    } catch (error) {
        console.error('Error creating preset goals:', error)
        return { success: false, error: 'Failed to create preset goals' }
    }
}

// Toggle goal completion (only for custom goals)
export async function toggleGoalCompletion(goalId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const goal = await prisma.weeklyGoal.findFirst({
            where: {
                id: goalId,
                userId: session.user.id
            }
        })

        if (!goal) {
            return { success: false, error: 'Goal not found' }
        }

        if (goal.type === 'PRESET') {
            return { success: false, error: 'Cannot manually complete preset goals' }
        }

        const updatedGoal = await prisma.weeklyGoal.update({
            where: {
                id: goalId
            },
            data: {
                completed: !goal.completed,
                completedAt: !goal.completed ? new Date() : null
            }
        })

        revalidatePath('/dashboard')
        return { success: true, goal: updatedGoal }
    } catch (error) {
        console.error('Error toggling goal completion:', error)
        return { success: false, error: 'Failed to update goal' }
    }
}

// Delete a custom goal
export async function deleteWeeklyGoal(goalId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const goal = await prisma.weeklyGoal.findFirst({
            where: {
                id: goalId,
                userId: session.user.id
            }
        })

        if (!goal) {
            return { success: false, error: 'Goal not found' }
        }

        if (goal.type === 'PRESET') {
            return { success: false, error: 'Cannot delete preset goals' }
        }

        await prisma.weeklyGoal.delete({
            where: {
                id: goalId
            }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error deleting weekly goal:', error)
        return { success: false, error: 'Failed to delete goal' }
    }
}

// Update preset goal progress automatically
export async function updatePresetGoalProgress(userId: string, category: string, progress: number) {
    try {
        const goal = await prisma.weeklyGoal.findFirst({
            where: {
                userId,
                category,
                type: 'PRESET'
            }
        })

        if (!goal) return

        // Auto-complete if progress reaches 100%
        if (progress >= 100 && !goal.completed) {
            await prisma.weeklyGoal.update({
                where: {
                    id: goal.id
                },
                data: {
                    completed: true,
                    completedAt: new Date()
                }
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating preset goal progress:', error)
        return { success: false, error: 'Failed to update progress' }
    }
}

// Get or create user stats
export async function getUserStats() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        let userStats = await prisma.userStats.findUnique({
            where: { userId: session.user.id }
        })

        // Create stats if they don't exist
        if (!userStats) {
            userStats = await prisma.userStats.create({
                data: {
                    userId: session.user.id,
                    weekStartDate: getWeekStartDate()
                }
            })
        }

        // Check if we need to reset weekly stats
        const weekStart = getWeekStartDate()
        if (userStats.weekStartDate < weekStart) {
            userStats = await prisma.userStats.update({
                where: { userId: session.user.id },
                data: {
                    weeklyTalkingTime: 0,
                    weeklyConversations: 0,
                    weekStartDate: weekStart
                }
            })
        }

        return {
            success: true,
            stats: userStats
        }
    } catch (error) {
        console.error('Error fetching user stats:', error)
        return { success: false, error: 'Failed to fetch stats' }
    }
}

// Update conversation stats
export async function updateConversationStats(speakingTimeMinutes: number) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const weekStart = getWeekStartDate()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Get or create user stats
        let userStats = await prisma.userStats.findUnique({
            where: { userId: session.user.id }
        })

        if (!userStats) {
            userStats = await prisma.userStats.create({
                data: {
                    userId: session.user.id,
                    weekStartDate: weekStart
                }
            })
        }

        // Update stats
        const updatedStats = await prisma.userStats.update({
            where: { userId: session.user.id },
            data: {
                totalSpeakingTime: { increment: speakingTimeMinutes },
                weeklyTalkingTime: { increment: speakingTimeMinutes },
                totalConversations: { increment: 1 },
                weeklyConversations: { increment: 1 },
                lastActivityDate: new Date()
            }
        })

        // Update streak
        await updateLearningStreak(session.user.id)

        revalidatePath('/dashboard')
        return { success: true, stats: updatedStats }
    } catch (error) {
        console.error('Error updating conversation stats:', error)
        return { success: false, error: 'Failed to update stats' }
    }
}

// Update learning streak
export async function updateLearningStreak(userId: string) {
    try {
        const userStats = await prisma.userStats.findUnique({
            where: { userId }
        })

        if (!userStats) return

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const lastActivity = userStats.lastActivityDate
        if (!lastActivity) {
            // First activity
            await prisma.userStats.update({
                where: { userId },
                data: {
                    currentStreak: 1,
                    longestStreak: Math.max(1, userStats.longestStreak),
                    lastActivityDate: new Date()
                }
            })
            return
        }

        const lastActivityDate = new Date(lastActivity)
        lastActivityDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))

        let newStreak = userStats.currentStreak

        if (daysDiff === 0) {
            // Same day, no change to streak
            return
        } else if (daysDiff === 1) {
            // Consecutive day
            newStreak = userStats.currentStreak + 1
        } else {
            // Streak broken
            newStreak = 1
        }

        await prisma.userStats.update({
            where: { userId },
            data: {
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, userStats.longestStreak),
                lastActivityDate: new Date()
            }
        })
    } catch (error) {
        console.error('Error updating learning streak:', error)
    }
}

// Helper function to get the start of the current week (Monday)
function getWeekStartDate(): Date {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday being 0
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)
    return weekStart
}

// Get dashboard overview data
export async function getDashboardOverview() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' }
        }

        const [user, userStats, conversationSessions, weeklyGoals] = await Promise.all([
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: { credits: true }
            }),
            getUserStats(),
            prisma.conversationSession.findMany({
                where: { userId: session.user.id },
                select: { duration: true, createdAt: true }
            }),
            prisma.weeklyGoal.findMany({
                where: { userId: session.user.id },
                select: { completed: true }
            })
        ])

        if (!userStats.success || !userStats.stats) {
            return { success: false, error: 'Failed to fetch stats' }
        }

        const stats = userStats.stats

        return {
            success: true,
            data: {
                speakingTime: {
                    weekly: stats.weeklyTalkingTime,
                    total: stats.totalSpeakingTime
                },
                conversations: {
                    weekly: stats.weeklyConversations,
                    total: stats.totalConversations
                },
                credits: user?.credits || 0,
                learningStreak: stats.currentStreak,
                goalsCompleted: weeklyGoals.filter(goal => goal.completed).length,
                totalGoals: weeklyGoals.length
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard overview:', error)
        return { success: false, error: 'Failed to fetch dashboard data' }
    }
} 