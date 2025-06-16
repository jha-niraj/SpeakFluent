"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    User, Settings, Globe, Crown,
    Edit3, Save, X, Lock, Eye, EyeOff,
    Shield, CreditCard, Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { getUserProfile, updateProfile, changePassword } from '@/actions/profile.action'
import { getCreditTransactions } from '@/actions/credits.action'
import { updateLanguagePreference } from '@/actions/foundations.action'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const ProfilePage = () => {
    const { data: session, update } = useSession()
    const [activeTab, setActiveTab] = useState('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [editName, setEditName] = useState('')
    const [editLanguage, setEditLanguage] = useState('')
    const [isSaving, setSaving] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, transactionData] = await Promise.all([
                    getUserProfile(),
                    getCreditTransactions()
                ])

                setProfile(profileData)
                setEditName(profileData?.name || '')
                setEditLanguage(profileData?.selectedLanguage || '')
                setTransactions(transactionData)
            } catch (error) {
                console.error('Error fetching profile data:', error)
                toast.error('Failed to load profile data')
            } finally {
                setIsLoading(false)
            }
        }

        if (session?.user?.id) {
            fetchData()
        }
    }, [session])

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const updates: any = { name: editName }
            
            if (editLanguage !== profile?.selectedLanguage) {
                const languageResult = await updateLanguagePreference(editLanguage)
                if (!languageResult.success) {
                    toast.error(languageResult.error || 'Failed to update language preference')
                    setSaving(false)
                    return
                }
            }

            const result = await updateProfile(updates)

            if (result.success) {
                setProfile({ ...profile, name: editName, selectedLanguage: editLanguage })
                await update({ name: editName })
                setIsEditing(false)
                toast.success('Profile updated successfully!')
            } else {
                toast.error(result.error || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return
        }

        setIsChangingPassword(true)
        try {
            const result = await changePassword(currentPassword, newPassword)

            if (result.success) {
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                toast.success('Password changed successfully!')
            } else {
                toast.error(result.error || 'Failed to change password')
            }
        } catch (error) {
            console.error('Error changing password:', error)
            toast.error('Failed to change password')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'PURCHASE':
                return <CreditCard className="w-4 h-4 text-emerald-600" />
            case 'USAGE':
                return <Activity className="w-4 h-4 text-orange-600" />
            default:
                return <Globe className="w-4 h-4 text-gray-600" />
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full animate-pulse mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-8"
                        >
                            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                                <CardContent className="p-8 text-center">
                                    <div className="relative inline-block mb-6">
                                        <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-2xl">
                                            <AvatarImage src={profile?.image || session?.user?.image || ""} alt={profile?.name || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-2xl font-bold">
                                                {(profile?.name || session?.user?.name)?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {
                                            profile?.role === 'ADMIN' && (
                                                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    Admin
                                                </Badge>
                                            )
                                        }
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {profile?.name || session?.user?.name}
                                    </h1>
                                    <p className="text-gray-600 mb-6">{profile?.email || session?.user?.email}</p>
                                    <div className="space-y-4 mb-8">
                                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-4 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Credits</span>
                                                <span className="text-2xl font-bold text-teal-600">{profile?.credits || 0}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Transactions</span>
                                                <span className="text-2xl font-bold text-emerald-600">{transactions.length}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Member Since</span>
                                                <span className="text-lg font-bold text-green-600">{formatDate(profile?.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {
                                                transactions.slice(0, 5).map((transaction, index) => (
                                                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            {getTransactionIcon(transaction.type)}
                                                            <div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {transaction.type === 'PURCHASE' ? 'Purchased' : 'Used'} {Math.abs(transaction.amount)} credits
                                                                </span>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatDate(transaction.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                transactions.length === 0 && (
                                                    <p className="text-sm text-gray-500 text-center py-4">No transactions yet</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm h-12 p-1 rounded-2xl">
                                    <TabsTrigger
                                        value="profile"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile Info
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="settings"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="profile" className="mt-8">
                                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="p-8">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-2xl text-gray-900">Profile Information</CardTitle>
                                                    <CardDescription className="text-base mt-2">Manage your personal information and account details</CardDescription>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="border-teal-200 hover:bg-teal-50 text-teal-600"
                                                >
                                                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                                        Full Name
                                                    </Label>
                                                    {
                                                        isEditing ? (
                                                            <Input
                                                                id="name"
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                className="rounded-xl border-teal-200 focus:border-teal-300 h-12"
                                                            />
                                                        ) : (
                                                            <div className="h-12 flex items-center px-4 bg-gray-50 rounded-xl">
                                                                <p className="text-gray-900 font-medium">{profile?.name}</p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">Email</Label>
                                                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-xl">
                                                        <p className="text-gray-900 font-medium">{profile?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">Role</Label>
                                                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-xl">
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                            {profile?.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">Email Status</Label>
                                                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-xl">
                                                        <Badge
                                                            variant="outline"
                                                            className={`${profile?.emailVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                                                        >
                                                            {profile?.emailVerified ? 'Verified' : 'Not Verified'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="language" className="text-sm font-semibold text-gray-700">
                                                        Learning Language
                                                    </Label>
                                                    {
                                                        isEditing ? (
                                                            <Select value={editLanguage} onValueChange={setEditLanguage}>
                                                                <SelectTrigger className="h-12 rounded-xl border-teal-200 focus:border-teal-300">
                                                                    <SelectValue placeholder="Select a language" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="russian">🇷🇺 Russian</SelectItem>
                                                                    <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                                                                    <SelectItem value="korean">🇰🇷 Korean</SelectItem>
                                                                    <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                                                                    <SelectItem value="french">🇫🇷 French</SelectItem>
                                                                    <SelectItem value="german">🇩🇪 German</SelectItem>
                                                                    <SelectItem value="chinese">🇨🇳 Chinese</SelectItem>
                                                                    <SelectItem value="english">🇺🇸 English</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <div className="h-12 flex items-center px-4 bg-gray-50 rounded-xl">
                                                                <p className="text-gray-900 font-medium">
                                                                    {profile?.selectedLanguage ? (
                                                                        <>
                                                                            {profile.selectedLanguage === 'russian' && '🇷🇺 Russian'}
                                                                            {profile.selectedLanguage === 'japanese' && '🇯🇵 Japanese'}
                                                                            {profile.selectedLanguage === 'korean' && '🇰🇷 Korean'}
                                                                            {profile.selectedLanguage === 'spanish' && '🇪🇸 Spanish'}
                                                                            {profile.selectedLanguage === 'french' && '🇫🇷 French'}
                                                                            {profile.selectedLanguage === 'german' && '🇩🇪 German'}
                                                                            {profile.selectedLanguage === 'chinese' && '🇨🇳 Chinese'}
                                                                            {profile.selectedLanguage === 'english' && '🇺🇸 English'}
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-gray-500">Not selected</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                isEditing && (
                                                    <div className="pt-6 border-t">
                                                        <div className="flex space-x-4">
                                                            <Button
                                                                onClick={handleSaveProfile}
                                                                disabled={isSaving}
                                                                className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg px-8"
                                                            >
                                                                <Save className="w-4 h-4 mr-2" />
                                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsEditing(false)
                                                                    setEditName(profile?.name || '')
                                                                    setEditLanguage(profile?.selectedLanguage || '')
                                                                }}
                                                                className="px-8"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="settings" className="mt-8">
                                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="p-8">
                                            <CardTitle className="text-2xl text-gray-900 flex items-center">
                                                <Lock className="w-6 h-6 mr-3" />
                                                Security Settings
                                            </CardTitle>
                                            <CardDescription className="text-base mt-2">
                                                Update your password to keep your account secure and protected
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password" className="text-sm font-semibold text-gray-700">
                                                    Current Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="current-password"
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="rounded-xl border-teal-200 focus:border-teal-300 h-12"
                                                        placeholder="Enter your current password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {
                                                            showCurrentPassword ? (
                                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                                            ) : (
                                                                <Eye className="h-4 w-4 text-gray-400" />
                                                            )
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                                                    New Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="new-password"
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="rounded-xl border-teal-200 focus:border-teal-300 h-12"
                                                        placeholder="Enter your new password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {
                                                            showNewPassword ? (
                                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                                            ) : (
                                                                <Eye className="h-4 w-4 text-gray-400" />
                                                            )
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                                                    Confirm New Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="confirm-password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="rounded-xl border-teal-200 focus:border-teal-300 h-12"
                                                        placeholder="Confirm your new password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {
                                                            showConfirmPassword ? (
                                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                                            ) : (
                                                                <Eye className="h-4 w-4 text-gray-400" />
                                                            )
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="pt-6">
                                                <Button
                                                    onClick={handleChangePassword}
                                                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                                                    className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg px-8"
                                                >
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;