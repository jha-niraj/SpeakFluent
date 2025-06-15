"use client";

import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    useSidebar
} from '@/components/ui/sidebar';
import {
    Home,
    LayoutDashboard,
    Mic,
    MessageSquare,
    BookOpenText,
    Users,
    User,
    Settings,
    LogOut,
    Crown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AppSidebar() {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const navigationItems = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
    ];

    const toolItems = [
        {
            title: "VoiceVoyage",
            url: "/dashboard?tool=voicevoyage",
            icon: Mic,
            description: "Conversation AI"
        },
        {
            title: "StorySpeak",
            url: "/dashboard?tool=storyspeak",
            icon: Users,
            description: "Interactive Dialogues"
        },
        {
            title: "ChatQuest",
            url: "/dashboard?tool=chatquest",
            icon: MessageSquare,
            description: "Free-form Chat"
        },
        {
            title: "PhraseForge",
            url: "/dashboard?tool=phraseforge",
            icon: BookOpenText,
            description: "Structured Learning"
        },
    ];

    const accountItems = [
        {
            title: "Profile",
            url: "/profile",
            icon: User,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ];

    const handleLinkClick = () => {
        // Close mobile sidebar when link is clicked
        setOpenMobile(false);
    };

    return (
        <Sidebar className="border-r border-gray-200">
            <SidebarHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-gray-900">SpeakFluent</h2>
                        <p className="text-xs text-gray-500">Language Learning Platform</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
                {/* Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                href={item.url}
                                                onClick={handleLinkClick}
                                                className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
                                            >
                                                <IconComponent className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Learning Tools */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Learning Tools
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {toolItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                onClick={handleLinkClick}
                                                className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
                                            >
                                                <IconComponent className="h-5 w-5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">{item.title}</div>
                                                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Account */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                href={item.url}
                                                onClick={handleLinkClick}
                                                className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
                                            >
                                                <IconComponent className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-100">
                {/* User Profile Section */}
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-semibold">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">John Doe</div>
                        <div className="text-xs text-gray-500 truncate">john@example.com</div>
                    </div>
                </div>

                {/* Logout Button */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button
                                onClick={handleLinkClick}
                                className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600 w-full text-left"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}