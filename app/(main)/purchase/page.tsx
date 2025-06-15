'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
    Coins, ArrowLeft, Zap, Crown, Star, Check, 
    CreditCard, Shield, Globe, Sparkles
} from 'lucide-react'
import Link from 'next/link'
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
            id: 'basic',
            credits: 50,
            price: 22.5,
            originalPrice: 25,
            title: '50 Credits',
            description: 'Perfect for getting started',
            badge: null,
            features: ['Basic conversations', 'Text feedback', 'Standard support'],
            popular: false,
            savings: '10%'
        },
        {
            id: 'popular',
            credits: 100,
            price: 40,
            originalPrice: 50,
            title: '100 Credits',
            description: 'Most popular choice',
            badge: 'Most Popular',
            features: ['Extended conversations', 'Voice feedback', 'Priority support', 'Progress tracking'],
            popular: true,
            savings: '20%'
        },
        {
            id: 'value',
            credits: 500,
            price: 175,
            originalPrice: 250,
            title: '500 Credits',
            description: 'Best value for serious learners',
            badge: 'Best Value',
            features: ['Unlimited conversations', 'Advanced analytics', 'Premium support', 'Custom learning paths'],
            popular: false,
            savings: '30%'
        },
        {
            id: 'enterprise',
            credits: 1000,
            price: 300,
            originalPrice: 500,
            title: '1000 Credits',
            description: 'For power users',
            badge: 'Premium',
            features: ['Everything included', 'Personal tutor sessions', '24/7 support', 'Advanced features'],
            popular: false,
            savings: '40%'
        },
        {
            id: 'mega',
            credits: 3000,
            price: 750,
            originalPrice: 1500,
            title: '3000 Credits',
            description: 'Ultimate learning package',
            badge: 'Ultimate',
            features: ['All premium features', 'Certification support', 'Expert guidance', 'Lifetime updates'],
            popular: false,
            savings: '50%'
        }
    ]

    const handlePackageSelect = (pkg: any) => {
        setSelectedPackage(pkg)
        setShowPaymentDialog(true)
    }

    const handleCustomPurchase = () => {
        const credits = parseInt(customAmount)
        if (credits < 10) {
            toast.error('Minimum purchase is 10 credits')
            return
        }
        
        const price = credits * 0.5 // 0.5 NPR per credit
        const customPackage = {
            id: 'custom',
            credits: credits,
            price: price,
            title: `${credits} Credits`,
            description: 'Custom amount',
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
                // Simulate Khalti payment process
                // In real implementation, integrate with Khalti SDK
                setTimeout(async () => {
                    const paymentId = `khalti_${Date.now()}`
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
                                <Coins className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Buy Credits
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Buy Credits: Because Cash Can't Code (But Credits Can) 💳
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Grab some credits and unlock assessments, projects, or AI tools. No subscriptions, no nonsense—just pay for what you actually use.
                    </p>
                    <div className="flex justify-center space-x-2 mb-8">
                        <Badge className="bg-teal-100 text-teal-800">INR</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800">NPR</Badge>
                    </div>
                </motion.div>

                {/* Currency Toggle - Static for now */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-teal-200">
                        <Button variant="default" size="sm" className="bg-teal-500 text-white rounded-full">
                            NPR
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 rounded-full">
                            USD
                        </Button>
                    </div>
                </div>

                {/* Custom Amount Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl text-gray-900">Custom Credits</CardTitle>
                            <CardDescription>Pick your own adventure. Start small or go big—your wallet, your rules.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 mb-4">
                                <Input
                                    type="number"
                                    placeholder="Credits amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="rounded-xl border-teal-200 focus:border-teal-300"
                                    min="10"
                                />
                                <span className="text-sm text-gray-500">= {(parseInt(customAmount) * 0.5 || 0).toFixed(2)} NPR</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Perfect for when you just need a taste—don't worry, we won't judge your commitment issues.</p>
                            <Button 
                                onClick={handleCustomPurchase}
                                disabled={!customAmount || parseInt(customAmount) < 10}
                                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl"
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Credit Packages */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Credit Packages</h2>
                    <p className="text-gray-600 text-center mb-8">Bundles for the bold. More credits, less whining about prices.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {creditPackages.map((pkg, index) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`${pkg.popular ? 'lg:scale-105' : ''}`}
                            >
                                <Card className={`
                                    relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 
                                    ${pkg.popular ? 'bg-gradient-to-br from-teal-50 to-emerald-50 ring-2 ring-teal-200' : 'bg-white/90'} 
                                    backdrop-blur-sm group cursor-pointer
                                `}>
                                    {pkg.badge && (
                                        <div className="absolute top-4 right-4">
                                            <Badge className={`
                                                ${pkg.popular ? 'bg-teal-500 text-white' : 'bg-emerald-500 text-white'}
                                            `}>
                                                {pkg.badge}
                                            </Badge>
                                        </div>
                                    )}

                                    {pkg.savings && (
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                Save {pkg.savings}
                                            </div>
                                        </div>
                                    )}

                                    <CardHeader className="p-6">
                                        <div className="text-center">
                                            <div className={`
                                                w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                                                ${pkg.popular ? 'bg-gradient-to-br from-teal-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}
                                            `}>
                                                {pkg.id === 'basic' && <Coins className="w-8 h-8 text-white" />}
                                                {pkg.id === 'popular' && <Star className="w-8 h-8 text-white" />}
                                                {pkg.id === 'value' && <Zap className="w-8 h-8 text-white" />}
                                                {pkg.id === 'enterprise' && <Crown className="w-8 h-8 text-white" />}
                                                {pkg.id === 'mega' && <Sparkles className="w-8 h-8 text-white" />}
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                                {pkg.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 mb-4">
                                                {pkg.description}
                                            </CardDescription>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        {pkg.price.toFixed(0)} NPR
                                                    </span>
                                                    {pkg.originalPrice && (
                                                        <span className="text-lg text-gray-500 line-through">
                                                            {pkg.originalPrice} NPR
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {(pkg.price / pkg.credits).toFixed(2)} NPR per credit
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 pt-0">
                                        <div className="space-y-3 mb-6">
                                            {pkg.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center space-x-2">
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className={`
                                                w-full rounded-xl transition-all duration-300
                                                ${pkg.popular 
                                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105' 
                                                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-lg hover:scale-105'
                                                }
                                            `}
                                        >
                                            Buy Now
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
                    <p className="text-sm text-gray-500 mb-4">
                        Credits don't expire—hoard them like a dragon if you want. We dare you.
                    </p>
                    <div className="flex justify-center items-center space-x-6 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs">Secure Payment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span className="text-xs">Global Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Coins className="w-4 h-4" />
                            <span className="text-xs">No Expiry</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Complete Your Purchase</DialogTitle>
                        <DialogDescription className="text-center">
                            You're about to purchase {selectedPackage?.credits} credits for {selectedPackage?.price} NPR
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* Khalti Payment Option */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Khalti Payment</h4>
                                    <p className="text-sm text-gray-600">Secure payment with Khalti</p>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                            >
                                {isProcessing ? 'Processing...' : `Pay ${selectedPackage?.price} NPR with Khalti`}
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Credits:</span>
                                    <span>{selectedPackage?.credits}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span>{selectedPackage?.price} NPR</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{selectedPackage?.price} NPR</span>
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