'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getUserCredits, deductCredits } from './credits.action'
import { ConversationStatus } from '@prisma/client'

export async function startConversationSession(language: string = 'english', topic?: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'User not authenticated' }
        }

        // Check if user has enough credits
        const userCredits = await getUserCredits()
        if (userCredits < 10) {
            return { success: false, error: 'Insufficient credits. You need at least 10 credits to start a conversation.' }
        }

        // Create conversation session
        const conversationSession = await prisma.conversationSession.create({
            data: {
                userId: session.user.id,
                agentId: process.env.ELEVENLABS_AGENT_ID!,
                language,
                topic,
                status: ConversationStatus.ACTIVE,
                creditsUsed: 10
            }
        })

        // Deduct credits
        await deductCredits(session.user.id, 10, `Conversation session: ${conversationSession.id}`)

        return { 
            success: true, 
            sessionId: conversationSession.id,
            message: 'Conversation session started successfully!' 
        }
    } catch (error) {
        console.error('Error starting conversation session:', error)
        return { success: false, error: 'Failed to start conversation session' }
    }
}

export async function endConversationSession(sessionId: string, duration?: number, quality?: number, feedback?: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'User not authenticated' }
        }

        // Update conversation session
        const conversationSession = await prisma.conversationSession.update({
            where: {
                id: sessionId,
                userId: session.user.id
            },
            data: {
                status: ConversationStatus.COMPLETED,
                duration,
                quality,
                feedback,
                updatedAt: new Date()
            }
        })

        return { 
            success: true, 
            session: conversationSession,
            message: 'Conversation session ended successfully!' 
        }
    } catch (error) {
        console.error('Error ending conversation session:', error)
        return { success: false, error: 'Failed to end conversation session' }
    }
}

export async function getUserConversationSessions(limit: number = 10) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'User not authenticated', sessions: [] }
        }

        const sessions = await prisma.conversationSession.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        return { success: true, sessions }
    } catch (error) {
        console.error('Error fetching conversation sessions:', error)
        return { success: false, error: 'Failed to fetch sessions', sessions: [] }
    }
}

export async function getConversationStats() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'User not authenticated' }
        }

        const stats = await prisma.conversationSession.aggregate({
            where: {
                userId: session.user.id,
                status: ConversationStatus.COMPLETED
            },
            _count: {
                id: true
            },
            _sum: {
                duration: true,
                creditsUsed: true
            },
            _avg: {
                quality: true
            }
        })

        const thisWeekSessions = await prisma.conversationSession.count({
            where: {
                userId: session.user.id,
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            }
        })

        return {
            success: true,
            stats: {
                totalSessions: stats._count.id || 0,
                totalDuration: stats._sum.duration || 0,
                totalCreditsUsed: stats._sum.creditsUsed || 0,
                averageQuality: stats._avg.quality || 0,
                thisWeekSessions
            }
        }
    } catch (error) {
        console.error('Error fetching conversation stats:', error)
        return { success: false, error: 'Failed to fetch stats' }
    }
} 