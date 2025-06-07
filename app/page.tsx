import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star, Users, Globe, Mic, BookOpen, Trophy, Zap, Target, Award, Lightbulb, Rocket, Shield, Heart } from "lucide-react";

const Index = () => {
	return (
		<div className="w-full min-h-screen bg-white">
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
								<Globe className="w-6 h-6 text-white" />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
								HimalSpeak
							</span>
						</div>

						{/* Navigation Links */}
						<div className="hidden md:flex items-center space-x-8">
							<a href="#features" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">Features</a>
							<a href="#pricing" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">Pricing</a>
							<a href="#how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">How It Works</a>
							<a href="#challenges" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">Challenges</a>
						</div>

						{/* Right Side */}
						<div className="flex items-center space-x-4">
							<Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 font-medium">
								Buy Credits
							</Button>
							<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
								<Users className="w-5 h-5 text-white" />
							</div>
						</div>
					</div>
				</div>
			</nav>
			<section className="w-full relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 overflow-hidden pt-20">
				<section className="max-w-7xl mx-auto">
					<div className="absolute inset-0">
						<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
					</div>
					<div className="absolute top-32 left-20 animate-bounce delay-300">
						<div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
							<Mic className="w-8 h-8 text-white" />
						</div>
					</div>
					<div className="absolute top-48 right-32 animate-bounce delay-700">
						<div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
							<BookOpen className="w-7 h-7 text-white" />
						</div>
					</div>
					<div className="absolute bottom-32 left-32 animate-bounce delay-1000">
						<div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
							<Trophy className="w-6 h-6 text-white" />
						</div>
					</div>
					<div className="max-w-7xl mx-auto px-6 text-center relative z-10">
						<div className="w-full mx-auto">
							<div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 shadow-lg border border-teal-100">
								<Star className="w-4 h-4 text-teal-600" />
								<span className="text-sm font-medium text-teal-700">Trusted by 10,000+ Nepali Students</span>
							</div>
							<h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
								<span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
									Master Languages
								</span>
								<br />
								<span className="text-gray-800">Like a Native</span>
							</h1>
							<p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
								AI-powered conversations for Nepali students.
								<span className="text-teal-600 font-semibold"> No boring classes, no subscriptions</span> – just results.
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
								<Button
									size="lg"
									className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
								>
									Start Learning Free
									<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-2 border-teal-200 text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg font-semibold rounded-2xl group"
								>
									<Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
									Watch Demo
								</Button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
								<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-teal-100">
									<div className="text-3xl font-bold text-teal-600 mb-2">10K+</div>
									<div className="text-gray-700 font-medium">Students Learning</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-teal-100">
									<div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
									<div className="text-gray-700 font-medium">Success Rate</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-teal-100">
									<div className="text-3xl font-bold text-teal-600 mb-2">₹200</div>
									<div className="text-gray-700 font-medium">Starting Price</div>
								</div>
							</div>
						</div>
					</div>
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
						<div className="w-6 h-10 border-2 border-teal-400 rounded-full flex justify-center">
							<div className="w-1 h-3 bg-teal-400 rounded-full mt-2 animate-pulse"></div>
						</div>
					</div>
				</section>
			</section>
			<section className="w-full py-24 bg-gradient-to-br from-white to-gray-50" id="features">
				<section className="max-w-7xl mx-auto">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-20">
							<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-6 py-2 mb-6">
								<Zap className="w-5 h-5 text-teal-600" />
								<span className="text-teal-700 font-semibold">Why Choose Us</span>
							</div>
							<h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
								Experience the
								<span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Future</span>
							</h2>
							<p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
								Revolutionary AI-powered language learning that adapts to your pace, corrects your pronunciation instantly,
								and prepares you for real-world conversations.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
							{
								[
									{
										title: "AI-Powered Conversations",
										description: "Advanced AI tutors powered by ElevenLabs provide natural conversations with real-time pronunciation feedback and cultural context.",
										icon: "🤖",
										gradient: "from-blue-500 to-teal-600",
										bgGradient: "from-blue-50 to-teal-50"
									},
									{
										title: "Cultural Immersion",
										description: "Learn authentic expressions, social customs, and cultural nuances that textbooks miss. Prepare for real-world interactions.",
										icon: "🌏",
										gradient: "from-teal-500 to-emerald-600",
										bgGradient: "from-teal-50 to-emerald-50"
									},
									{
										title: "Flexible Credit System",
										description: "No subscriptions, no commitments. Pay only for what you use with our transparent credit system via Khalti or eSewa.",
										icon: "💳",
										gradient: "from-emerald-500 to-cyan-600",
										bgGradient: "from-emerald-50 to-cyan-50"
									}
								].map((feature, index) => (
									<Card key={index} className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.bgGradient}`}>
										<div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
										<CardContent className="relative p-8 text-center">
											<div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} text-white text-3xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
												{feature.icon}
											</div>
											<h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-teal-700 transition-colors">{feature.title}</h3>
											<p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
										</CardContent>
									</Card>
								))
							}
						</div>
					</div>
				</section>
			</section>

			<section className="py-24 bg-gradient-to-br from-gray-50 to-teal-50">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-20">
						<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-6 py-2 mb-6">
							<Lightbulb className="w-5 h-5 text-teal-600" />
							<span className="text-teal-700 font-semibold">Powerful Features</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
							Learn Like Never
							<span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Before</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Our cutting-edge features make language learning engaging, effective, and enjoyable.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								name: "VoiceVoyage",
								description: "Immersive AI conversations starting with Nepali greetings, then diving deep into your target language with real-time feedback.",
								icon: "🗣️",
								color: "from-purple-500 to-pink-500",
								bgColor: "from-purple-50 to-pink-50"
							},
							{
								name: "StorySpeak",
								description: "Real-life scenarios with rich visuals and interactive dialogues. Practice ordering food in Moscow or shopping in Tokyo.",
								icon: "📖",
								color: "from-blue-500 to-cyan-500",
								bgColor: "from-blue-50 to-cyan-50"
							},
							{
								name: "ChatQuest",
								description: "Free-form conversations with AI companions who remember your progress and adapt to your interests and learning style.",
								icon: "💬",
								color: "from-teal-500 to-green-500",
								bgColor: "from-teal-50 to-green-50"
							},
							{
								name: "PhraseForge",
								description: "Master daily expressions through interactive games, pronunciation challenges, and cultural context lessons.",
								icon: "🔨",
								color: "from-orange-500 to-red-500",
								bgColor: "from-orange-50 to-red-50"
							},
							{
								name: "Cultural Simulator",
								description: "Experience authentic cultural scenarios without leaving Nepal. Practice etiquette, customs, and social interactions.",
								icon: "🎭",
								color: "from-indigo-500 to-purple-500",
								bgColor: "from-indigo-50 to-purple-50"
							},
							{
								name: "Progress Analytics",
								description: "Detailed insights into your learning journey with personalized recommendations and achievement tracking.",
								icon: "📊",
								color: "from-gray-500 to-slate-500",
								bgColor: "from-gray-50 to-slate-50"
							}
						].map((feature, index) => (
							<Card key={index} className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.bgColor}`}>
								<div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.color}`}></div>
								<CardContent className="p-8 relative">
									<div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
										{feature.icon}
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors">{feature.name}</h3>
									<p className="text-gray-600 leading-relaxed">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Unique Challenges Section */}
			<section className="py-24 bg-gradient-to-br from-white to-gray-50" id="challenges">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-20">
						<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-6 py-2 mb-6">
							<Target className="w-5 h-5 text-teal-600" />
							<span className="text-teal-700 font-semibold">Challenges</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
							Prove Your
							<span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Skills</span>
						</h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-102 bg-gradient-to-br from-white to-indigo-50">
							<div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
							<CardContent className="p-10 relative">
								<div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
									🏆
								</div>
								<h3 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-indigo-700 transition-colors">FluencyForge Challenge</h3>
								<p className="text-gray-600 leading-relaxed mb-8 text-lg">
									Weekly competitions where you showcase your language skills through storytelling, debates, and roleplay.
									Compete with peers, earn credits, and climb our global leaderboard.
								</p>
								<div className="flex flex-wrap gap-3">
									<Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm">Weekly Competitions</Badge>
									<Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">Global Leaderboard</Badge>
									<Badge className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">Skill Badges</Badge>
								</div>
							</CardContent>
						</Card>

						<Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-102 bg-gradient-to-br from-white to-purple-50">
							<div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 to-pink-500"></div>
							<CardContent className="p-10 relative">
								<div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
									💬
								</div>
								<h3 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-purple-700 transition-colors">PeerSync Exchange</h3>
								<p className="text-gray-600 leading-relaxed mb-8 text-lg">
									Connect with native speakers for live language exchange sessions. Teach Nepali while learning Russian or Japanese
									in authentic, meaningful conversations.
								</p>
								<div className="flex flex-wrap gap-3">
									<Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">Live Conversations</Badge>
									<Badge className="bg-pink-100 text-pink-800 px-4 py-2 text-sm">Native Speakers</Badge>
									<Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm">Cultural Exchange</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-24 bg-gradient-to-br from-gray-50 to-teal-50" id="how-it-works">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-20">
						<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-6 py-2 mb-6">
							<Rocket className="w-5 h-5 text-teal-600" />
							<span className="text-teal-700 font-semibold">How It Works</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
							Your Journey to
							<span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Fluency</span>
						</h2>
						<p className="text-xl text-gray-600">Five simple steps to language mastery</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								step: "1",
								title: "Top Up Credits",
								description: "Add credits to your wallet via Khalti or eSewa. No subscriptions, just flexible pay-as-you-learn.",
								icon: "💳",
								color: "from-blue-500 to-cyan-500",
								bgColor: "from-blue-50 to-cyan-50"
							},
							{
								step: "2",
								title: "Choose Language",
								description: "Select Russian, Japanese, or English and start with our adaptive assessment to personalize your experience.",
								icon: "🌍",
								color: "from-teal-500 to-emerald-500",
								bgColor: "from-teal-50 to-emerald-50"
							},
							{
								step: "3",
								title: "Start Learning",
								description: "Engage in AI conversations, complete interactive lessons, and receive instant pronunciation feedback.",
								icon: "🎤",
								color: "from-emerald-500 to-green-500",
								bgColor: "from-emerald-50 to-green-50"
							},
							{
								step: "4",
								title: "Earn Rewards",
								description: "Score above 80% to earn credits back, unlock achievements, and climb our global leaderboard.",
								icon: "🏆",
								color: "from-orange-500 to-yellow-500",
								bgColor: "from-orange-50 to-yellow-50"
							},
							{
								step: "5",
								title: "Master Fluency",
								description: "Practice real-world scenarios and cultural immersion to become conversation-ready in months, not years.",
								icon: "✨",
								color: "from-purple-500 to-pink-500",
								bgColor: "from-purple-50 to-pink-50"
							}
						].map((step, index) => (
							<Card key={index} className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${step.bgColor}`}>
								<div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color}`}></div>
								<CardContent className="p-8 relative text-center">
									<div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${step.color} text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
										{step.step}
									</div>
									<div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
									<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors">{step.title}</h3>
									<p className="text-gray-600 leading-relaxed">{step.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-24 bg-gradient-to-br from-white to-gray-50" id="pricing">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-20">
						<div className="inline-flex items-center space-x-2 bg-teal-100 rounded-full px-6 py-2 mb-6">
							<Heart className="w-5 h-5 text-teal-600" />
							<span className="text-teal-700 font-semibold">Fair Pricing</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
							Affordable for
							<span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Everyone</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-4xl mx-auto">
							No expensive subscriptions or hidden fees. Pay only for what you use with our transparent credit system.
						</p>
					</div>

					<Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-teal-50 max-w-5xl mx-auto">
						<CardContent className="p-12">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
								<div className="p-8 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl">
									<h3 className="text-2xl font-bold text-gray-800 mb-4">VoiceVoyage</h3>
									<div className="text-5xl font-bold text-teal-600 mb-4">50</div>
									<div className="text-gray-600 font-medium">credits per session</div>
								</div>
								<div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
									<h3 className="text-2xl font-bold text-gray-800 mb-4">StorySpeak/PhraseForge</h3>
									<div className="text-5xl font-bold text-blue-600 mb-4">20</div>
									<div className="text-gray-600 font-medium">credits per unit</div>
								</div>
								<div className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
									<h3 className="text-2xl font-bold text-gray-800 mb-4">ChatQuest</h3>
									<div className="text-5xl font-bold text-purple-600 mb-4">10</div>
									<div className="text-gray-600 font-medium">credits per chat</div>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-12 text-center">
								<div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-2 mb-6">
									<Award className="w-5 h-5 text-green-600" />
									<span className="text-green-700 font-semibold">Earn Credits Back</span>
								</div>
								<h4 className="text-2xl font-bold text-gray-800 mb-6">Score 80%+ and get rewarded!</h4>
								<p className="text-gray-600 mb-8 text-lg">Excellence pays. Literally. Get back 10-50 credits for outstanding performance.</p>
								<div className="flex flex-wrap justify-center gap-6 mb-10">
									<Badge className="bg-green-100 text-green-800 px-6 py-3 text-lg font-medium">200 NPR Starter</Badge>
									<Badge className="bg-blue-100 text-blue-800 px-6 py-3 text-lg font-medium">500 NPR Popular</Badge>
									<Badge className="bg-purple-100 text-purple-800 px-6 py-3 text-lg font-medium">1,000 NPR Pro</Badge>
								</div>
								<Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl">
									Top Up Credits Now
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="py-24 bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<polygon points="0,100 30,40 60,60 100,20 100,100" fill="white" />
					</svg>
				</div>

				<div className="max-w-7xl mx-auto px-6 text-center relative z-10">
					<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
						<Shield className="w-5 h-5 text-white" />
						<span className="text-white font-semibold">Join 10,000+ Students</span>
					</div>
					<h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
						Ready to Sound Like a
						<span className="block">Local?</span>
					</h2>
					<p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
						Join HimalSpeak today and transform your language learning journey. Get 50 free credits to start
						speaking confidently in Russian, Japanese, or English.
					</p>
					<Button
						size="lg"
						className="bg-white text-teal-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 mb-12"
					>
						Start Free Trial - 50 Credits <ArrowRight className="ml-3 h-6 w-6" />
					</Button>

					<Card className="bg-white/20 backdrop-blur-md border-0 rounded-2xl p-8 max-w-3xl mx-auto">
						<p className="text-white italic text-xl leading-relaxed mb-4">
							"HimalSpeak made me conversation-ready for my studies in Moscow. The AI conversations felt so real,
							I was confident from day one!"
						</p>
						<p className="text-white/80 font-medium">— Priya S., Nepali student in Russia</p>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-16">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
						<div>
							<div className="flex items-center space-x-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
									<Globe className="w-6 h-6 text-white" />
								</div>
								<span className="text-2xl font-bold">HimalSpeak</span>
							</div>
							<p className="text-gray-300 leading-relaxed">Empowering Nepali students to master languages and succeed globally.</p>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-6">Quick Links</h4>
							<ul className="space-y-3 text-gray-300">
								<li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
								<li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
								<li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-6">Languages</h4>
							<ul className="space-y-3 text-gray-300">
								<li>🇷🇺 Russian</li>
								<li>🇯🇵 Japanese</li>
								<li>🇺🇸 English</li>
								<li>✨ More Coming Soon</li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-6">Support</h4>
							<ul className="space-y-3 text-gray-300">
								<li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
						<p>&copy; 2024 HimalSpeak. All rights reserved. Made with ❤️ for Nepali students worldwide.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Index;