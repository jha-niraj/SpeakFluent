'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TransactionType, TransactionStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function fetchCredits() {
    const session = await auth();

    if (!session) {
        throw new Error("User is not authenticated");
    }

    try {
        const response = await prisma.user.findUnique({
            where: {
                id: session?.user?.id
            },
            select: {
                credits: true
            }
        })
        if (!response) {
            throw new Error("Failed to fetch the XP and Credits");
        }

        return {
            credits: response.credits
        }
    } catch (err) {
        const error = err as Error;
        console.log("Error Occurred while converting XP: " + error);
        throw new Error("Error occurred while converting XP");
    }
}

export async function getUserCredits() {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { credits: true }
	})

	return user?.credits || 0
}

export async function createCreditPurchase(creditsAmount: number, price: number) {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	try {
		const transaction = await prisma.creditTransaction.create({
			data: {
				userId: session.user.id,
				type: TransactionType.PURCHASE,
				status: TransactionStatus.PENDING,
				amount: creditsAmount,
				price: price,
				currency: 'NPR',
				description: `Purchase of ${creditsAmount} credits`,
				paymentMethod: 'khalti'
			}
		})

		return { success: true, transactionId: transaction.id }
	} catch (error) {
		console.error('Error creating credit purchase:', error)
		return { success: false, error: 'Failed to create purchase' }
	}
}

export async function completeCreditPurchase(transactionId: string, paymentId: string) {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	try {
		// Get the transaction
		const transaction = await prisma.creditTransaction.findUnique({
			where: { id: transactionId },
			include: { user: true }
		})

		if (!transaction || transaction.userId !== session.user.id) {
			return { success: false, error: 'Transaction not found' }
		}

		if (transaction.status !== TransactionStatus.PENDING) {
			return { success: false, error: 'Transaction already processed' }
		}

		// Update transaction and user credits in a transaction
		await prisma.$transaction(async (tx) => {
			// Update transaction status
			await tx.creditTransaction.update({
				where: { id: transactionId },
				data: {
					status: TransactionStatus.COMPLETED,
					paymentId: paymentId,
					updatedAt: new Date()
				}
			})

			// Add credits to user
			await tx.user.update({
				where: { id: session.user.id },
				data: {
					credits: {
						increment: transaction.amount
					}
				}
			})
		})

		revalidatePath('/dashboard')
		revalidatePath('/profile')
		return { success: true }
	} catch (error) {
		console.error('Error completing credit purchase:', error)
		return { success: false, error: 'Failed to complete purchase' }
	}
}

export async function useCredits(amount: number, description: string) {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { credits: true }
		})

		if (!user || user.credits < amount) {
			return { success: false, error: 'Insufficient credits' }
		}

		// Deduct credits and create usage transaction
		await prisma.$transaction(async (tx) => {
			// Update user credits
			await tx.user.update({
				where: { id: session.user.id },
				data: {
					credits: {
						decrement: amount
					}
				}
			})

			// Create usage transaction
			await tx.creditTransaction.create({
				data: {
					userId: session.user.id,
					type: TransactionType.USAGE,
					status: TransactionStatus.COMPLETED,
					amount: -amount, // Negative for usage
					description: description
				}
			})
		})

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Error using credits:', error)
		return { success: false, error: 'Failed to use credits' }
	}
}

export async function deductCredits(userId: string, amount: number, description: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { credits: true }
		})

		if (!user || user.credits < amount) {
			return { success: false, error: 'Insufficient credits' }
		}

		// Deduct credits and create usage transaction
		await prisma.$transaction(async (tx) => {
			// Update user credits
			await tx.user.update({
				where: { id: userId },
				data: {
					credits: {
						decrement: amount
					}
				}
			})

			// Create usage transaction
			await tx.creditTransaction.create({
				data: {
					userId: userId,
					type: TransactionType.USAGE,
					status: TransactionStatus.COMPLETED,
					amount: -amount, // Negative for usage
					description: description
				}
			})
		})

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Error deducting credits:', error)
		return { success: false, error: 'Failed to deduct credits' }
	}
}

export async function getCreditTransactions() {
	const session = await auth()

	if (!session?.user?.id) {
		throw new Error('Not authenticated')
	}

	const transactions = await prisma.creditTransaction.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
		take: 20
	})

	return transactions
} 