"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Globe, Check, BookOpen, Mic, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface LanguageOption {
    id: string
    name: string
    flag: string
    level: string
}

interface LevelOption {
    id: string
    name: string
    description: string
    icon: React.ReactNode
}

interface GoalOption {
    id: string
    name: string
    description: string
    icon: React.ReactNode
}

interface TimeOption {
    id: string
    minutes: number
    description: string
}

const Onboarding = () => {
    const [step, setStep] = useState(1)
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const totalSteps = 4
    const progress = (step / totalSteps) * 100

    const languages: LanguageOption[] = [
        { id: "russian", name: "Russian", flag: "🇷🇺", level: "Intermediate" },
        { id: "japanese", name: "Japanese", flag: "🇯🇵", level: "Beginner" },
        { id: "english", name: "English", flag: "🇺🇸", level: "Advanced" },
        { id: "spanish", name: "Spanish", flag: "🇪🇸", level: "Coming Soon" },
        { id: "french", name: "French", flag: "🇫🇷", level: "Coming Soon" },
        { id: "german", name: "German", flag: "🇩🇪", level: "Coming Soon" },
    ]

    const levels: LevelOption[] = [
        {
            id: "beginner",
            name: "Beginner",
            description: "Little to no prior knowledge",
            icon: (
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                </div>
            ),
        },
        {
            id: "intermediate",
            name: "Intermediate",
            description: "Can have basic conversations",
            icon: (
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                    </div>
                </div>
            ),
        },
        {
            id: "advanced",
            name: "Advanced",
            description: "Comfortable with most topics",
            icon: (
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                    </div>
                </div>
            ),
        },
    ]

    const goals: GoalOption[] = [
        {
            id: "travel",
            name: "Travel",
            description: "Learn essential phrases for your trips",
            icon: <Globe className="w-6 h-6 text-teal-600" />,
        },
        {
            id: "work",
            name: "Work",
            description: "Professional vocabulary for your career",
            icon: <BookOpen className="w-6 h-6 text-teal-600" />,
        },
        {
            id: "conversation",
            name: "Conversation",
            description: "Everyday speaking with natives",
            icon: <MessageCircle className="w-6 h-6 text-teal-600" />,
        },
        {
            id: "culture",
            name: "Culture",
            description: "Understand traditions and customs",
            icon: <Mic className="w-6 h-6 text-teal-600" />,
        },
    ]

    const times: TimeOption[] = [
        { id: "casual", minutes: 10, description: "10 minutes daily" },
        { id: "regular", minutes: 20, description: "20 minutes daily" },
        { id: "serious", minutes: 30, description: "30 minutes daily" },
        { id: "intensive", minutes: 60, description: "60+ minutes daily" },
    ]

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleComplete = () => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard")
        }, 1500)
    }

    const isStepComplete = () => {
        switch (step) {
            case 1:
                return (
                    selectedLanguage !== null &&
                    selectedLanguage !== "spanish" &&
                    selectedLanguage !== "french" &&
                    selectedLanguage !== "german"
                )
            case 2:
                return selectedLevel !== null
            case 3:
                return selectedGoal !== null
            case 4:
                return selectedTime !== null
            default:
                return false
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-teal-50/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-500/10 to-emerald-500/10 rounded-tl-full"></div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute top-20 left-20 animate-float"
            >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Mic className="w-7 h-7 text-teal-500" />
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute top-40 right-32 animate-float-delayed"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-500" />
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-32 left-32 animate-float-slow"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8 text-teal-500" />
                </div>
            </motion.div>
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                        HimalSpeak
                    </span>
                </Link>
            </div>
            <div className="w-full max-w-md mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                        Step {step} of {totalSteps}
                    </span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress
                    value={progress}
                    className="h-2 bg-teal-100 bg-gradient-to-r from-teal-500 to-emerald-600"
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-teal-100">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {
                                    step === 1 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose your language</h2>
                                            <p className="text-gray-600 mb-6">Which language would you like to learn?</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {
                                                    languages.map((language) => (
                                                        <div
                                                            key={language.id}
                                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedLanguage === language.id
                                                                ? "border-teal-500 bg-teal-50"
                                                                : "border-gray-200 hover:border-teal-200 hover:bg-teal-50/50"
                                                                } ${language.id === "spanish" || language.id === "french" || language.id === "german"
                                                                    ? "opacity-60 cursor-not-allowed"
                                                                    : ""
                                                                }`}
                                                            onClick={() => {
                                                                if (language.id !== "spanish" && language.id !== "french" && language.id !== "german") {
                                                                    setSelectedLanguage(language.id)
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex flex-col items-center text-center">
                                                                <span className="text-4xl mb-2">{language.flag}</span>
                                                                <span className="font-medium text-gray-800">{language.name}</span>
                                                                <span className="text-xs text-gray-500 mt-1">{language.level}</span>
                                                            </div>
                                                            {
                                                                selectedLanguage === language.id && (
                                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                                        <Check className="w-4 h-4 text-white" />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    step === 2 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your proficiency level</h2>
                                            <p className="text-gray-600 mb-6">How would you describe your current level?</p>

                                            <RadioGroup value={selectedLevel || ""} onValueChange={setSelectedLevel} className="space-y-4">
                                                {
                                                    levels.map((level) => (
                                                        <div
                                                            key={level.id}
                                                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedLevel === level.id
                                                                ? "border-teal-500 bg-teal-50"
                                                                : "border-gray-200 hover:border-teal-200 hover:bg-teal-50/50"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value={level.id} id={level.id} className="sr-only" />
                                                            <Label htmlFor={level.id} className="flex items-center space-x-4 cursor-pointer flex-1">
                                                                <div>{level.icon}</div>
                                                                <div>
                                                                    <div className="font-medium text-gray-800">{level.name}</div>
                                                                    <div className="text-sm text-gray-500">{level.description}</div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </div>
                                    )
                                }
                                {
                                    step === 3 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your learning goal</h2>
                                            <p className="text-gray-600 mb-6">What&apos;s your primary reason for learning?</p>
                                            <RadioGroup value={selectedGoal || ""} onValueChange={setSelectedGoal} className="space-y-4">
                                                {
                                                    goals.map((goal) => (
                                                        <div
                                                            key={goal.id}
                                                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedGoal === goal.id
                                                                ? "border-teal-500 bg-teal-50"
                                                                : "border-gray-200 hover:border-teal-200 hover:bg-teal-50/50"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value={goal.id} id={goal.id} className="sr-only" />
                                                            <Label htmlFor={goal.id} className="flex items-center space-x-4 cursor-pointer flex-1">
                                                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                                    {goal.icon}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-800">{goal.name}</div>
                                                                    <div className="text-sm text-gray-500">{goal.description}</div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </div>
                                    )
                                }
                                {
                                    step === 4 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily learning time</h2>
                                            <p className="text-gray-600 mb-6">How much time can you commit each day?</p>
                                            <RadioGroup value={selectedTime || ""} onValueChange={setSelectedTime} className="space-y-4">
                                                {
                                                    times.map((time) => (
                                                        <div
                                                            key={time.id}
                                                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTime === time.id
                                                                ? "border-teal-500 bg-teal-50"
                                                                : "border-gray-200 hover:border-teal-200 hover:bg-teal-50/50"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value={time.id} id={time.id} className="sr-only" />
                                                            <Label htmlFor={time.id} className="flex items-center space-x-4 cursor-pointer flex-1">
                                                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                                                    {time.minutes}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-800">{time.description}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {time.id === "casual" && "Perfect for busy schedules"}
                                                                        {time.id === "regular" && "Consistent daily practice"}
                                                                        {time.id === "serious" && "Faster progress and retention"}
                                                                        {time.id === "intensive" && "Rapid fluency development"}
                                                                    </div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </div>
                                    )
                                }
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 1}
                                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={!isStepComplete() || isLoading}
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl"
                            >
                                {
                                    isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="mr-2"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </motion.div>
                                            Setting up...
                                        </>
                                    ) : step === totalSteps ? (
                                        <>
                                            Complete
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )
                                }
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <div className="mt-6">
                <Button variant="link" onClick={() => router.push("/dashboard")} className="text-gray-500 hover:text-teal-700">
                    Skip for now
                </Button>
            </div>
        </div>
    )
}

export default Onboarding;