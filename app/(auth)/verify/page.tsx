"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { verifyOTP, resendOTP } from "@/actions/auth.action"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"

export default function VerifyPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [timer, setTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const [code, setCode] = useState(["", "", "", "", "", ""])

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verifyEmail')
        const storedName = sessionStorage.getItem('verifyName')
        const storedPassword = sessionStorage.getItem('verifyPassword')

        if (storedEmail && storedName && storedPassword) {
            setEmail(storedEmail)
            setUserName(storedName)
            setUserPassword(storedPassword)
        } else {
            router.push('/signup')
        }
    }, [router])

    useEffect(() => {
        if (timer > 0 && !canResend) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else if (timer === 0 && !canResend) {
            setCanResend(true)
        }
    }, [timer, canResend])

    const handleInputChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < 5) {
            inputRefs[index + 1].current?.focus()
        }

        if (value && index === 5) {
            const fullCode = [...newCode]
            fullCode[index] = value
            if (fullCode.every(digit => digit !== "")) {
                handleSubmit(null, fullCode.join(""))
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()

        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("")
            setCode(digits)

            inputRefs[5].current?.focus()

            handleSubmit(null, pastedData)
        }
    }

    const handleResend = async () => {
        if (!email) return

        setCanResend(false)
        setTimer(30)

        try {
            const result = await resendOTP(email)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.error || "Failed to resend code")
                setCanResend(true)
                setTimer(0)
            }
        } catch (error) {
            console.error('Resend error:', error)
            toast.error("Failed to resend code")
            setCanResend(true)
            setTimer(0)
        }
    }

    const handleSubmit = async (e: React.FormEvent | null, otpCode?: string) => {
        if (e) e.preventDefault()

        const codeToVerify = otpCode || code.join("")

        if (codeToVerify.length !== 6) {
            toast.error("Please enter the complete 6-digit code")
            return
        }

        if (!email || !userName || !userPassword) {
            toast.error("User data not found. Please try signing up again.")
            router.push('/signup')
            return
        }

        setIsLoading(true)

        try {
            const result = await verifyOTP(email, codeToVerify)

            if (result.success) {
                setIsVerified(true)
                toast.success(result.message)

                sessionStorage.removeItem('verifyEmail')
                sessionStorage.removeItem('verifyName')
                sessionStorage.removeItem('verifyPassword')

                const signInResult = await signIn("credentials", {
                    email: email,
                    password: userPassword,
                    redirect: false,
                })

                if (signInResult?.ok) {
                    setTimeout(() => {
                        router.push("/onboarding")
                    }, 2000)
                } else {
                    toast.error("Failed to sign in automatically. Please sign in manually.")
                    setTimeout(() => {
                        router.push("/signin")
                    }, 2000)
                }
            } else {
                toast.error(result.error || "Invalid verification code")
                setCode(["", "", "", "", "", ""])
                inputRefs[0].current?.focus()
            }
        } catch (error) {
            console.error('Verification error:', error)
            toast.error("Failed to verify code")
            setCode(["", "", "", "", "", ""])
            inputRefs[0].current?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    if (isVerified) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                                Welcome to SpeakFluent!
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                Email verified successfully. Signing you in...
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                            <p className="text-sm text-teal-800">
                                Your email has been verified and you&apos;re being signed in automatically. You&apos;ll be redirected to complete your onboarding in a moment.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-500/10 to-emerald-500/10 rounded-tl-full"></div>
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0 relative">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                            Verify your email
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            We&apos;ve sent a 6-digit code to <br />
                            <span className="font-medium">{email}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center space-x-2">
                            {
                                code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-bold rounded-lg border-gray-200 focus:border-teal-300 focus:ring-teal-200"
                                        disabled={isLoading}
                                    />
                                ))
                            }
                        </div>
                        <div className="text-center space-y-4">
                            <p className="text-sm text-gray-600">
                                Didn&apos;t receive the code?
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResend}
                                disabled={!canResend || isLoading}
                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg text-sm"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${!canResend && "animate-spin"}`} />
                                {canResend ? "Resend Code" : `Resend in ${timer}s`}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg"
                            disabled={isLoading || code.join("").length !== 6}
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </Button>

                        <div className="text-center text-sm">
                            <Link href="/signup" className="flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}