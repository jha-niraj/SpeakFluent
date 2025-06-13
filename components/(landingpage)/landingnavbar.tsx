"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, Globe, BookOpen, Trophy, Target, Rocket, Users, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

const navigation = [
    {
        name: "Features",
        href: "#features",
        icon: Globe,
    },
    {
        name: "Pricing",
        href: "#pricing",
        icon: Trophy,
    },
    {
        name: "How It Works",
        href: "#how-it-works",
        icon: Rocket,
    },
    {
        name: "Challenges",
        href: "#challenges",
        icon: Target,
    },
]

const resourcesItems = [
    {
        name: "Language Guides",
        href: "/guides",
        description: "Comprehensive learning resources",
        icon: BookOpen,
    },
    {
        name: "Community",
        href: "/community",
        description: "Connect with fellow learners",
        icon: Users,
    },
]

export default function LandingNavbar() {
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href) || (href.startsWith("#") && pathname === "/")
    }

    const isResourceActive = () => {
        return resourcesItems.some((item) => pathname.startsWith(item.href))
    }

    return (
        <div className="w-full h-20 flex items-center justify-center fixed top-0 z-50 mt-2">
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                    "w-[100%] w-full md:w-[96%] md:max-w-7xl mx-auto rounded-2xl transition-all duration-300 border border-teal-200/20",
                    scrolled
                        ? "bg-white/80 backdrop-blur-xl shadow-xl shadow-teal-100/20"
                        : "bg-white/70 backdrop-blur-lg shadow-lg shadow-teal-50/30",
                )}
            >
                <nav className="px-6" aria-label="Global">
                    <div className="flex items-center justify-between h-16">
                        <motion.div className="flex lg:flex-1" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Link href="/" className="flex items-center group gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                                    HimalSpeak
                                </span>
                            </Link>
                        </motion.div>
                        <div className="hidden lg:flex lg:gap-x-1 items-center">
                            {
                                navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                                            isActive(item.href)
                                                ? "text-teal-700 bg-teal-50 shadow-sm"
                                                : "text-teal-800 hover:text-teal-700 hover:bg-teal-50/50",
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                        {
                                            isActive(item.href) && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )
                                        }
                                    </Link>
                                ))
                            }
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={cn(
                                            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                                            isResourceActive()
                                                ? "text-teal-700 bg-teal-50 shadow-sm"
                                                : "text-teal-800 hover:text-teal-700 hover:bg-teal-50/50",
                                        )}
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Resources
                                        <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                                        {
                                            isResourceActive() && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )
                                        }
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="w-56 p-2 rounded-xl">
                                    {
                                        resourcesItems.map((item) => (
                                            <DropdownMenuItem asChild key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                        pathname.startsWith(item.href)
                                                            ? "bg-teal-50 text-teal-700"
                                                            : "hover:bg-teal-50 hover:text-teal-700",
                                                    )}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <div>
                                                        <div>{item.name}</div>
                                                        <div className="text-xs text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-2">
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
                            {
                                status !== "authenticated" ? (
                                    <>
                                        <Link href="/signin">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link href="/signup">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                                >
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
                                        >
                                            Buy Credits
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-teal-200 transition-all">
                                                    <AvatarImage src="/placeholder.svg?height=36&width=36" />
                                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                                                        US
                                                    </AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">My Courses</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-500">Sign Out</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            }
                        </div>
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="lg:hidden text-teal-700 hover:bg-teal-50 rounded-xl">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-teal-50 to-white">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="p-6 border-b border-teal-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <Globe className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full animate-pulse"></div>
                                            </div>
                                            <div>
                                                <SheetTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                                    HimalSpeak
                                                </SheetTitle>
                                                <p className="text-xs text-teal-600 font-medium">Master Languages Like a Native</p>
                                            </div>
                                        </div>
                                    </SheetHeader>
                                    <div className="flex-1 p-6 overflow-y-auto">
                                        <div className="space-y-2">
                                            {
                                                navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300",
                                                            isActive(item.href)
                                                                ? "text-teal-700 bg-teal-100 border border-teal-200 shadow-sm"
                                                                : "text-teal-800 hover:text-teal-700 hover:bg-teal-50",
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{item.name}</span>
                                                        </div>
                                                    </Link>
                                                ))
                                            }
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="resources" className="border-none">
                                                    <AccordionTrigger
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300",
                                                            isResourceActive()
                                                                ? "text-teal-700 bg-teal-100 border border-teal-200 shadow-sm"
                                                                : "text-teal-800 hover:text-teal-700 hover:bg-teal-50",
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <BookOpen className="h-5 w-5" />
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold">Resources</span>
                                                                <span className="text-xs text-teal-600 mt-1">Guides & Community</span>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-2 pb-0">
                                                        <div className="space-y-1 pl-12">
                                                            {
                                                                resourcesItems.map((item) => (
                                                                    <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                        className={cn(
                                                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300",
                                                                            pathname.startsWith(item.href)
                                                                                ? "text-teal-700 bg-teal-50 border border-teal-100"
                                                                                : "text-teal-700 hover:bg-teal-50",
                                                                        )}
                                                                    >
                                                                        <item.icon className="h-4 w-4" />
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">{item.name}</span>
                                                                            <span className="text-xs text-teal-600 mt-0.5">{item.description}</span>
                                                                        </div>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                        <div className="mt-8 space-y-3">
                                            {
                                                status !== "authenticated" ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl"
                                                        >
                                                            Sign In
                                                        </Button>
                                                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg rounded-xl">
                                                            Sign Up
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                                                                    US
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-teal-900">User Name</p>
                                                                <p className="text-xs text-teal-600">250 credits available</p>
                                                            </div>
                                                        </div>
                                                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg rounded-xl">
                                                            Buy Credits
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-teal-100 bg-teal-50/50">
                                        <div className="text-center">
                                            <p className="text-xs text-teal-600 font-medium">© 2024 HimalSpeak</p>
                                            <p className="text-xs text-teal-500 mt-1">Master Languages Like a Native</p>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </motion.header>
        </div>
    )
}