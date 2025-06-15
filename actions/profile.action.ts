'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			role: true,
			credits: true,
			createdAt: true,
			emailVerified: true,
			selectedLanguage: true
		}
	})

	return user
}

export async function updateProfile(data: { name: string; image?: string }) {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	try {
		await prisma.user.update({
			where: { id: session.user.id },
			data: {
				name: data.name,
				...(data.image && { image: data.image })
			}
		})

		revalidatePath('/profile')
		return { success: true }
	} catch (error) {
		console.error('Error updating profile:', error)
		return { success: false, error: 'Failed to update profile' }
	}
}

export async function changePassword(currentPassword: string, newPassword: string) {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	try {
		// Get current user with password
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { password: true }
		})

		if (!user?.password) {
			return { success: false, error: 'No password set for this account' }
		}

		// Verify current password
		const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

		if (!isCurrentPasswordValid) {
			return { success: false, error: 'Current password is incorrect' }
		}

		// Hash new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 12)

		// Update password
		await prisma.user.update({
			where: { id: session.user.id },
			data: { password: hashedNewPassword }
		})

		return { success: true }
	} catch (error) {
		console.error('Error changing password:', error)
		return { success: false, error: 'Failed to change password' }
	}
} 