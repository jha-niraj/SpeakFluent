'use server'

import { prisma } from '@/lib/prisma'
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTPEmail(email: string, otp: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: "shunyatechofficial@gmail.com",
            subject: 'Your SpeakFluent verification code',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background: linear-gradient(135deg, #0d9488 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Verification Code</h1>
                        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your SpeakFluent verification code</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px; text-align: center;">
                            Enter this verification code to complete your account setup:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #f3f4f6; padding: 20px 30px; border-radius: 12px; border: 2px dashed #0d9488;">
                                <span style="font-size: 32px; font-weight: bold; color: #0d9488; letter-spacing: 8px;">${otp}</span>
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 30px; text-align: center;">
                            This code will expire in 10 minutes for security reasons.
                        </p>
                        
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 20px; text-align: center;">
                            If you didn't request this code, you can safely ignore this email.
                        </p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending OTP email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: 'Failed to send OTP email' };
    }
}

export async function signupUser(formData: {
    name: string;
    email: string;
    password: string;
}) {
    try {
        const { name, email, password } = formData;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, error: 'User already exists with this email' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                resetToken: otp,
                resetTokenExpiry: otpExpiry,
                emailVerified: null
            }
        });

        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            await prisma.user.delete({ where: { id: user.id } });
            return { success: false, error: 'Failed to send verification code' };
        }

        return { 
            success: true, 
            message: 'Account created successfully! Please check your email for the verification code.',
            userId: user.id
        };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: 'Failed to create account' };
    }
}

export async function verifyOTP(email: string, otp: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken: otp,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return { success: false, error: 'Invalid or expired verification code' };
        }

        // Verify the user's email
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        // Send welcome email after successful verification
        await sendWelcomeEmail(email, user.name);

        return { 
            success: true, 
            message: 'Email verified successfully!',
            user: {
                name: user.name,
                email: user.email
            }
        };
    } catch (error) {
        console.error('OTP verification error:', error);
        return { success: false, error: 'Failed to verify code' };
    }
}

export async function resendOTP(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.emailVerified) {
            return { success: false, error: 'Email is already verified' };
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: otp,
                resetTokenExpiry: otpExpiry
            }
        });

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            return { success: false, error: 'Failed to send verification code' };
        }

        return { 
            success: true, 
            message: 'Verification code sent! Please check your inbox.' 
        };
    } catch (error) {
        console.error('Resend OTP error:', error);
        return { success: false, error: 'Failed to resend verification code' };
    }
}

export async function verifyEmail(token: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return { success: false, error: 'Invalid or expired verification token' };
        }

        // Verify the user's email
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return { success: true, message: 'Email verified successfully! You can now sign in.' };
    } catch (error) {
        console.error('Email verification error:', error);
        return { success: false, error: 'Failed to verify email' };
    }
}

export async function forgotPassword(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return { 
                success: true, 
                message: 'If an account with this email exists, you will receive a password reset link.' 
            };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Update user with reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry: tokenExpiry
            }
        });

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken);
        
        if (!emailResult.success) {
            return { success: false, error: 'Failed to send password reset email' };
        }

        return { 
            success: true, 
            message: 'If an account with this email exists, you will receive a password reset link.' 
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, error: 'Failed to process password reset request' };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return { success: false, error: 'Invalid or expired reset token' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user with new password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return { success: true, message: 'Password reset successfully! You can now sign in with your new password.' };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: 'Failed to reset password' };
    }
}

export async function resendVerificationEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.emailVerified) {
            return { success: false, error: 'Email is already verified' };
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: verificationToken,
                resetTokenExpiry: tokenExpiry
            }
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken);
        
        if (!emailResult.success) {
            return { success: false, error: 'Failed to send verification email' };
        }

        return { 
            success: true, 
            message: 'Verification email sent! Please check your inbox.' 
        };
    } catch (error) {
        console.error('Resend verification error:', error);
        return { success: false, error: 'Failed to resend verification email' };
    }
}

export async function requestPasswordReset(email: string) {
    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            // Don't reveal if user exists for security
            return { success: true, message: 'If an account with that email exists, a reset link has been sent.' }
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Save reset token to database
        await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        // Create reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/resetpassword?token=${resetToken}`

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken);
        
        if (!emailResult.success) {
            console.error('Error sending password reset email:', emailResult.error)
        }

        console.log('Password reset requested for:', email)
        console.log('Reset URL (for development):', resetUrl)

        return { 
            success: true, 
            message: 'If an account with that email exists, a reset link has been sent.',
            // For development only - remove in production
            resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        }
    } catch (error) {
        console.error('Error requesting password reset:', error)
        return { success: false, error: 'Failed to process password reset request' }
    }
}

export async function validateResetToken(token: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { resetToken: token },
            select: { id: true, resetTokenExpiry: true }
        })

        if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
            return { valid: false }
        }

        return { valid: true }
    } catch (error) {
        console.error('Error validating reset token:', error)
        return { valid: false }
    }
} 