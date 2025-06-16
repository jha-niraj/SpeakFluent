import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verify your email address',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background: linear-gradient(135deg, #0d9488 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to SpeakFluent!</h1>
                        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Verify your email to start your language learning journey</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
                            Thank you for signing up! Please click the button below to verify your email address and activate your account.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 30px;">
                            If you didn't create an account with SpeakFluent, you can safely ignore this email.
                        </p>
                        
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            Or copy and paste this link into your browser: <br>
                            <span style="word-break: break-all;">${verifyUrl}</span>
                        </p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending verification email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error: 'Failed to send verification email' };
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your password',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset</h1>
                        <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Reset your SpeakFluent password</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
                            You requested a password reset for your SpeakFluent account. Click the button below to set a new password.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 30px;">
                            This link will expire in 1 hour for security reasons. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                        
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            Or copy and paste this link into your browser: <br>
                            <span style="word-break: break-all;">${resetUrl}</span>
                        </p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: 'Failed to send password reset email' };
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['shunyatechofficial@gmail.com'],
            cc: [email],
            subject: 'New User Registration - SpeakFluent',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background: linear-gradient(135deg, #0d9488 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">New User Registration</h1>
                        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">SpeakFluent Platform</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #374151; margin-bottom: 20px;">New User Details</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 10px;">
                            <strong>Name:</strong> ${name}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
                            <strong>Email:</strong> ${email}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                            <strong>Registration Time:</strong> ${new Date().toLocaleString()}
                        </p>
                        
                        <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                This user has successfully registered and will receive welcome instructions.
                            </p>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: 'Failed to send welcome email' };
    }
}; 