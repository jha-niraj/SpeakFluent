'use client'

import { useState, useEffect, useMemo } from 'react';
import {
    MessageSquare, Home, CreditCard, TrendingUp, User,
    Baseline
} from 'lucide-react';
import Sidebar, { Route } from '@/components/mainsidebar';
import MainNavbar from '@/components/mainnavbar';
import { AuthRedirect } from '@/components/auth/AuthRedirect';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    const routes: Route[] = useMemo(() => [
        {
            path: "dashboard",
            name: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "conversation",
            name: "AI Conversation",
            icon: <MessageSquare className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "foundations",
            name: "Foundations",
            icon: <Baseline className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "purchase",
            name: "Buy Credits",
            icon: <CreditCard className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "progress",
            name: "Progress",
            icon: <TrendingUp className="h-5 w-5" />,
            status: "active"
        }
    ], []);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('sidebarCollapsed') === null) {
            const shouldBeCollapsed = window.innerWidth < 1024;
            setIsCollapsed(shouldBeCollapsed);
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
        }
    };

    return (
        <AuthRedirect>
            <div className="flex h-screen bg-background">
                <Sidebar
                    routes={routes}
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <div className="flex flex-col flex-1">
                    <MainNavbar isCollapsed={isCollapsed} />
                    <main className={`bg-background transition-all duration-300 ${isCollapsed ? 'ml-[60px]' : 'ml-[200px]'} pt-16`}>
                        <div className="h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthRedirect>
    );
};

export default Layout; 