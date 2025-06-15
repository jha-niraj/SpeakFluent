'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface OnboardingData {
    selectedLanguage: string
    selectedLevel: string
    selectedGoal: string
    selectedTime: string
}

export async function saveOnboardingData(data: OnboardingData) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error('Not authenticated')
    }

    try {
        // Map selectedTime to dailyMinutes
        const timeMapping: { [key: string]: number } = {
            'casual': 10,
            'regular': 20,
            'serious': 30,
            'intensive': 60
        }

        const dailyMinutes = timeMapping[data.selectedTime] || 10

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                onboardingCompleted: true,
                selectedLanguage: data.selectedLanguage,
                selectedLevel: data.selectedLevel,
                selectedGoal: data.selectedGoal,
                selectedTime: data.selectedTime,
                dailyMinutes: dailyMinutes
            }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error saving onboarding data:', error)
        return { success: false, error: 'Failed to save onboarding data' }
    }
}

export async function getUserOnboarding() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error('Not authenticated')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            onboardingCompleted: true,
            selectedLanguage: true,
            selectedLevel: true,
            selectedGoal: true,
            selectedTime: true,
            dailyMinutes: true
        }
    })

    return user
}

export async function checkOnboardingStatus() {
    const session = await auth()

    if (!session?.user?.id) {
        return false
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true }
    })

    return user?.onboardingCompleted || false
} 