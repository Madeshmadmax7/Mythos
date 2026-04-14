import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import LightRays from "../components/LightRays";
import SidebarPreview from "../components/home/SidebarPreview";
import ChatAreaPreview from "../components/home/ChatAreaPreview";
import FeatureCards from "../components/home/FeatureCards";
import InteractiveDemo from "../components/home/InteractiveDemo";
import FAQSection from "../components/home/FAQSection";
import mythos from "/logo/mythos-2.png";
export default function HomePage() {
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

            <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-32">
                <h1 className="font-outfit text-4xl md:text-5xl font-semibold text-white max-w-2xl leading-tight flex items-center gap-2">
                    Write better with
                    <img src={mythos} alt="Mythos" className="w-40 h-40 inline-block" />
                </h1>
                <p className="text-sm text-gray-500 mb-6 max-w-md">
                    Create unique narratives and bring your imagination to life
                </p>

                <div className="relative w-full max-w-5xl p-1.5 bg-white/[0.02] border border-white/10 rounded-3xl">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/30 rounded-3xl" />

                    <div className="relative bg-white/3 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/10">
                        <div className="flex h-[500px]">
                            <SidebarPreview />
                            <ChatAreaPreview />
                        </div>

                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/30 rounded-xl" />
                    </div>
                </div>

            </section>

            <section className="relative z-10 py-24 px-5">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        Know what all I can do !
                    </h2>
                    <FeatureCards />
                </div>
            </section>

            <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f2a]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        Stories with an AI assistant
                    </h2>

                    <p className="text-sm text-gray-500 mb-12 max-w-lg mx-auto">
                        Watch how Mythos creates engaging stories from your ideas.
                    </p>

                    <InteractiveDemo />

                    <div className="mt-12">
                        <Link
                            to="/login"
                            className="inline-block px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition text-sm"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>

            <FAQSection />
        </div>
    );
}
