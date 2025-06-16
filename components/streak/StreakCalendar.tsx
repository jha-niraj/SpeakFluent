"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Flame, TrendingUp, Calendar, ChevronLeft, ChevronRight,
    MessageSquare, BookOpen, Clock, Coins, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStreakCalendar, getUserStreakData } from '@/actions/streak.action';
import { toast } from 'sonner';

interface DayActivity {
    date: Date;
    hasActivity: boolean;
    activity: {
        conversationCount: number;
        moduleProgress: number;
        totalTimeSpent: number;
        creditsEarned: number;
    } | null;
}

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date | null;
    activities: any[];
    streakRewards: any[];
    nextMilestone: number | undefined;
}

interface StreakCalendarProps {
    className?: string;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ className = "" }) => {
    const [calendarData, setCalendarData] = useState<DayActivity[]>([]);
    const [streakData, setStreakData] = useState<StreakData | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<DayActivity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        fetchCalendarData();
        fetchStreakData();
    }, [currentMonth, currentYear]);

    const fetchCalendarData = async () => {
        try {
            const result = await getStreakCalendar(currentYear, currentMonth);
            if (result.success && result.data) {
                setCalendarData(result.data.calendar);
            }
        } catch (error) {
            console.error('Error fetching calendar:', error);
            toast.error('Failed to load calendar data');
        }
    };

    const fetchStreakData = async () => {
        try {
            const result = await getUserStreakData();
            if (result.success && result.data) {
                setStreakData(result.data as StreakData);
            }
        } catch (error) {
            console.error('Error fetching streak data:', error);
            toast.error('Failed to load streak data');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1);
            } else {
                setCurrentMonth(prev => prev - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1);
            } else {
                setCurrentMonth(prev => prev + 1);
            }
        }
    };

    const getActivityIntensity = (activity: DayActivity['activity']) => {
        if (!activity) return 0;
        
        // Calculate intensity based on total activity
        const totalActivity = activity.conversationCount + activity.moduleProgress + Math.floor(activity.totalTimeSpent / 10);
        
        if (totalActivity === 0) return 0;
        if (totalActivity <= 2) return 1;
        if (totalActivity <= 5) return 2;
        if (totalActivity <= 10) return 3;
        return 4;
    };

    const getIntensityColor = (intensity: number) => {
        switch (intensity) {
            case 0: return 'bg-gray-100 border-gray-200';
            case 1: return 'bg-teal-100 border-teal-200';
            case 2: return 'bg-teal-300 border-teal-400';
            case 3: return 'bg-teal-500 border-teal-600';
            case 4: return 'bg-teal-700 border-teal-800';
            default: return 'bg-gray-100 border-gray-200';
        }
    };

    const generateCalendarGrid = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const grid = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            grid.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = calendarData.find(d => new Date(d.date).getDate() === day);
            grid.push(dayData || {
                date: new Date(currentYear, currentMonth, day),
                hasActivity: false,
                activity: null
            });
        }

        return grid;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className={`${className} space-y-6`}>
                <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                    <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const calendarGrid = generateCalendarGrid();

    return (
        <div className={`${className} space-y-6`}>
            {/* Streak Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                                <p className="text-3xl font-bold">{streakData?.currentStreak || 0}</p>
                                <p className="text-orange-100 text-xs">days</p>
                            </div>
                            <Flame className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Longest Streak</p>
                                <p className="text-3xl font-bold text-teal-600">{streakData?.longestStreak || 0}</p>
                                <p className="text-gray-500 text-xs">days</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-teal-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Next Milestone</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {streakData?.nextMilestone || '365+'}
                                </p>
                                <p className="text-gray-500 text-xs">days</p>
                            </div>
                            <Trophy className="w-8 h-8 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar */}
            <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-teal-600" />
                            Activity Calendar
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-medium min-w-[120px] text-center">
                                {monthNames[currentMonth]} {currentYear}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarGrid.map((dayData, index) => {
                            if (!dayData) {
                                return <div key={index} className="h-8"></div>;
                            }

                            const intensity = getActivityIntensity(dayData.activity);
                            const isToday = new Date(dayData.date).toDateString() === new Date().toDateString();
                            const isFuture = new Date(dayData.date) > new Date();

                            return (
                                <motion.button
                                    key={index}
                                    className={`
                                        h-8 w-8 rounded border-2 text-xs font-medium transition-all duration-200
                                        ${getIntensityColor(intensity)}
                                        ${isToday ? 'ring-2 ring-blue-500' : ''}
                                        ${isFuture ? 'opacity-30' : 'hover:scale-110 cursor-pointer'}
                                        ${selectedDay?.date.getTime() === dayData.date.getTime() ? 'ring-2 ring-purple-500' : ''}
                                    `}
                                    onClick={() => setSelectedDay(dayData)}
                                    disabled={isFuture}
                                    whileHover={{ scale: isFuture ? 1 : 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {new Date(dayData.date).getDate()}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map(intensity => (
                                    <div
                                        key={intensity}
                                        className={`w-3 h-3 rounded border ${getIntensityColor(intensity)}`}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {calendarData.filter(d => d.hasActivity).length} active days this month
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Selected Day Details */}
            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {formatDate(selectedDay.date)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {selectedDay.hasActivity && selectedDay.activity ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-teal-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Conversations</p>
                                                <p className="font-bold text-teal-600">
                                                    {selectedDay.activity.conversationCount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-emerald-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Module Progress</p>
                                                <p className="font-bold text-emerald-600">
                                                    {selectedDay.activity.moduleProgress}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Time Spent</p>
                                                <p className="font-bold text-blue-600">
                                                    {Math.round(selectedDay.activity.totalTimeSpent / 60)}m
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4 text-yellow-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Credits Earned</p>
                                                <p className="font-bold text-yellow-600">
                                                    {selectedDay.activity.creditsEarned}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-2">📅</div>
                                        <p className="text-gray-600">No learning activity on this day</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Start a conversation or complete a module to build your streak!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Streak Rewards */}
            {streakData?.streakRewards && streakData.streakRewards.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            Streak Rewards Earned
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {streakData.streakRewards.map((reward: any) => (
                                <div key={reward.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🏆</div>
                                        <p className="font-bold text-gray-800">{reward.streakDays} Days</p>
                                        <p className="text-sm text-gray-600 mb-2">Streak Reward</p>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                            +{reward.creditsAwarded} credits
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default StreakCalendar; 