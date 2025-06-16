"use client"

import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Moon, Sun, Home, User, Settings, LogOut, Mic, ShoppingCart, LogIn, Coins } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"
import { fetchCredits } from "@/actions/credits.action"

const MainNavbar = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme()
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [credits, setCredits] = useState(0);

    // Mock data - replace with actual data fetching
    // const [notifications, setNotifications] = useState(2)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, []);

    useEffect(() => {
        const fetchXpAndCredits = async () => {
            const response = await fetchCredits();
            if (!response) {
                toast("Failed to fetch XP and Credits");
                return;
            }

            setCredits(response.credits);
        };

        if (status === "authenticated") {
            fetchXpAndCredits();

        }
    }, [status]);

    const getPageTitle = () => {
        const pathSegments = pathname.split("/").filter(Boolean)
        const currentPath = pathSegments[pathSegments.length - 1] || "dashboard"

        switch (currentPath) {
            case "dashboard":
                return "Dashboard"
            case "conversation":
                return "AI Conversation"
            case "purchase":
                return "Buy Credits"
            case "progress":
                return "Learning Progress"
            case "profile":
                return "Profile"
            case "settings":
                return "Settings"
            default:
                return currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut();
            toast("Logged out successfully")
            router.push("/signin")
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }

    return (
        <nav
            className={`fixed top-0 right-0 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300 z-10 ${scrolled ? "shadow-sm bg-background/95" : ""} ${isCollapsed ? "left-[60px]" : "left-[240px]"} left-0`}
        >
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
                                session?.user && (
                                    <Badge variant="secondary" className="hidden sm:flex bg-teal-500/10 text-teal-600 border-teal-500/20">
                                        <Mic className="h-3 w-3 mr-1" />
                                        Learner
                                    </Badge>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {
                            session?.user && (
                                <div className="flex items-center">
                                    <Coins className="h-4 w-4 mr-1.5 text-amber-600 dark:text-amber-400" />
                                    <span className="font-medium mr-2">{credits}</span>
                                </div>
                            )
                        }
                        <Link href="/purchase">
                            <motion.div
                                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-teal-500/20 cursor-pointer hover:shadow-sm transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                            >
                                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600 dark:text-teal-400" />
                                <span className="font-semibold text-teal-700 dark:text-teal-300 text-xs sm:text-sm">Buy Credits</span>
                            </motion.div>
                        </Link>
                        <div className="hidden md:flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === "light" ? "bg-background shadow-sm" : "hover:bg-muted"}`}
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-3 w-3 text-amber-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === "dark" ? "bg-background shadow-sm" : "hover:bg-muted"}`}
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-3 w-3 text-indigo-500" />
                            </Button>
                        </div>
                        {
                            session?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                            <Avatar className="h-8 w-8 border-2 border-border/50">
                                                <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "User"} />
                                                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold">
                                                    {
                                                        session.user.name
                                                            ?.split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("") || "U"
                                                    }
                                                </AvatarFallback>
                                            </Avatar>
                                            <motion.div
                                                className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-background"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer md:hidden" onClick={() => router.push("/dashboard")}>
                                            <Home className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer md:hidden"
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        >
                                            {
                                                theme === "dark" ? (
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
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/signin">
                                    <Button
                                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                                        size="sm"
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default MainNavbar;