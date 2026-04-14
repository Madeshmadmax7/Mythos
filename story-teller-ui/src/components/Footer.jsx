import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import mythos from "/logo/mythos-2.png";
import crocwalk from '../image/crocwalk.png';
export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleFaqClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            // Already on homepage, just scroll to FAQ
            const faqElement = document.getElementById('faq');
            if (faqElement) {
                faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Navigate to homepage with hash
            navigate('/#faq');
        }
    };

    return (
        <footer className="relative z-10 bg-[#0a0a1a]">
            {/* Main Content Box */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-8 pb-0 relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo & Social */}
                        <div className="space-y-6">
                            <img src={mythos} alt="Mythos" className="w-20 h-20" />
                            <div className="flex items-center gap-3">
                                <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition">
                                    <Send size={14} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition">
                                    <MessageCircle size={14} />
                                </a>
                            </div>
                            <div className="text-xs text-white/40">
                                <p>Mythos AI Studio</p>
                                <p>India</p>
                            </div>
                        </div>

                        {/* Information */}
                        <div>
                            <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Information</h4>
                            <ul className="space-y-2.5">
                                <li><Link to="/docs" className="text-sm text-white/70 hover:text-white transition">Documentation</Link></li>
                                <li><a href="#faq" onClick={handleFaqClick} className="text-sm text-white/70 hover:text-white transition cursor-pointer">FAQ</a></li>
                                <li><Link to="/privacy" className="text-sm text-white/70 hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-sm text-white/70 hover:text-white transition">Terms of Service</Link></li>
                            </ul>
                        </div>

                        {/* Menu */}
                        <div>
                            <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Menu</h4>
                            <ul className="space-y-2.5">
                                <li><Link to="/" className="text-sm text-white/70 hover:text-white transition">Home</Link></li>
                                <li><Link to="/login" className="text-sm text-white/70 hover:text-white transition">Get Started</Link></li>
                                <li><Link to="/docs" className="text-sm text-white/70 hover:text-white transition">Docs</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition">
                                Get in Touch
                            </button>
                            <div className="text-sm text-white/40">
                                <p>contact@mythos.ai</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <img
                            src={crocwalk}
                            alt="Croc"
                            className="h-32 object-contain"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-[#0a0a1a]">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">If you have questions or ideas?</h3>
                            <p className="text-sm text-white/50">Just send us your email and we will contact you.</p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 md:w-56 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none placeholder:text-white/40 focus:border-blue-500/50 transition"
                            />
                            <button className="p-3 bg-white text-black rounded-lg hover:bg-gray-100 transition">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated gradient bar with moving light */}
            <div className="relative h-0.5 bg-blue-950 overflow-hidden">
                <div
                    className="absolute top-0 h-full w-96 animate-light-sweep"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, #1e3a8a 20%, #3b82f6 40%, #60a5fa 50%, #3b82f6 60%, #1e3a8a 80%, transparent 100%)',
                    }}
                />
            </div>

            {/* Copyright */}
            <div className="bg-[#0a0a1a]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <p className="text-xs text-white/30">© 2026 — Mythos AI</p>
                    <Link to="/privacy" className="text-xs text-white/30 hover:text-white/50 transition">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
