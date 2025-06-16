import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SelectedLevel } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { selectedLanguage, selectedLevel, selectedGoal, selectedTime, dailyMinutes } = body;

        // Validate required fields
        if (!selectedLanguage || !selectedLevel || !selectedGoal || !selectedTime || !dailyMinutes) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert selectedLevel to uppercase and validate against enum
        const levelUpperCase = selectedLevel.toUpperCase() as SelectedLevel;
        const validLevels = Object.values(SelectedLevel);
        
        if (!validLevels.includes(levelUpperCase)) {
            return NextResponse.json(
                { error: `Invalid selected level. Must be one of: ${validLevels.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate dailyMinutes is a number
        const dailyMinutesNum = parseInt(dailyMinutes);
        if (isNaN(dailyMinutesNum) || dailyMinutesNum <= 0) {
            return NextResponse.json(
                { error: 'Daily minutes must be a positive number' },
                { status: 400 }
            );
        }

        // Update user with onboarding data
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                onboardingCompleted: true,
                selectedLanguage,
                selectedLevel: levelUpperCase,
                selectedGoal,
                selectedTime,
                dailyMinutes: dailyMinutesNum
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 