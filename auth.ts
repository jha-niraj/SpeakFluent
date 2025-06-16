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
            clientSecret: process.env.GOOGLE_SECRET_ID || ""
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
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Handle sign-in redirects
            if (url.startsWith("/") && !url.startsWith("/auth/signin") && !url.startsWith("/auth/signup")) {
                return `${baseUrl}${url}`;
            }
            
            if (new URL(url).origin === baseUrl) {
                return url;
            }
            
            // For successful sign-ins, we'll let the client handle the redirect
            // based on onboarding status to avoid server-side user lookups
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
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        csrfToken: {
            name: "next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
})