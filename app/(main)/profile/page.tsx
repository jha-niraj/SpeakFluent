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
    User, Settings, Calendar, Mail, Globe, Crown, 
    ArrowLeft, Edit3, Save, X, Lock, Eye, EyeOff,
    Shield, Clock, CreditCard, Activity
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { getUserProfile, updateProfile, changePassword } from '@/actions/profile.action'
import { getCreditTransactions } from '@/actions/credits.action'
import { toast } from 'sonner'

const ProfilePage = () => {
    const { data: session, update } = useSession()
    const [activeTab, setActiveTab] = useState('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Profile editing states
    const [editName, setEditName] = useState('')
    const [isSaving, setSaving] = useState(false)

    // Password change states
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
            const result = await updateProfile({ name: editName })
            
            if (result.success) {
                setProfile({ ...profile, name: editName })
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
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal-600">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Profile
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="relative inline-block">
                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                            <AvatarImage src={profile?.image || session?.user?.image || ""} alt={profile?.name || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-2xl font-bold">
                                {(profile?.name || session?.user?.name)?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {profile?.role === 'ADMIN' && (
                            <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Admin
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {profile?.name || session?.user?.name}
                    </h1>
                    <p className="text-gray-600 mb-4">{profile?.email || session?.user?.email}</p>
                    <div className="flex justify-center space-x-4">
                        <div className="bg-teal-50 px-4 py-2 rounded-full">
                            <span className="text-sm font-medium text-teal-700">
                                {profile?.credits || 0} Credits
                            </span>
                        </div>
                        <div className="bg-emerald-50 px-4 py-2 rounded-full">
                            <span className="text-sm font-medium text-emerald-700">
                                Member since {formatDate(profile?.createdAt)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                                <User className="w-4 h-4 mr-2" />
                                Profile Info
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Profile Information */}
                                <div className="lg:col-span-2">
                                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-xl text-gray-900">Profile Information</CardTitle>
                                                    <CardDescription>Manage your personal information</CardDescription>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="border-teal-200 hover:bg-teal-50"
                                                >
                                                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                        Full Name
                                                    </Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="name"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="mt-1 rounded-lg border-teal-200 focus:border-teal-300"
                                                        />
                                                    ) : (
                                                        <p className="mt-1 text-gray-900">{profile?.name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                                    <p className="mt-1 text-gray-900">{profile?.email}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                                                    <p className="mt-1">
                                                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                                                            {profile?.role}
                                                        </Badge>
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700">Email Verified</Label>
                                                    <p className="mt-1">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`${profile?.emailVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                                                        >
                                                            {profile?.emailVerified ? 'Verified' : 'Not Verified'}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {isEditing && (
                                                <div className="pt-4 border-t">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            onClick={handleSaveProfile}
                                                            disabled={isSaving}
                                                            className="bg-teal-500 hover:bg-teal-600 text-white"
                                                        >
                                                            <Save className="w-4 h-4 mr-2" />
                                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setIsEditing(false)
                                                                setEditName(profile?.name || '')
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-0 shadow-lg">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-gray-900">Account Stats</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Credits</span>
                                                <span className="font-semibold text-teal-700">{profile?.credits || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Transactions</span>
                                                <span className="font-semibold text-emerald-700">{transactions.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Member Since</span>
                                                <span className="font-semibold text-gray-700">{formatDate(profile?.createdAt)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {transactions.slice(0, 3).map((transaction, index) => (
                                                <div key={transaction.id} className="flex items-center justify-between py-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getTransactionIcon(transaction.type)}
                                                        <span className="text-sm text-gray-600">
                                                            {transaction.type === 'PURCHASE' ? 'Purchased' : 'Used'} {Math.abs(transaction.amount)} credits
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(transaction.createdAt)}
                                                    </span>
                                                </div>
                                            ))}
                                            {transactions.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center py-4">No transactions yet</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="mt-6">
                            <div className="max-w-2xl mx-auto">
                                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-gray-900 flex items-center">
                                            <Lock className="w-5 h-5 mr-2" />
                                            Change Password
                                        </CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                                                Current Password
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="current-password"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="rounded-lg border-teal-200 focus:border-teal-300 pr-10"
                                                    placeholder="Enter your current password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                                                New Password
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="new-password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="rounded-lg border-teal-200 focus:border-teal-300 pr-10"
                                                    placeholder="Enter your new password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                                                Confirm New Password
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="confirm-password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="rounded-lg border-teal-200 focus:border-teal-300 pr-10"
                                                    placeholder="Confirm your new password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={handleChangePassword}
                                                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                            >
                                                <Shield className="w-4 h-4 mr-2" />
                                                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                                            </Button>
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>• Password must be at least 8 characters long</p>
                                            <p>• Use a combination of letters, numbers, and special characters</p>
                                            <p>• Don't use easily guessable information</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    )
}

export default ProfilePage