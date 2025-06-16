"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    onboardingCompleted: boolean;
}

export function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [userDetails, setUserDetails] = useState<User | null>(null);

    useEffect(() => {
        async function checkOnboardingStatus() {
            if (status === 'loading') return;
            
            if (status === 'unauthenticated') {
                setIsChecking(false);
                return;
            }

            if (session?.user?.id) {
                try {
                    const response = await fetch('/api/user/details');
                    if (response.ok) {
                        const userData = await response.json();
                        setUserDetails(userData);
                        
                        const currentPath = window.location.pathname;
                        
                        if (!userData.onboardingCompleted && currentPath !== '/onboarding') {
                            router.push('/onboarding');
                            return;
                        } else if (userData.onboardingCompleted && currentPath === '/onboarding') {
                            router.push('/dashboard');
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error checking onboarding status:', error);
                }
            }
            
            setIsChecking(false);
        }

        checkOnboardingStatus();
    }, [session, status, router]);

    if (isChecking && status !== 'unauthenticated') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 