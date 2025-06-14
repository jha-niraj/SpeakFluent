"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ChevronRight, Globe } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { signOut } from "next-auth/react"

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

    const isActiveRoute = (path: string) => {
        if (path === "dashboard") {
            return pathname === "/dashboard" || pathname === "/"
        }
        return pathname.includes(path)
    }

    const activeRoutes = routes.filter((route) => route.status === "active")
    const comingRoutes = routes.filter((route) => route.status === "coming")

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/auth/signin")
        } catch (error) {
            console.error("Failed to sign out", error)
            toast.error("Failed to sign out")
        }
    }

    return (
        <TooltipProvider>
            <motion.div
                className="fixed top-0 left-0 h-full bg-background/95 backdrop-blur-xl border-r border-border shadow-xl z-20"
                animate={{ width: isCollapsed ? 60 : 200 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center p-4 h-[80px] border-b border-border/50">
                        <Link href="/dashboard" className="flex gap-2 items-center justify-center group cursor-pointer">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/25 transition-all duration-300">
                                    <Globe className="text-white h-6 w-6" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
                            </div>
                            <motion.div
                                animate={{
                                    opacity: isCollapsed ? 0 : 1,
                                    x: isCollapsed ? -20 : 0,
                                    width: isCollapsed ? 0 : "auto",
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                            >
                                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent whitespace-nowrap">
                                    HimalSpeak
                                </h1>
                            </motion.div>
                        </Link>
                    </div>
                    <motion.button
                        onClick={toggleSidebar}
                        className="absolute top-8 -right-3 p-1.5 bg-background rounded-full hover:bg-muted border border-border shadow-lg hover:shadow-xl transition-all duration-300 z-30 cursor-pointer"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                    <div className="flex-grow overflow-y-auto py-4">
                        <div className={`space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}>
                            <motion.div
                                animate={{
                                    opacity: isCollapsed ? 0 : 1,
                                    height: isCollapsed ? 0 : "auto",
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                                className="px-3 mb-3"
                            >
                                {
                                    activeRoutes.length > 0 && (
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                            Learning
                                        </p>
                                    )
                                }
                            </motion.div>
                            <SidebarLinks routes={activeRoutes} collapsed={isCollapsed} isActiveRoute={isActiveRoute} />
                        </div>
                        {
                            comingRoutes.length > 0 && (
                                <div className={`space-y-1 mt-6 ${isCollapsed ? "px-2" : "px-3"}`}>
                                    <motion.div
                                        animate={{
                                            opacity: isCollapsed ? 0 : 1,
                                            height: isCollapsed ? 0 : "auto",
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ overflow: "hidden" }}
                                        className="px-3 mb-3"
                                    >
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                            Coming Soon
                                        </p>
                                    </motion.div>
                                    <SidebarLinks routes={comingRoutes} collapsed={isCollapsed} isActiveRoute={isActiveRoute} />
                                </div>
                            )
                        }
                    </div>
                    <div className="border-t border-border/50 p-3 mt-auto">
                        <div className="space-y-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSignOut}
                                        className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 cursor-pointer`}
                                    >
                                        <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
                                        {!isCollapsed && <span className="text-sm">Sign Out</span>}
                                    </Button>
                                </TooltipTrigger>
                                {
                                    isCollapsed && (
                                        <TooltipContent>
                                            <p>Sign Out</p>
                                        </TooltipContent>
                                    )
                                }
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    )
}

interface SidebarLinksProps {
    routes: Route[]
    collapsed: boolean
    isActiveRoute: (path: string) => boolean
}

const SidebarLinks = ({ routes, collapsed, isActiveRoute }: SidebarLinksProps) => {
    const router = useRouter()

    const handleNavigation = (path: string, status: string) => {
        if (status === "coming") {
            toast("🚀 Feature Coming Soon!", {
                description: "This exciting language feature is currently under development.",
                duration: 3000,
            })
        } else {
            router.push(`/${path}`)
        }
    }

    return (
        <div className="space-y-1">
            {routes.map((route, index) => {
                const isActive = isActiveRoute(route.path)

                return (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <motion.button
                                onClick={() => handleNavigation(route.path, route.status)}
                                className="block w-full cursor-pointer"
                                whileHover={{ x: collapsed ? 0 : 4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.1 }}
                            >
                                <div
                                    className={`
                                    ${isActive
                                            ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25"
                                            : "hover:bg-muted/70 text-foreground"
                                        } 
                                    flex items-center rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden
                                    ${route.status === "coming" ? "opacity-60" : ""}
                                    ${collapsed ? "justify-center px-3 py-3" : "px-3 py-2.5"}
                                `}
                                >
                                    {
                                        isActive && (
                                            <motion.div
                                                layoutId="activeBackground"
                                                className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl"
                                                transition={{ duration: 0.2 }}
                                            />
                                        )
                                    }
                                    {
                                        collapsed ? (
                                            <div className="relative z-10 flex items-center justify-center">
                                                <div
                                                    className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                                                >
                                                    {route.icon}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 relative z-10 w-full">
                                                <div
                                                    className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"} flex-shrink-0`}
                                                >
                                                    {route.icon}
                                                </div>
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="text-sm font-medium truncate"
                                                >
                                                    {route.name}
                                                </motion.span>
                                                {
                                                    route.status === "coming" && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-auto text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                        >
                                                            Soon
                                                        </Badge>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </motion.button>
                        </TooltipTrigger>
                        {
                            collapsed && (
                                <TooltipContent>
                                    <p>{route.name}</p>
                                    {route.status === "coming" && <p className="text-xs text-muted-foreground">Coming Soon</p>}
                                </TooltipContent>
                            )
                        }
                    </Tooltip>
                )
            })
            }
        </div>
    )
}

export default Sidebar
