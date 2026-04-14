import LightRays from "../components/LightRays";

export default function PrivacyPolicyPage() {
    return (
        <div className="relative min-h-screen bg-[#0a0a1a] overflow-x-hidden">
            <div className="absolute inset-0 z-0 h-screen">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#6366f1"
                    raysSpeed={0.4}
                    lightSpread={1.5}
                    fadeDistance={1.3}
                    mouseInfluence={0}
                    noiseAmount={0.15}
                    rayLength={2}
                />
            </div>

            <div className="relative z-10 pt-32 pb-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
                    <p className="text-white/50 mb-12">Last updated: February 2026</p>

                    <div className="space-y-8 text-white/70">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p className="leading-relaxed">
                                Welcome to Mythos AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI storytelling platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                            <p className="leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Account information (name, email, password)</li>
                                <li>Story content and prompts you create</li>
                                <li>Communication preferences</li>
                                <li>Usage data and interaction patterns</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="leading-relaxed mb-4">We use the information we collect to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide and maintain our AI storytelling services</li>
                                <li>Improve and personalize your experience</li>
                                <li>Process your requests and generate stories</li>
                                <li>Send important updates and notifications</li>
                                <li>Analyze usage patterns to enhance our platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                            <p className="leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect your personal information. Your stories and data are encrypted and stored securely. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
                            <p className="leading-relaxed mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Access and receive a copy of your data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your account and data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                            <p className="leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us at{" "}
                                <a href="mailto:contact@mythos.ai" className="text-blue-400 hover:text-blue-300">
                                    contact@mythos.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
