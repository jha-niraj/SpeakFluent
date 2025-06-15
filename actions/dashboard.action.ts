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