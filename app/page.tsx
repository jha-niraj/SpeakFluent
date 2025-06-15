"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	ArrowRight, Star, Globe, Mic, BookOpen, Trophy, Zap,
	Target, Award, Lightbulb, Rocket, Shield, Heart, Check,
	Link
} from "lucide-react"
import { motion } from "framer-motion"
import LandingNavbar from "@/components/(landingpage)/landingnavbar"
import SmoothScroll from "@/components/smoothscroll"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const MainPage = () => {
	const router = useRouter();
	const { status } = useSession();

	return (
		<SmoothScroll>
			<section className="w-full min-h-screen">
				<LandingNavbar />
				<section className="w-full relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-8">
					<div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-br-full"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-500/20 to-emerald-500/20 rounded-tl-full"></div>
					<section className="max-w-7xl mx-auto">
						<div className="absolute inset-0">
							<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
							<div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="absolute top-32 left-20 animate-bounce delay-300"
						>
							<div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
								<Mic className="w-7 h-7 text-white" />
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="absolute top-48 right-32 animate-bounce delay-700"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
								<BookOpen className="w-6 h-6 text-white" />
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="absolute bottom-32 left-32 animate-bounce delay-1000"
						>
							<div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
								<Trophy className="w-5 h-5 text-white" />
							</div>
						</motion.div>
						<div className="max-w-7xl mx-auto px-6 text-center relative z-10">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="w-full mx-auto"
							>
								<div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-1.5 mb-2 shadow-lg border border-teal-100">
									<Star className="w-4 h-4 text-teal-600" />
									<span className="text-sm font-medium text-teal-700">Trusted by 10,000+ Nepali Students</span>
								</div>
								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.2 }}
									className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
								>
									<span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
										Master Languages
									</span>
									<br />
									<span className="text-gray-800">Like a Native</span>
								</motion.h1>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.3 }}
									className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed"
								>
									AI-powered conversations for Nepali students.
									<span className="text-teal-600 font-semibold"> No boring classes, no subscriptions</span> – just
									results.
								</motion.p>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.4 }}
									className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
								>
									{
										status === "authenticated" && (
											<Button
												size="lg"
												onClick={() => router.push("/dashboard")}
												className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-5 text-base font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
											>
												Start Learning Free
												<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
											</Button>
										)
									}
									<Button
										size="lg"
										onClick={() => router.push("/signin")}
										className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-5 text-base font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
									>
										Start Learning Free
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</Button>
									{/* <Button
										variant="outline"
										size="lg"
										className="border-2 border-teal-200 text-teal-700 hover:bg-teal-50 px-6 py-5 text-base font-semibold rounded-xl group"
									>
										<Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
										Watch Demo
									</Button> */}
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.5 }}
									className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
								>
									<div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-teal-100">
										<div className="text-2xl font-bold text-teal-600 mb-1">10K+</div>
										<div className="text-gray-700 font-medium text-sm">Students Learning</div>
									</div>
									<div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-teal-100">
										<div className="text-2xl font-bold text-teal-600 mb-1">95%</div>
										<div className="text-gray-700 font-medium text-sm">Success Rate</div>
									</div>
									<div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-teal-100">
										<div className="text-2xl font-bold text-teal-600 mb-1">₹200</div>
										<div className="text-gray-700 font-medium text-sm">Starting Price</div>
									</div>
								</motion.div>
							</motion.div>
						</div>
						<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
							<div className="w-6 h-10 border-2 border-teal-400 rounded-full flex justify-center">
								<div className="w-1 h-3 bg-teal-400 rounded-full mt-2 animate-pulse"></div>
							</div>
						</div>
					</section>
				</section>
				<section className="w-full py-16" id="features">
					<section className="max-w-7xl mx-auto">
						<div className="absolute inset-0">
							<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
							<div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
						</div>
						<div className="max-w-7xl mx-auto px-6">
							<div className="text-center mb-16">
								<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-5 py-1.5 mb-5">
									<Zap className="w-4 h-4 text-teal-600" />
									<span className="text-teal-700 font-semibold text-sm">Why Choose Us</span>
								</div>
								<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
									Experience the
									<span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
										{" "}
										Future
									</span>
								</h2>
								<p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
									Revolutionary AI-powered language learning that adapts to your pace, corrects your pronunciation
									instantly, and prepares you for real-world conversations.
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{
									[
										{
											title: "AI-Powered Conversations",
											description:
												"Advanced AI tutors powered by ElevenLabs provide natural conversations with real-time pronunciation feedback and cultural context.",
											icon: "🤖",
											gradient: "from-teal-500 to-emerald-600",
											bgGradient: "from-teal-50 to-emerald-50",
											benefits: ["Natural speech recognition", "Instant feedback", "Cultural context"],
										},
										{
											title: "Cultural Immersion",
											description:
												"Learn authentic expressions, social customs, and cultural nuances that textbooks miss. Prepare for real-world interactions.",
											icon: "🌏",
											gradient: "from-teal-500 to-emerald-600",
											bgGradient: "from-teal-50 to-emerald-50",
											benefits: ["Real-world scenarios", "Cultural nuances", "Social customs"],
										},
										{
											title: "Flexible Credit System",
											description:
												"No subscriptions, no commitments. Pay only for what you use with our transparent credit system via Khalti or eSewa.",
											icon: "💳",
											gradient: "from-teal-500 to-emerald-600",
											bgGradient: "from-teal-50 to-emerald-50",
											benefits: ["Pay as you go", "No subscriptions", "Earn credits back"],
										},
									].map((feature, index) => (
										<Card
											key={index}
											className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.bgGradient}`}
										>
											<div
												className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
											></div>
											<CardContent className="relative p-6">
												<div className="text-center mb-4">
													<div
														className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
													>
														{feature.icon}
													</div>
													<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors">
														{feature.title}
													</h3>
													<p className="text-gray-600 leading-relaxed text-sm mb-6">{feature.description}</p>
												</div>
												<div className="space-y-2 mt-4">
													{
														feature.benefits.map((benefit, i) => (
															<div key={i} className="flex items-center text-sm">
																<div className="mr-2 h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center">
																	<Check className="h-3 w-3 text-teal-600" />
																</div>
																<span className="text-gray-700">{benefit}</span>
															</div>
														))
													}
												</div>
											</CardContent>
										</Card>
									))
								}
							</div>
						</div>
					</section>
				</section>
				<section className="py-16">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-5 py-1.5 mb-5">
								<Lightbulb className="w-4 h-4 text-teal-600" />
								<span className="text-teal-700 font-semibold text-sm">Powerful Features</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
								Learn Like Never
								<span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
									{" "}
									Before
								</span>
							</h2>
							<p className="text-base text-gray-600 max-w-3xl mx-auto">
								Our cutting-edge features make language learning engaging, effective, and enjoyable.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{
								[
									{
										name: "VoiceVoyage",
										description:
											"Immersive AI conversations starting with Nepali greetings, then diving deep into your target language with real-time feedback.",
										icon: "🗣️",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Voice recognition", "Accent training", "Vocabulary building"],
									},
									{
										name: "StorySpeak",
										description:
											"Real-life scenarios with rich visuals and interactive dialogues. Practice ordering food in Moscow or shopping in Tokyo.",
										icon: "📖",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Interactive scenarios", "Cultural contexts", "Practical vocabulary"],
									},
									{
										name: "ChatQuest",
										description:
											"Free-form conversations with AI companions who remember your progress and adapt to your interests and learning style.",
										icon: "💬",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Adaptive learning", "Personalized topics", "Progress tracking"],
									},
									{
										name: "PhraseForge",
										description:
											"Master daily expressions through interactive games, pronunciation challenges, and cultural context lessons.",
										icon: "🔨",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Common phrases", "Pronunciation drills", "Usage examples"],
									},
									{
										name: "Cultural Simulator",
										description:
											"Experience authentic cultural scenarios without leaving Nepal. Practice etiquette, customs, and social interactions.",
										icon: "🎭",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Social etiquette", "Cultural norms", "Situational practice"],
									},
									{
										name: "Progress Analytics",
										description:
											"Detailed insights into your learning journey with personalized recommendations and achievement tracking.",
										icon: "📊",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
										features: ["Performance metrics", "Skill assessment", "Learning recommendations"],
									},
								].map((feature, index) => (
									<Card
										key={index}
										className={`group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.bgColor}`}
									>
										<div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${feature.color}`}></div>
										<CardContent className="p-6 relative">
											<div className="flex items-start gap-4">
												<div
													className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0`}
												>
													{feature.icon}
												</div>
												<div>
													<h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
														{feature.name}
													</h3>
													<p className="text-gray-600 leading-relaxed text-sm mb-4">{feature.description}</p>
												</div>
											</div>
											<div className="mt-4 pt-4 border-t border-teal-100/50">
												<ul className="space-y-1">
													{
														feature.features.map((item, i) => (
															<li key={i} className="flex items-center text-xs">
																<div className="mr-2 h-4 w-4 rounded-full bg-teal-100 flex items-center justify-center">
																	<Check className="h-2.5 w-2.5 text-teal-600" />
																</div>
																<span className="text-gray-700">{item}</span>
															</li>
														))
													}
												</ul>
											</div>
										</CardContent>
									</Card>
								))
							}
						</div>
					</div>
				</section>
				<section className="py-16" id="challenges">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-5 py-1.5 mb-5">
								<Target className="w-4 h-4 text-teal-600" />
								<span className="text-teal-700 font-semibold text-sm">Challenges</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
								Prove Your
								<span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
									{" "}
									Skills
								</span>
							</h2>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-102 bg-gradient-to-br from-white to-teal-50">
								<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
								<CardContent className="p-8 relative">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
										🏆
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors">
										FluencyForge Challenge
									</h3>
									<p className="text-gray-600 leading-relaxed mb-6 text-sm">
										Weekly competitions where you showcase your language skills through storytelling, debates, and
										roleplay. Compete with peers, earn credits, and climb our global leaderboard.
									</p>
									<div className="flex flex-wrap gap-2">
										<Badge className="bg-teal-100 text-teal-800 px-3 py-1 text-xs">Weekly Competitions</Badge>
										<Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-xs">Global Leaderboard</Badge>
										<Badge className="bg-teal-100 text-teal-800 px-3 py-1 text-xs">Skill Badges</Badge>
									</div>
								</CardContent>
							</Card>
							<Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-102 bg-gradient-to-br from-white to-emerald-50">
								<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
								<CardContent className="p-8 relative">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
										💬
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors">
										PeerSync Exchange
									</h3>
									<p className="text-gray-600 leading-relaxed mb-6 text-sm">
										Connect with native speakers for live language exchange sessions. Teach Nepali while learning Russian
										or Japanese in authentic, meaningful conversations.
									</p>
									<div className="flex flex-wrap gap-2">
										<Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-xs">Live Conversations</Badge>
										<Badge className="bg-teal-100 text-teal-800 px-3 py-1 text-xs">Native Speakers</Badge>
										<Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-xs">Cultural Exchange</Badge>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="py-16" id="how-it-works">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-5 py-1.5 mb-5">
								<Rocket className="w-4 h-4 text-teal-600" />
								<span className="text-teal-700 font-semibold text-sm">How It Works</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
								Your Journey to
								<span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
									{" "}
									Fluency
								</span>
							</h2>
							<p className="text-base text-gray-600">Five simple steps to language mastery</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
							{
								[
									{
										step: "1",
										title: "Top Up Credits",
										description:
											"Add credits to your wallet via Khalti or eSewa. No subscriptions, just flexible pay-as-you-learn.",
										icon: "💳",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
									},
									{
										step: "2",
										title: "Choose Language",
										description:
											"Select Russian, Japanese, or English and start with our adaptive assessment to personalize your experience.",
										icon: "🌍",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
									},
									{
										step: "3",
										title: "Start Learning",
										description:
											"Engage in AI conversations, complete interactive lessons, and receive instant pronunciation feedback.",
										icon: "🎤",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
									},
									{
										step: "4",
										title: "Earn Rewards",
										description:
											"Score above 80% to earn credits back, unlock achievements, and climb our global leaderboard.",
										icon: "🏆",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
									},
									{
										step: "5",
										title: "Master Fluency",
										description:
											"Practice real-world scenarios and cultural immersion to become conversation-ready in months, not years.",
										icon: "✨",
										color: "from-teal-500 to-emerald-500",
										bgColor: "from-teal-50 to-emerald-50",
									},
								].map((step, index) => (
									<Card
										key={index}
										className={`group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-500 hover:scale-105 bg-gradient-to-br ${step.bgColor}`}
									>
										<div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${step.color}`}></div>
										<CardContent className="p-6 relative text-center">
											<div
												className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white text-sm font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
											>
												{step.step}
											</div>
											<div className="text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
												{step.icon}
											</div>
											<h3 className="text-base font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">
												{step.title}
											</h3>
											<p className="text-gray-600 leading-relaxed text-xs">{step.description}</p>
										</CardContent>
									</Card>
								))
							}
						</div>
					</div>
				</section>
				<section className="py-16" id="pricing">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-5 py-1.5 mb-5">
								<Heart className="w-4 h-4 text-teal-600" />
								<span className="text-teal-700 font-semibold text-sm">Fair Pricing</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
								Affordable for
								<span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
									{" "}
									Everyone
								</span>
							</h2>
							<p className="text-base text-gray-600 max-w-3xl mx-auto">
								No expensive subscriptions or hidden fees. Pay only for what you use with our transparent credit system.
							</p>
						</div>
						<Card className="shadow-xl border-0 bg-gradient-to-br from-white to-teal-50 max-w-4xl mx-auto">
							<CardContent className="p-8">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10">
									<div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
										<h3 className="text-lg font-bold text-gray-800 mb-3">VoiceVoyage</h3>
										<div className="text-3xl font-bold text-teal-600 mb-2">50</div>
										<div className="text-gray-600 font-medium text-sm">credits per session</div>
									</div>
									<div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
										<h3 className="text-lg font-bold text-gray-800 mb-3">StorySpeak/PhraseForge</h3>
										<div className="text-3xl font-bold text-teal-600 mb-2">20</div>
										<div className="text-gray-600 font-medium text-sm">credits per unit</div>
									</div>
									<div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
										<h3 className="text-lg font-bold text-gray-800 mb-3">ChatQuest</h3>
										<div className="text-3xl font-bold text-teal-600 mb-2">10</div>
										<div className="text-gray-600 font-medium text-sm">credits per chat</div>
									</div>
								</div>
								<div className="border-t border-gray-200 pt-8 text-center">
									<div className="inline-flex items-center space-x-2 bg-emerald-100 rounded-full px-5 py-1.5 mb-4">
										<Award className="w-4 h-4 text-emerald-600" />
										<span className="text-emerald-700 font-semibold text-sm">Earn Credits Back</span>
									</div>
									<h4 className="text-xl font-bold text-gray-800 mb-4">Score 80%+ and get rewarded!</h4>
									<p className="text-gray-600 mb-6 text-sm">
										Excellence pays. Literally. Get back 10-50 credits for outstanding performance.
									</p>
									<div className="flex flex-wrap justify-center gap-4 mb-8">
										<Badge className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-medium">200 NPR Starter</Badge>
										<Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium">
											500 NPR Popular
										</Badge>
										<Badge className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-medium">1,000 NPR Pro</Badge>
									</div>
									<Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-2 text-sm font-semibold rounded-xl shadow-lg">
										Top Up Credits Now
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>
				<section className="py-20 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-500 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-64 h-64 bg-teal-400/20 rounded-br-full"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-tl-full"></div>
					<div className="absolute inset-0 opacity-10">
						<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
							<polygon points="0,100 30,40 60,60 100,20 100,100" fill="white" />
						</svg>
					</div>
					<div className="max-w-7xl mx-auto px-6 text-center relative z-10">
						<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-1.5 mb-6">
							<Shield className="w-4 h-4 text-white" />
							<span className="text-white font-semibold text-sm">Join 10,000+ Students</span>
						</div>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
							Ready to Sound Like a<span className="block">Local?</span>
						</h2>
						<p className="text-base text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
							Join HimalSpeak today and transform your language learning journey. Get 50 free credits to start speaking
							confidently in Russian, Japanese, or English.
						</p>
						<Button
							size="lg"
							className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mb-10"
						>
							Start Free Trial - 50 Credits <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Card className="bg-white/20 backdrop-blur-md border-0 rounded-xl p-6 max-w-2xl mx-auto">
							<p className="text-white italic text-base leading-relaxed mb-3">
								&quot;HimalSpeak made me conversation-ready for my studies in Moscow. The AI conversations felt so real, I
								was confident from day one!&quot;
							</p>
							<p className="text-white/80 font-medium text-sm">— Priya S., Nepali student in Russia</p>
						</Card>
					</div>
				</section>
				<footer className="bg-gray-900 text-white py-12">
					<div className="max-w-7xl mx-auto px-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
										<Globe className="w-5 h-5 text-white" />
									</div>
									<span className="text-lg font-bold">HimalSpeak</span>
								</div>
								<p className="text-gray-300 leading-relaxed text-sm">
									Empowering Nepali students to master languages and succeed globally.
								</p>
							</div>
							<div>
								<h4 className="text-base font-semibold mb-4">Quick Links</h4>
								<ul className="space-y-2 text-gray-300 text-sm">
									<li>
										<a href="#" className="hover:text-white transition-colors">
											About Us
										</a>
									</li>
									<li>
										<a href="#features" className="hover:text-white transition-colors">
											Features
										</a>
									</li>
									<li>
										<a href="#pricing" className="hover:text-white transition-colors">
											Pricing
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-white transition-colors">
											Contact
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="text-base font-semibold mb-4">Languages</h4>
								<ul className="space-y-2 text-gray-300 text-sm">
									<li>🇷🇺 Russian</li>
									<li>🇯🇵 Japanese</li>
									<li>🇺🇸 English</li>
									<li>✨ More Coming Soon</li>
								</ul>
							</div>
							<div>
								<h4 className="text-base font-semibold mb-4">Support</h4>
								<ul className="space-y-2 text-gray-300 text-sm">
									<li>
										<Link href="#" className="hover:text-white transition-colors">
											Help Center
										</Link>
									</li>
									<li>
										<Link href="#" className="hover:text-white transition-colors">
											Privacy Policy
										</Link>
									</li>
									<li>
										<Link href="#" className="hover:text-white transition-colors">
											Terms of Service
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
							<p>&copy; 2024 HimalSpeak. All rights reserved. Made with ❤️ for Nepali students worldwide.</p>
						</div>
					</div>
				</footer>
			</section>
		</SmoothScroll >
	)
}

export default MainPage;
