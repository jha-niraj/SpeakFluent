"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    AlertTriangle, ArrowLeft, Home, RefreshCw, Shield, 
    Wifi, Server, Key, Globe, Settings
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorDetails {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

const ErrorPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isRetrying, setIsRetrying] = useState(false);
    
    const errorType = searchParams.get('error');
    const errorMessage = searchParams.get('message');

    const getErrorDetails = (error: string | null): ErrorDetails => {
        switch (error) {
            case 'Configuration':
            case 'configuration':
                return {
                    title: 'Authentication Configuration Error',
                    description: 'There seems to be an issue with our authentication setup. This usually happens when environment variables are not properly configured in production.',
                    icon: <Settings className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Try Again',
                        onClick: () => handleRetry()
                    }
                };
            
            case 'AccessDenied':
            case 'access_denied':
                return {
                    title: 'Access Denied',
                    description: 'You do not have permission to access this resource. Please contact support if you believe this is an error.',
                    icon: <Shield className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Go to Sign In',
                        href: '/auth/signin'
                    }
                };
            
            case 'Verification':
            case 'verification':
                return {
                    title: 'Email Verification Required',
                    description: 'Please verify your email address before signing in.',
                    icon: <Key className="w-12 h-12 text-yellow-500" />,
                    action: {
                        label: 'Verify Email',
                        href: '/verify'
                    }
                };
            
            case 'OAuthSignin':
            case 'OAuthCallback':
            case 'OAuthCreateAccount':
                return {
                    title: 'OAuth Authentication Error',
                    description: 'There was an issue connecting to the authentication provider. Please try signing in again.',
                    icon: <Globe className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Try Again',
                        href: '/auth/signin'
                    }
                };
            
            case 'EmailCreateAccount':
                return {
                    title: 'Account Creation Error',
                    description: 'Unable to create your account. The email might already be in use.',
                    icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Try Sign In',
                        href: '/auth/signin'
                    }
                };
            
            case 'Signin':
            case 'signin':
                return {
                    title: 'Sign In Error',
                    description: 'Unable to sign you in. Please check your credentials and try again.',
                    icon: <Key className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Back to Sign In',
                        href: '/auth/signin'
                    }
                };
            
            case 'SessionRequired':
                return {
                    title: 'Session Required',
                    description: 'You need to be signed in to access this page.',
                    icon: <Shield className="w-12 h-12 text-yellow-500" />,
                    action: {
                        label: 'Sign In',
                        href: '/auth/signin'
                    }
                };
            
            case 'Default':
            case 'default':
                return {
                    title: 'Something went wrong',
                    description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
                    icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Try Again',
                        onClick: () => handleRetry()
                    }
                };
            
            case 'network':
                return {
                    title: 'Network Error',
                    description: 'Unable to connect to our servers. Please check your internet connection and try again.',
                    icon: <Wifi className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Retry',
                        onClick: () => handleRetry()
                    }
                };
            
            case 'server':
                return {
                    title: 'Server Error',
                    description: 'Our servers are experiencing issues. Please try again in a few moments.',
                    icon: <Server className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Retry',
                        onClick: () => handleRetry()
                    }
                };
            
            default:
                return {
                    title: 'Unexpected Error',
                    description: errorMessage || 'An unexpected error occurred. Please try again or contact support if the problem persists.',
                    icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
                    action: {
                        label: 'Go Home',
                        href: '/'
                    }
                };
        }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        // Wait a moment for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to go back to the previous page or redirect to home
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
        setIsRetrying(false);
    };

    const errorDetails = getErrorDetails(errorType);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-red-500/10 to-orange-500/10 rounded-tl-full"></div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader className="text-center pb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4"
                        >
                            {errorDetails.icon}
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {errorDetails.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base mt-2">
                            {errorDetails.description}
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {errorType === 'Configuration' && (
                            <Alert className="border-yellow-200 bg-yellow-50">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800">
                                    <strong>Developer Note:</strong> Check your environment variables:
                                    <br />• GOOGLE_CLIENT_ID
                                    <br />• GOOGLE_CLIENT_SECRET (not GOOGLE_SECRET_ID)
                                    <br />• NEXTAUTH_SECRET
                                    <br />• NEXTAUTH_URL
                                </AlertDescription>
                            </Alert>
                        )}

                        {errorMessage && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <strong>Error Details:</strong> {errorMessage}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            {errorDetails.action && (
                                errorDetails.action.href ? (
                                    <Link href={errorDetails.action.href} className="flex-1">
                                        <Button className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
                                            {errorDetails.action.label}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button 
                                        onClick={errorDetails.action.onClick}
                                        disabled={isRetrying}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                                    >
                                        {isRetrying ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Retrying...
                                            </>
                                        ) : (
                                            errorDetails.action.label
                                        )}
                                    </Button>
                                )
                            )}
                            
                            <Link href="/" className="flex-1">
                                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                                    <Home className="w-4 h-4 mr-2" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="text-center">
                            <button 
                                onClick={() => router.back()}
                                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Go back to previous page
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

const ErrorPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center">
                <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-xl border-0">
                    <CardContent className="p-8 text-center">
                        <div className="animate-pulse space-y-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        }>
            <ErrorPageContent />
        </Suspense>
    );
};

export default ErrorPage; 