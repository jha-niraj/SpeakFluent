'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    Mic, Play, Square, Volume2,
    MessageSquare, Star, Clock, Coins, Mountain,
    Users, Globe, Zap, Brain, VolumeX
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { startConversationSession, endConversationSession } from '@/actions/conversation.action'
import { getUserCredits } from '@/actions/credits.action'
import { toast } from 'sonner'
import { useConversation } from '@elevenlabs/react'
import { Label } from '@/components/ui/label'

interface ConversationState {
    isActive: boolean
    sessionId: string | null
    startTime: Date | null
    duration: number
    transcript: Array<{
        id: string
        type: 'user' | 'ai' | 'system'
        content: string
        timestamp: Date
    }>
}

const ConversationPage = () => {
    const [conversationState, setConversationState] = useState<ConversationState>({
        isActive: false,
        sessionId: null,
        startTime: null,
        duration: 0,
        transcript: []
    })

    const [selectedLanguage, setSelectedLanguage] = useState('english')
    const [selectedTopic, setSelectedTopic] = useState('')
    const [customTopic, setCustomTopic] = useState('')
    const [credits, setCredits] = useState(0)
    const [showStartDialog, setShowStartDialog] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const [sessionRating, setSessionRating] = useState(0)
    const [sessionFeedback, setSessionFeedback] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [conversationVolume, setConversationVolume] = useState(0.8)
    const [hasPermission, setHasPermission] = useState(false)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected to ElevenLabs')
            toast.success('Connected to AI tutor! 🤖')
            addToTranscript('system', 'Connected to AI tutor. You can start speaking!')
        },
        onDisconnect: () => {
            console.log('Disconnected from ElevenLabs')
            toast.info('Disconnected from AI tutor')
            addToTranscript('system', 'Conversation ended.')
        },
        onMessage: (message) => {
            console.log('Message received:', message)
            // Handle different message types from ElevenLabs
            if (message.source === 'user' && message.message) {
                addToTranscript('user', message.message)
            } else if (message.source === 'ai' && message.message) {
                addToTranscript('ai', message.message)
            }
        },
        onError: (error) => {
            console.error('ElevenLabs error:', error)
            const errorMessage = typeof error === 'string' ? error : 'Connection error occurred'
            toast.error('Conversation error: ' + errorMessage)
        }
    })

    const languages = [
        { value: 'english', label: 'English 🇺🇸', flag: '🇺🇸' },
        { value: 'spanish', label: 'Spanish 🇪🇸', flag: '🇪🇸' },
        { value: 'french', label: 'French 🇫🇷', flag: '🇫🇷' },
        { value: 'german', label: 'German 🇩🇪', flag: '🇩🇪' },
        { value: 'chinese', label: 'Chinese 🇨🇳', flag: '🇨🇳' },
        { value: 'japanese', label: 'Japanese 🇯🇵', flag: '🇯🇵' },
        { value: 'korean', label: 'Korean 🇰🇷', flag: '🇰🇷' },
        { value: 'russian', label: 'Russian 🇷🇺', flag: '🇷🇺' }
    ]

    const topics = [
        { value: 'general', label: 'General Conversation', icon: MessageSquare },
        { value: 'travel', label: 'Travel & Tourism', icon: Globe },
        { value: 'business', label: 'Business & Work', icon: Users },
        { value: 'culture', label: 'Culture & Traditions', icon: Mountain },
        { value: 'food', label: 'Food & Cooking', icon: Zap },
        { value: 'custom', label: 'Custom Topic', icon: Brain }
    ]

    useEffect(() => {
        fetchCredits()
        checkMicrophonePermission()
    }, [])

    useEffect(() => {
        if (conversationState.isActive && conversationState.startTime) {
            intervalRef.current = setInterval(() => {
                const now = new Date()
                const diff = Math.floor((now.getTime() - conversationState.startTime!.getTime()) / 1000)
                setConversationState(prev => ({ ...prev, duration: diff }))
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [conversationState.isActive, conversationState.startTime])

    const checkMicrophonePermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            setHasPermission(true)
        } catch (error) {
            console.error('Microphone permission denied:', error)
            setHasPermission(false)
            toast.error('Microphone access is required for conversations')
        }
    }

    const fetchCredits = async () => {
        try {
            const userCredits = await getUserCredits()
            setCredits(userCredits)
        } catch (error) {
            console.error('Error fetching credits:', error)
        }
    }

    const addToTranscript = (type: 'user' | 'ai' | 'system', content: string) => {
        const newEntry = {
            id: Date.now().toString(),
            type,
            content,
            timestamp: new Date()
        }
        setConversationState(prev => ({
            ...prev,
            transcript: [...prev.transcript, newEntry]
        }))
    }

    const handleStartConversation = async () => {
        if (credits < 10) {
            toast.error('Insufficient credits! You need at least 10 credits to start a conversation.')
            return
        }

        if (!hasPermission) {
            toast.error('Please allow microphone access to start conversation.')
            return
        }

        setIsLoading(true)
        try {
            const topic = selectedTopic === 'custom' ? customTopic : selectedTopic
            const result = await startConversationSession(selectedLanguage, topic || undefined)

            if (result.success) {
                setConversationState({
                    isActive: true,
                    sessionId: result.sessionId!,
                    startTime: new Date(),
                    duration: 0,
                    transcript: []
                })
                setShowStartDialog(false)
                await fetchCredits() // Refresh credits

                // Start ElevenLabs conversation
                try {
                    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
                    if (agentId) {
                        await conversation.startSession({
                            agentId: agentId
                        })
                    } else {
                        toast.error('Agent ID not configured')
                    }
                } catch (elevenlabsError) {
                    console.error('ElevenLabs connection error:', elevenlabsError)
                    toast.error('Failed to connect to AI tutor')
                }

                toast.success('Conversation started! 🎉')
            } else {
                toast.error(result.error || 'Failed to start conversation')
            }
        } catch (error) {
            console.error('Error starting conversation:', error)
            toast.error('Failed to start conversation')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEndConversation = async () => {
        if (!conversationState.sessionId) return

        setIsLoading(true)
        try {
            // End ElevenLabs conversation
            if (conversation.status === 'connected') {
                await conversation.endSession()
            }

            const result = await endConversationSession(
                conversationState.sessionId,
                conversationState.duration,
                sessionRating,
                sessionFeedback
            )

            if (result.success) {
                setConversationState({
                    isActive: false,
                    sessionId: null,
                    startTime: null,
                    duration: 0,
                    transcript: []
                })
                setShowEndDialog(false)
                setSessionRating(0)
                setSessionFeedback('')
                toast.success('Conversation ended! Great job! 🌟')
            } else {
                toast.error(result.error || 'Failed to end conversation')
            }
        } catch (error) {
            console.error('Error ending conversation:', error)
            toast.error('Failed to end conversation')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVolumeChange = async (volume: number) => {
        setConversationVolume(volume)
        if (conversation.status === 'connected') {
            try {
                await conversation.setVolume({ volume })
            } catch (error) {
                console.error('Error setting volume:', error)
            }
        }
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const getSelectedLanguageLabel = () => {
        return languages.find(lang => lang.value === selectedLanguage)?.label || 'English'
    }

    const getSelectedTopicLabel = () => {
        if (selectedTopic === 'custom') return customTopic || 'Custom Topic'
        return topics.find(topic => topic.value === selectedTopic)?.label || 'General Conversation'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {
                    !conversationState.isActive ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    AI Language Conversation
                                </h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    Practice speaking with our AI tutor in your chosen language
                                </p>
                                <div className="flex items-center justify-center space-x-4 mb-6">
                                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                                        10 Credits per Session
                                    </Badge>
                                    {
                                        !hasPermission && (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                Microphone Required
                                            </Badge>
                                        )
                                    }
                                </div>
                            </div>
                            <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-8">
                                <CardHeader>
                                    <CardTitle>Session Settings</CardTitle>
                                    <CardDescription>Configure your conversation preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    languages.map(lang => (
                                                        <SelectItem key={lang.value} value={lang.value}>
                                                            {lang.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Topic</label>
                                        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a topic" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    topics.map(topic => (
                                                        <SelectItem key={topic.value} value={topic.value}>
                                                            {topic.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {
                                        selectedTopic === 'custom' && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Custom Topic</Label>
                                                <Textarea
                                                    placeholder="Describe what you'd like to talk about..."
                                                    value={customTopic}
                                                    onChange={(e) => setCustomTopic(e.target.value)}
                                                    className="resize-none"
                                                    rows={3}
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        !hasPermission && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className="text-sm text-red-700 mb-2">
                                                    🎤 Microphone access is required for conversations
                                                </p>
                                                <Button
                                                    onClick={checkMicrophonePermission}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200"
                                                >
                                                    Allow Microphone
                                                </Button>
                                            </div>
                                        )
                                    }
                                </CardContent>
                            </Card>
                            <Button
                                onClick={() => setShowStartDialog(true)}
                                disabled={credits < 10 || !hasPermission}
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                {credits < 10 ? 'Need More Credits' : !hasPermission ? 'Allow Microphone First' : 'Start Conversation'}
                                <Play className="ml-2 h-5 w-5" />
                            </Button>
                            {
                                credits < 10 && (
                                    <div className="mt-4">
                                        <Link href="/purchase">
                                            <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                                                Buy Credits
                                                <Coins className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            }
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                <MessageSquare className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{getSelectedLanguageLabel()}</h3>
                                                <p className="text-sm text-gray-600">{getSelectedTopicLabel()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDuration(conversationState.duration)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm min-h-[400px]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <MessageSquare className="w-5 h-5 text-teal-600" />
                                            <span>Conversation</span>
                                        </CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <VolumeX className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={conversationVolume}
                                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                className="w-20"
                                            />
                                            <Volume2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {
                                        conversationState.transcript.length > 0 ? (
                                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                                <AnimatePresence>
                                                    {
                                                        conversationState.transcript.map((entry) => (
                                                            <motion.div
                                                                key={entry.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${entry.type === 'user'
                                                                        ? 'bg-teal-500 text-white'
                                                                        : entry.type === 'ai'
                                                                            ? 'bg-gray-100 text-gray-900'
                                                                            : 'bg-blue-50 text-blue-700 text-sm'
                                                                    }`}>
                                                                    <p className="text-sm">{entry.content}</p>
                                                                    <p className="text-xs opacity-70 mt-1">
                                                                        {entry.timestamp.toLocaleTimeString()}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        ))
                                                    }
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center ${conversation.isSpeaking ? 'animate-pulse' : ''}`}>
                                                        <Mic className="w-10 h-10 text-white" />
                                                    </div>
                                                </div>
                                                <p className="text-lg text-gray-600 mb-4">
                                                    {
                                                        conversation.status === 'connected'
                                                            ? conversation.isSpeaking
                                                                ? "AI is speaking..."
                                                                : "Start speaking to begin the conversation!"
                                                            : "Connecting to AI tutor..."
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Your AI tutor is ready to help you practice {getSelectedLanguageLabel().toLowerCase()}
                                                </p>
                                            </div>
                                        )
                                    }
                                </CardContent>
                            </Card>
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    onClick={() => setShowEndDialog(true)}
                                    variant="outline"
                                    size="lg"
                                    className="px-6"
                                >
                                    <Square className="w-4 h-4 mr-2" />
                                    End Session
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start Conversation Session</DialogTitle>
                        <DialogDescription>
                            You&apos;re about to start a conversation session that will use 10 credits.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-teal-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Language:</span>
                                <span>{getSelectedLanguageLabel()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Topic:</span>
                                <span>{getSelectedTopicLabel()}</span>
                            </div>
                            <div className="flex justify-between items-center font-semibold text-teal-700">
                                <span>Credits Required:</span>
                                <span>10 credits</span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setShowStartDialog(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleStartConversation}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600"
                            >
                                {isLoading ? 'Starting...' : 'Start Session'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>End Conversation Session</DialogTitle>
                        <DialogDescription>
                            How was your conversation experience?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Rate your session (1-5 stars)</label>
                            <div className="flex space-x-1">
                                {
                                    [1, 2, 3, 4, 5].map((star) => (
                                        <Button
                                            key={star}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSessionRating(star)}
                                            className="p-1"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= sessionRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                            />
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Feedback (optional)</label>
                            <Textarea
                                placeholder="How did it go? Any thoughts to share?"
                                value={sessionFeedback}
                                onChange={(e) => setSessionFeedback(e.target.value)}
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setShowEndDialog(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEndConversation}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600"
                            >
                                {isLoading ? 'Ending...' : 'End Session'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ConversationPage;