'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
    Coins, Zap, Crown, Star, Check, 
    CreditCard, Shield, Globe, Sparkles, MessageCircle, Mic
} from 'lucide-react'
import { motion } from 'framer-motion'
import { createCreditPurchase, completeCreditPurchase } from '@/actions/credits.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const BuyCredits = () => {
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const [customAmount, setCustomAmount] = useState('')
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    const creditPackages = [
        {
            id: 'starter',
            credits: 100,
            price: 9.99,
            originalPrice: 14.99,
            title: '100 Credits',
            description: 'Perfect for beginners',
            badge: null,
            features: [
                '10 Conversation Sessions',
                'Basic Voice Training',
                'Progress Tracking',
                'Email Support'
            ],
            popular: false,
            savings: '33%',
            sessions: '10 sessions'
        },
        {
            id: 'popular',
            credits: 300,
            price: 24.99,
            originalPrice: 44.99,
            title: '300 Credits',
            description: 'Most popular choice',
            badge: 'Most Popular',
            features: [
                '30 Conversation Sessions',
                'Advanced Voice Analysis',
                'Personalized Feedback',
                'Priority Support',
                'Progress Analytics'
            ],
            popular: true,
            savings: '44%',
            sessions: '30 sessions'
        },
        {
            id: 'pro',
            credits: 600,
            price: 44.99,
            originalPrice: 89.99,
            title: '600 Credits',
            description: 'For serious learners',
            badge: 'Best Value',
            features: [
                '60 Conversation Sessions',
                'Premium Voice Coaching',
                'Detailed Analytics',
                'Custom Learning Path',
                '24/7 Chat Support'
            ],
            popular: false,
            savings: '50%',
            sessions: '60 sessions'
        },
        {
            id: 'unlimited',
            credits: 1500,
            price: 99.99,
            originalPrice: 224.99,
            title: '1500 Credits',
            description: 'Ultimate learning package',
            badge: 'Premium',
            features: [
                '150 Conversation Sessions',
                'AI Tutor Access',
                'Advanced Scenarios',
                'Certification Support',
                'Personal Learning Coach'
            ],
            popular: false,
            savings: '56%',
            sessions: '150 sessions'
        }
    ]

    const handlePackageSelect = (pkg: any) => {
        setSelectedPackage(pkg)
        setShowPaymentDialog(true)
    }

    const handleCustomPurchase = () => {
        const credits = parseInt(customAmount)
        if (credits < 50) {
            toast.error('Minimum purchase is 50 credits')
            return
        }
        
        const price = credits * 0.15 // $0.15 per credit
        const sessions = Math.floor(credits / 10)
        const customPackage = {
            id: 'custom',
            credits: credits,
            price: price,
            title: `${credits} Credits`,
            description: 'Custom amount',
            sessions: `${sessions} sessions`,
            custom: true
        }
        
        setSelectedPackage(customPackage)
        setShowPaymentDialog(true)
    }

    const handlePayment = async () => {
        if (!selectedPackage) return

        setIsProcessing(true)
        try {
            const result = await createCreditPurchase(selectedPackage.credits, selectedPackage.price)
            
            if (result.success) {
                // Simulate payment process
                setTimeout(async () => {
                    const paymentId = `payment_${Date.now()}`
                    const completeResult = await completeCreditPurchase(result.transactionId!, paymentId)
                    
                    if (completeResult.success) {
                        toast.success('Credits purchased successfully! 🎉')
                        setShowPaymentDialog(false)
                        router.push('/dashboard')
                    } else {
                        toast.error(completeResult.error || 'Payment failed')
                    }
                    setIsProcessing(false)
                }, 2000)
            } else {
                toast.error(result.error || 'Failed to create purchase')
                setIsProcessing(false)
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.error('Payment failed')
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Fuel Your Language Learning Journey 🚀
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Purchase credits to unlock AI-powered conversations, personalized feedback, and premium features. Each conversation session costs only 10 credits!
                    </p>
                    <div className="flex justify-center items-center space-x-6 mb-12">
                        <div className="flex items-center space-x-3 bg-white/70 rounded-2xl px-6 py-3 shadow-lg">
                            <MessageCircle className="w-5 h-5 text-teal-600" />
                            <span className="text-base font-semibold">10 Credits = 1 Session</span>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/70 rounded-2xl px-6 py-3 shadow-lg">
                            <Mic className="w-5 h-5 text-emerald-600" />
                            <span className="text-base font-semibold">AI Voice Training</span>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/70 rounded-2xl px-6 py-3 shadow-lg">
                            <Globe className="w-5 h-5 text-green-600" />
                            <span className="text-base font-semibold">100+ Languages</span>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="text-center p-8">
                            <CardTitle className="text-2xl text-gray-900">Custom Credits</CardTitle>
                            <CardDescription className="text-base">Choose your perfect learning amount</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        placeholder="Enter credits (min 50)"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="rounded-2xl border-indigo-200 focus:border-indigo-300 h-12"
                                        min="50"
                                    />
                                </div>
                                {customAmount && parseInt(customAmount) >= 50 && (
                                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Credits:</span>
                                            <span className="font-semibold">{customAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Sessions:</span>
                                            <span className="font-semibold">{Math.floor(parseInt(customAmount) / 10)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold text-teal-700">
                                            <span>Total:</span>
                                            <span>${(parseInt(customAmount) * 0.15).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                                <Button 
                                    onClick={handleCustomPurchase}
                                    disabled={!customAmount || parseInt(customAmount) < 50}
                                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl h-12 text-base font-semibold"
                                >
                                    Purchase Custom Credits
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Learning Packages</h2>
                    <p className="text-xl text-gray-600 text-center mb-12">Choose the perfect package for your language learning goals</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {creditPackages.map((pkg, index) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`${pkg.popular ? 'lg:scale-105' : ''}`}
                            >
                                <Card className={`
                                    relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 
                                    ${pkg.popular ? 'bg-gradient-to-br from-teal-50 to-emerald-50 ring-2 ring-teal-200' : 'bg-white/90'} 
                                    backdrop-blur-sm group cursor-pointer h-full hover:scale-105
                                `}>
                                    {/* Badges positioned at top corners */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                                        {pkg.savings && (
                                            <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                                Save {pkg.savings}
                                            </div>
                                        )}
                                        {pkg.badge && (
                                            <Badge className={`
                                                ${pkg.popular ? 'bg-teal-500 text-white' : 'bg-emerald-500 text-white'}
                                            `}>
                                                {pkg.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    <CardHeader className="p-8 pt-16">
                                        <div className="text-center">
                                            <div className={`
                                                w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center
                                                ${pkg.popular ? 'bg-gradient-to-br from-teal-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}
                                            `}>
                                                {pkg.id === 'starter' && <Coins className="w-10 h-10 text-white" />}
                                                {pkg.id === 'popular' && <Star className="w-10 h-10 text-white" />}
                                                {pkg.id === 'pro' && <Zap className="w-10 h-10 text-white" />}
                                                {pkg.id === 'unlimited' && <Crown className="w-10 h-10 text-white" />}
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                                                {pkg.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 mb-6 text-base">
                                                {pkg.description}
                                            </CardDescription>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        ${pkg.price}
                                                    </span>
                                                    {pkg.originalPrice && (
                                                        <span className="text-xl text-gray-500 line-through">
                                                            ${pkg.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-base text-teal-600 font-semibold">
                                                    {pkg.sessions}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-8 pt-0">
                                        <div className="space-y-4 mb-8">
                                            {pkg.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center space-x-3">
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className={`
                                                w-full rounded-2xl transition-all duration-300 h-12 text-base font-semibold
                                                ${pkg.popular 
                                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105' 
                                                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-lg hover:scale-105'
                                                }
                                            `}
                                        >
                                            Get Started
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <p className="text-base text-gray-500 mb-6">
                        Your credits never expire - learn at your own pace
                    </p>
                    <div className="flex justify-center items-center space-x-8 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Globe className="w-5 h-5" />
                            <span className="text-sm font-medium">24/7 Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Coins className="w-5 h-5" />
                            <span className="text-sm font-medium">No Expiry</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-medium">AI Powered</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Complete Your Purchase</DialogTitle>
                        <DialogDescription className="text-center">
                            You&apos;re about to purchase {selectedPackage?.credits} credits for ${selectedPackage?.price}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        {/* Payment Option */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">Secure Payment</h4>
                                    <p className="text-sm text-gray-600">Global payment gateway</p>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl h-12 text-base font-semibold"
                            >
                                {isProcessing ? 'Processing...' : `Pay $${selectedPackage?.price} Securely`}
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h4>
                            <div className="space-y-3 text-base">
                                <div className="flex justify-between">
                                    <span>Credits:</span>
                                    <span className="font-semibold">{selectedPackage?.credits}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sessions:</span>
                                    <span className="font-semibold">{selectedPackage?.sessions || Math.floor(selectedPackage?.credits / 10) + ' sessions'}</span>
                                </div>
                                <div className="flex justify-between font-bold pt-3 border-t text-lg">
                                    <span>Total:</span>
                                    <span>${selectedPackage?.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BuyCredits 