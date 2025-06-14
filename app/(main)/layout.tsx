'use client'

import { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard, Settings, DollarSign, 
    GraduationCap, Users, Receipt, FileBarChart, MessageSquare
} from 'lucide-react';
import Sidebar, { Route } from '@/components/mainsidebar';
import MainNavbar from '@/components/mainnavbar';

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
            icon: <LayoutDashboard className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "students",
            name: "Students",
            icon: <Users className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "billing",
            name: "Billing",
            icon: <DollarSign className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "payments",
            name: "Payments",
            icon: <Receipt className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "academics",
            name: "Academics",
            icon: <GraduationCap className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "reports",
            name: "Reports",
            icon: <FileBarChart className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "communication",
            name: "Communication",
            icon: <MessageSquare className="h-5 w-5" />,
            status: "coming"
        },
        {
            path: "settings",
            name: "Settings",
            icon: <Settings className="h-5 w-5" />,
            status: "coming"
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
    );
};

export default Layout; 