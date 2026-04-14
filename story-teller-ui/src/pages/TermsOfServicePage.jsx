import LightRays from "../components/LightRays";

export default function TermsOfServicePage() {
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
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Terms of Service</h1>
                    <p className="text-white/50 mb-12">Last updated: February 2026</p>

                    <div className="space-y-8 text-white/70">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="leading-relaxed">
                                By accessing and using Mythos AI, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p className="leading-relaxed">
                                Mythos AI provides an AI-powered storytelling platform that allows users to generate, edit, and manage creative narratives. We reserve the right to modify or discontinue the service at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                            <p className="leading-relaxed mb-4">When creating an account, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the security of your password</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Content Ownership</h2>
                            <p className="leading-relaxed">
                                You retain ownership of the stories and content you create using Mythos AI. We do not claim ownership over your creative works. However, you grant us a license to store and process your content to provide the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use</h2>
                            <p className="leading-relaxed mb-4">You agree not to use the service to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Generate harmful, illegal, or offensive content</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights of others</li>
                                <li>Attempt to bypass security measures</li>
                                <li>Use automated systems to abuse the service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                            <p className="leading-relaxed">
                                Mythos AI is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                            <p className="leading-relaxed">
                                We reserve the right to update these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use after changes constitutes acceptance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
                            <p className="leading-relaxed">
                                For questions about these Terms of Service, contact us at{" "}
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
