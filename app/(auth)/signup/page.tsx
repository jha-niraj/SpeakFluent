"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import { signupUser } from "@/actions/auth.action"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Please enter your name")
            return false
        }
        if (!formData.email.trim()) {
            toast.error("Please enter your email")
            return false
        }
        if (!formData.password) {
            toast.error("Please enter a password")
            return false
        }
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            const result = await signupUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })

            if (result.success) {
                toast.success(result.message)
                sessionStorage.setItem('verifyEmail', formData.email)
                sessionStorage.setItem('verifyName', formData.name)
                sessionStorage.setItem('verifyPassword', formData.password)
                router.push('/verify')
            } else {
                toast.error(result.error || "Failed to create account")
            }
        } catch (error) {
            console.error('Signup error:', error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', {
                callbackUrl: '/onboarding',
                redirect: true
            })
        } catch (error) {
            console.error('Google sign in error:', error)
            toast.error("Failed to sign in with Google")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-500/10 to-emerald-500/10 rounded-tl-full"></div>
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0 relative">
                <CardHeader className="space-y-2">
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Start your language learning journey with SpeakFluent
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-lg border-gray-200 hover:bg-gray-50"
                            onClick={handleGoogleSignIn}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                                    required
                                    disabled={isSubmitting}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {
                                        showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )
                                    }
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                                    required
                                    disabled={isSubmitting}
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
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                                    At least 8 characters long
                                </li>
                                <li className={formData.password !== formData.confirmPassword && formData.confirmPassword ? "text-red-600" : formData.confirmPassword && formData.password === formData.confirmPassword ? "text-green-600" : ""}>
                                    Both passwords must match
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </Button>
                        <div className="text-center text-sm">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link href="/signin" className="font-medium text-teal-600 hover:text-teal-700 underline">
                                Sign in
                            </Link>
                        </div>
                        <div className="text-center text-xs text-gray-500">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="underline hover:text-gray-700">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="underline hover:text-gray-700">
                                Privacy Policy
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}