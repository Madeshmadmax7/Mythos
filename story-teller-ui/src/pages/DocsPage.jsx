import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import LightRays from '../components/LightRays';

const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'features', label: 'Features' },
    { id: 'getting-started', label: 'Getting Started' },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('introduction');
    const contentRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const scrollContainer = contentRef.current;
            const scrollTop = scrollContainer.scrollTop;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section) {
                    const offsetTop = section.offsetTop - scrollContainer.offsetTop - 100;
                    if (scrollTop >= offsetTop) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                }
            }
        };

        const container = contentRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element && contentRef.current) {
            const offsetTop = element.offsetTop - contentRef.current.offsetTop - 32;
            contentRef.current.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0a1a] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40">
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

            <div className="relative z-10 flex h-[calc(100vh-81px)] pt-32">
                <aside className="w-64 flex-shrink-0 border-r border-gray-800/50 p-6">
                    <div className="text-sm text-gray-500 font-medium mb-4 uppercase tracking-wider">
                        Get Started
                    </div>
                    <nav className="relative">
                        <div
                            className="absolute left-0 w-0.5 bg-blue-500 transition-all duration-300 ease-out rounded-full"
                            style={{
                                top: `${sections.findIndex(s => s.id === activeSection) * 44 + 6}px`,
                                height: '24px',
                            }}
                        />

                        <ul className="space-y-2">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left pl-4 py-2 text-sm transition-colors ${activeSection === section.id
                                            ? 'text-white font-medium'
                                            : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Content */}
                <main
                    ref={contentRef}
                    className="flex-1 overflow-y-auto px-12 py-10"
                >
                    <div className="max-w-3xl">
                        {/* Introduction Section */}
                        <section id="introduction" className="mb-16">
                            <h1 className="text-4xl font-bold text-blue-400 mb-6">
                                Introduction
                            </h1>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Story Teller is an AI-powered storytelling platform that helps you create
                                unique and engaging narratives. Whether you're a writer looking for inspiration,
                                a game master crafting adventures, or just someone who loves stories,
                                Story Teller is here to help bring your imagination to life.
                            </p>
                            <p className="text-white leading-relaxed mb-4">
                                This is not your typical story generator, which means you won't find generic,
                                cookie-cutter narratives. Instead, each story is uniquely crafted based on your
                                prompts and preferences.
                            </p>
                            <p className="text-white leading-relaxed">
                                Basically, Story Teller is here to help you stand out and make a statement
                                by adding a touch of creativity to your projects.
                            </p>
                        </section>

                        {/* Features Section */}
                        <section id="features" className="mb-16">
                            <h2 className="text-3xl font-bold text-blue-400 mb-6">
                                Features
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                The goal of Story Teller is simple - provide flexible, creative, and most
                                importantly, unique AI-generated stories that take your projects to the next level.
                            </p>
                            <p className="text-white leading-relaxed mb-6">
                                To make that happen, the project is committed to the following principles:
                            </p>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-1">
                                    <span className="text-white font-medium">AI Story Generation:</span>
                                    <span>Generate creative stories with AI based on your prompts and chosen genre.</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-white font-medium">Continue & Refine:</span>
                                    <span>Continue your story or refine specific parts to get the perfect narrative.</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-white font-medium">Multiple Genres:</span>
                                    <span>Choose from Fantasy, Sci-Fi, Mystery, Romance, Horror, and more.</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-white font-medium">Story Management:</span>
                                    <span>Save, organize, and revisit your stories anytime.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Getting Started Section */}
                        <section id="getting-started" className="mb-16">
                            <h2 className="text-3xl font-bold text-blue-400 mb-6">
                                Getting Started
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Follow these steps to start creating your own AI-powered stories:
                            </p>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">1. Create an Account</h3>
                                    <p className="text-gray-400">
                                        Sign up with your email to get started. It only takes a few seconds.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">2. Choose a Genre</h3>
                                    <p className="text-gray-400">
                                        Select the genre that fits your story idea - fantasy, sci-fi, mystery, and more.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">3. Write Your Prompt</h3>
                                    <p className="text-gray-400">
                                        Describe the story you want to create. Be as detailed or brief as you like.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">4. Let AI Create</h3>
                                    <p className="text-gray-400">
                                        Watch as the AI generates your unique story! Continue or refine as needed.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    to="/login"
                                    className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
                                >
                                    Start Creating Stories
                                </Link>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
