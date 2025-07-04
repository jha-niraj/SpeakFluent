"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ChevronRight, UserPlus } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

export interface Route {
    path: string
    name: string
    icon?: React.ReactNode
    status: string
}

interface SidebarProps {
    routes?: Route[]
    isCollapsed: boolean
    toggleSidebar: () => void
}

const Sidebar = ({ routes = [], isCollapsed, toggleSidebar }: SidebarProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()

    const isActiveRoute = (path: string) => {
        if (path === "dashboard") {
            return pathname === "/dashboard" || pathname === "/"
        }
        return pathname.includes(path)
    }

    const displayRoutes = routes.length > 0 ? routes.filter((route) => route.status === "active") : []

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/signin")
        } catch (error) {
            console.error("Failed to sign out", error)
            toast.error("Failed to sign out")
        }
    }

    const handleNavigation = (path: string) => {
        router.push(`/${path}`)
    }

    const handleSignIn = () => {
        router.push("/signin")
    }

    return (
        <TooltipProvider>
            <motion.div
                className="fixed top-0 left-0 h-full bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl border-r border-border/20 shadow-2xl z-20"
                animate={{ width: isCollapsed ? 60 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex flex-col h-full relative">
                    <div className="flex items-center justify-center p-4 h-[80px] border-b border-border/20">
                        <Link href={session ? "/dashboard" : "/"} className="flex gap-2 items-center justify-center group cursor-pointer">
                            <Image
                                src="/mainlogo.png"
                                alt="SpeakFluent"
                                width={32}
                                height={32}
                            />
                            <motion.div
                                animate={{
                                    opacity: isCollapsed ? 0 : 1,
                                    x: isCollapsed ? -20 : 0,
                                    width: isCollapsed ? 0 : "auto",
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                            >
                                <div className="whitespace-nowrap">
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                                        SpeakFluent
                                    </h1>
                                    <p className="text-xs text-muted-foreground/80 font-medium">
                                        Global Language Platform
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                    <div className="flex-grow overflow-y-auto py-6">
                        {
                            session ? (
                                <div className={`space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}>
                                    {
                                        displayRoutes.map((route, index) => {
                                            const isActive = isActiveRoute(route.path)

                                            return (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger asChild>
                                                        <motion.button
                                                            onClick={() => handleNavigation(route.path)}
                                                            className="block w-full cursor-pointer"
                                                            whileHover={{ x: isCollapsed ? 0 : 4 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ duration: 0.1 }}
                                                        >
                                                            <div
                                                                className={`
                                                        ${isActive
                                                                        ? "bg-gradient-to-r from-teal-500 via-emerald-600 to-green-500 text-white shadow-xl shadow-teal-500/25"
                                                                        : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-foreground/80 hover:text-foreground"
                                                                    } 
                                                        flex items-center rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden backdrop-blur-sm
                                                        ${isCollapsed ? "justify-center px-3 py-4" : "px-4 py-3.5"}
                                                    `}
                                                            >
                                                                {
                                                                    isActive && (
                                                                        <motion.div
                                                                            layoutId="activeBackground"
                                                                            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-600 to-green-500 rounded-2xl"
                                                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                                                        />
                                                                    )
                                                                }
                                                                {
                                                                    isCollapsed ? (
                                                                        <div className="relative z-10 flex items-center justify-center">
                                                                            <div
                                                                                className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                                                                            >
                                                                                {route.icon}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-3 relative z-10 w-full">
                                                                            <div
                                                                                className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"} flex-shrink-0`}
                                                                            >
                                                                                {route.icon}
                                                                            </div>
                                                                            <motion.span
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: index * 0.03 }}
                                                                                className="text-sm font-medium truncate"
                                                                            >
                                                                                {route.name}
                                                                            </motion.span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </motion.button>
                                                    </TooltipTrigger>
                                                    {
                                                        isCollapsed && (
                                                            <TooltipContent side="right">
                                                                <p>{route.name}</p>
                                                            </TooltipContent>
                                                        )
                                                    }
                                                </Tooltip>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className={`${isCollapsed ? "px-2" : "px-4"} text-center`}>
                                    {
                                        !isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-6 mb-4 backdrop-blur-sm border border-teal-100"
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <UserPlus className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">Join SpeakFluent</h3>
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                    Sign in to access all features including AI conversations, progress tracking, and personalized learning.
                                                </p>
                                                <Button
                                                    onClick={handleSignIn}
                                                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                                                >
                                                    Sign In
                                                </Button>
                                            </motion.div>
                                        )
                                    }
                                    {
                                        isCollapsed && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        onClick={handleSignIn}
                                                        size="sm"
                                                        className="w-10 h-10 p-0 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p>Sign In</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <motion.button
                        onClick={toggleSidebar}
                        className="absolute top-1/2 -translate-y-1/2 -right-4 p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 z-30 cursor-pointer"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                    {
                        session?.user && (
                            <div className="border-t border-border/20 p-4 mt-auto bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
                                <div className={`flex items-center justify-between ${isCollapsed ? "flex-col" : "flex-row"}`}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                                            <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
                                            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold">
                                                {session.user.name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleSignOut}
                                                className={`${isCollapsed ? "h-10 w-10 p-0" : "px-3"} hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 cursor-pointer transition-all duration-200`}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {!isCollapsed && <span className="ml-2 text-sm">Sign Out</span>}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={isCollapsed ? "right" : "top"}>
                                            <p>Sign Out</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        )
                    }
                </div>
            </motion.div>
        </TooltipProvider>
    )
}

export default Sidebar;