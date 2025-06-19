import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth";
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    // Check if email is verified
                    if (!user.emailVerified) {
                        throw new Error("Please verify your email before signing in");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string, 
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error(error instanceof Error ? error.message : "Authentication failed");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id!;
                token.email = user.email!;
                token.name = user.name!;
                token.image = user.image!;
                token.role = user.role;
            }

            if (token && !token.roleExplicitlyChosen) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { roleExplicitlyChosen: true }
                });
                if (dbUser) {
                    token.roleExplicitlyChosen = dbUser.roleExplicitlyChosen;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
                session.user.role = token.role as Role
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: profile?.email as string }
                    });

                    if (existingUser) {
                        // Update existing user to mark email as verified
                        await prisma.user.update({
                            where: {
                                email: profile?.email as string
                            },
                            data: {
                                emailVerified: new Date()
                            }
                        });
                    } else {
                        // For new Google users, they'll be created by the adapter
                        // and we'll handle onboarding in the redirect callback
                    }

                    return true;
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url;
            
            // For successful sign-ins, redirect to dashboard
            return `${baseUrl}/dashboard`;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/error',
        signOut: '/'
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    debug: process.env.NODE_ENV === 'development',
})