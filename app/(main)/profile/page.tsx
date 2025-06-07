"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Mail, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Camera, Shield, Bell, Globe, Trash2, Download } from "lucide-react";
import { useState } from "react";

const Profile = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Settings states
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);
    const [marketingEmails, setMarketingEmails] = useState(false);

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            alert("Password updated successfully!");
        }, 2000);
    };

    const handleExportData = () => {
        alert("Your data export will be sent to your email within 24 hours.");
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion initiated. You'll receive a confirmation email.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-100">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">My Profile</h1>
                        <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                            <CardHeader className="text-center pb-6">
                                <div className="relative mx-auto">
                                    <Avatar className="w-28 h-28 mx-auto mb-6 ring-4 ring-teal-100">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-600 text-white text-3xl">
                                            JS
                                        </AvatarFallback>
                                    </Avatar>
                                    <button className="absolute bottom-6 right-1/2 transform translate-x-1/2 translate-y-3 w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:scale-110">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-800">John Smith</CardTitle>
                                <CardDescription className="text-gray-600 text-lg">Nepali Language Learner</CardDescription>
                                <div className="flex justify-center space-x-2 mt-4">
                                    <Badge className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-0">Russian</Badge>
                                    <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0">Japanese</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                                    <TabsList className="grid w-full grid-rows-2 h-auto bg-gradient-to-r from-gray-50 to-teal-50 border border-teal-100">
                                        <TabsTrigger
                                            value="profile"
                                            className="w-full justify-start space-x-3 py-4 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-md transition-all duration-300"
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="font-medium">Profile Info</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="settings"
                                            className="w-full justify-start space-x-3 py-4 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-md transition-all duration-300"
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span className="font-medium">Settings</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                            <TabsContent value="profile" className="mt-0">
                                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                                        <CardTitle className="text-3xl font-bold text-gray-800">Profile Information</CardTitle>
                                        <CardDescription className="text-lg text-gray-600">
                                            Manage your personal information and learning preferences
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-8 p-8">
                                        {/* Personal Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                    <Input
                                                        id="firstName"
                                                        defaultValue="John"
                                                        className="pl-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    defaultValue="Smith"
                                                    className="py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    defaultValue="john.smith@example.com"
                                                    className="pl-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    defaultValue="+977 98xxxxxxxx"
                                                    className="pl-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                    <Input
                                                        id="location"
                                                        defaultValue="Kathmandu, Nepal"
                                                        className="pl-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700">Date of Birth</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                    <Input
                                                        id="birthDate"
                                                        type="date"
                                                        defaultValue="1998-05-15"
                                                        className="pl-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Learning Statistics */}
                                        <div className="border-t border-gray-200 pt-8">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Learning Statistics</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl border border-teal-100">
                                                    <div className="text-3xl font-bold text-teal-700">247</div>
                                                    <div className="text-sm text-teal-600 font-medium">Credits Earned</div>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-100">
                                                    <div className="text-3xl font-bold text-blue-700">15</div>
                                                    <div className="text-sm text-blue-600 font-medium">Days Streak</div>
                                                </div>
                                                <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-100">
                                                    <div className="text-3xl font-bold text-purple-700">85%</div>
                                                    <div className="text-sm text-purple-600 font-medium">Avg Score</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                                            <Button variant="outline" className="px-8 py-3 border-gray-300">
                                                Cancel
                                            </Button>
                                            <Button className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0">
                                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                                        <CardTitle className="text-3xl font-bold text-gray-800">Account Settings</CardTitle>
                                        <CardDescription className="text-lg text-gray-600">
                                            Manage your account security and preferences
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-10 p-8">
                                        {/* Password Reset Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Shield className="w-6 h-6 text-teal-600" />
                                                <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
                                            </div>

                                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl space-y-4 max-w-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">Current Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                        <Input
                                                            id="currentPassword"
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            placeholder="Enter current password"
                                                            className="pl-12 pr-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">New Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                        <Input
                                                            id="newPassword"
                                                            type={showNewPassword ? "text" : "password"}
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="Enter new password"
                                                            className="pl-12 pr-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmNewPassword" className="text-sm font-semibold text-gray-700">Confirm New Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                                        <Input
                                                            id="confirmNewPassword"
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder="Confirm new password"
                                                            className="pl-12 pr-12 py-4 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handlePasswordReset}
                                                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 py-4 disabled:opacity-50"
                                                >
                                                    {isLoading ? "Updating..." : "Update Password"}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Notification Preferences */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Bell className="w-6 h-6 text-teal-600" />
                                                <h3 className="text-xl font-bold text-gray-800">Notification Preferences</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                                                        <p className="text-sm text-gray-600">Receive learning reminders and updates via email</p>
                                                    </div>
                                                    <Switch
                                                        checked={emailNotifications}
                                                        onCheckedChange={setEmailNotifications}
                                                        className="data-[state=checked]:bg-teal-600"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                                                        <p className="text-sm text-gray-600">Get notified about new challenges and achievements</p>
                                                    </div>
                                                    <Switch
                                                        checked={pushNotifications}
                                                        onCheckedChange={setPushNotifications}
                                                        className="data-[state=checked]:bg-teal-600"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Weekly Progress Report</h4>
                                                        <p className="text-sm text-gray-600">Receive weekly summaries of your learning progress</p>
                                                    </div>
                                                    <Switch
                                                        checked={weeklyReport}
                                                        onCheckedChange={setWeeklyReport}
                                                        className="data-[state=checked]:bg-teal-600"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Marketing Emails</h4>
                                                        <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                                                    </div>
                                                    <Switch
                                                        checked={marketingEmails}
                                                        onCheckedChange={setMarketingEmails}
                                                        className="data-[state=checked]:bg-teal-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Language & Region */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Globe className="w-6 h-6 text-teal-600" />
                                                <h3 className="text-xl font-bold text-gray-800">Language & Region</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">Interface Language</Label>
                                                    <select className="w-full py-4 px-4 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-teal-500 bg-white">
                                                        <option>English</option>
                                                        <option>नेपाली (Nepali)</option>
                                                        <option>हिन्दी (Hindi)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">Time Zone</Label>
                                                    <select className="w-full py-4 px-4 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-teal-500 bg-white">
                                                        <option>Asia/Kathmandu (NPT)</option>
                                                        <option>Asia/Tokyo (JST)</option>
                                                        <option>Europe/Moscow (MSK)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Data & Privacy */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Download className="w-6 h-6 text-teal-600" />
                                                <h3 className="text-xl font-bold text-gray-800">Data & Privacy</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <Button
                                                    onClick={handleExportData}
                                                    variant="outline"
                                                    className="w-full md:w-auto px-6 py-3 border-teal-200 text-teal-700 hover:bg-teal-50"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Export My Data
                                                </Button>
                                                <p className="text-sm text-gray-600">Download a copy of your personal data and learning progress</p>
                                            </div>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Trash2 className="w-6 h-6 text-red-600" />
                                                <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                                            </div>

                                            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                                                <p className="text-sm text-red-600 mb-4">
                                                    Once you delete your account, there is no going back. Please be certain.
                                                </p>
                                                <Button
                                                    onClick={handleDeleteAccount}
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Account
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;