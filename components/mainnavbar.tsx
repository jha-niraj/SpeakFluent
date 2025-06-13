'use client';

import { useTheme } from "next-themes";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import {
    Bell, Moon, Sun, ChevronDown, Users, Home,
    Menu, User, Settings, LogOut, Crown, Award, School
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";
import { getCurrentUser } from "@/actions/auth.action";
import { signOut } from "@/actions/auth.action";

const MainNavbar = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Mock data - replace with actual data fetching
    const [notifications, setNotifications] = useState(2);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

    const getPageTitle = () => {
        const pathSegments = pathname.split('/').filter(Boolean);
        const currentPath = pathSegments[pathSegments.length - 1] || 'dashboard';

        switch (currentPath) {
            case 'dashboard':
                return 'Dashboard';
            case 'students':
                return 'Student Management';
            case 'billing':
                return 'Billing System';
            case 'payments':
                return 'Payment Processing';
            case 'academics':
                return 'Academic Management';
            case 'reports':
                return 'Reports & Analytics';
            case 'communication':
                return 'Communication';
            case 'settings':
                return 'Settings';
            default:
                return currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <nav className={`fixed top-0 right-0 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300 z-10 ${scrolled ? 'shadow-sm bg-background/95' : ''} ${isCollapsed ? 'left-[60px]' : 'left-[200px]'} left-0`}>
            <div className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <motion.h1
                                className="text-lg sm:text-xl font-bold text-foreground truncate"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={pathname}
                            >
                                {getPageTitle()}
                            </motion.h1>
                            {
                            currentUser && (
                                <Badge variant="secondary" className="hidden sm:flex bg-blue-500/10 text-blue-600 border-blue-500/20">
                                    <School className="h-3 w-3 mr-1" />
                                    Admin
                                </Badge>
                            )
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <motion.div
                            className="hidden lg:flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-blue-500/20"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                                245 Students
                            </span>
                        </motion.div>
                        <div className="hidden md:flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-background shadow-sm' : 'hover:bg-muted'}`}
                                onClick={() => setTheme('light')}
                            >
                                <Sun className="h-3 w-3 text-amber-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-background shadow-sm' : 'hover:bg-muted'}`}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon className="h-3 w-3 text-blue-500" />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:flex relative hover:bg-muted rounded-xl p-2 cursor-pointer"
                        >
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            {
                            notifications > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Badge className="h-4 w-4 rounded-full p-0 flex items-center justify-center bg-rose-500 text-white text-xs">
                                        {notifications}
                                    </Badge>
                                </motion.div>
                            )
                            }
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                    <Avatar className="h-8 w-8 border-2 border-border/50">
                                        <AvatarImage src="" alt={currentUser?.name || "Admin"} />
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-bold">
                                            {currentUser?.name?.split(" ").map((n: string) => n[0]).join("") || "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <motion.div
                                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-background"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {currentUser?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer md:hidden" onClick={() => router.push('/dashboard')}>
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer md:hidden">
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notifications</span>
                                    {
                                    notifications > 0 && (
                                        <Badge className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center bg-rose-500 text-white text-xs">
                                            {notifications}
                                        </Badge>
                                    )
                                    }
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer md:hidden" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                    {
                                    theme === 'dark' ? (
                                        <>
                                            <Sun className="mr-2 h-4 w-4" />
                                            <span>Light Mode</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="mr-2 h-4 w-4" />
                                            <span>Dark Mode</span>
                                        </>
                                    )
                                    }
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="md:hidden" />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 dark:text-red-400"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar; 