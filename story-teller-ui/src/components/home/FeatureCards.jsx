import { Wand2, MessageSquare, Layers, RefreshCw, Zap, Save, Sparkles, BookOpen } from "lucide-react";
import mythos from "/logo/mythos-2.png";
import crocImg from "../../image/croc.png";

const features = [
    { title: "Craft unique tales with AI" },
    { title: "Chat with story characters" },
    { title: "Explore endless genres and worlds" },
    { title: "Expand and refine your stories" },
    { title: "Instant story generation" },
    { title: "AI remembers your stories" },
    { title: "Creative prompts for inspiration" },
    { title: "Browse a library of adventures" },
];


const FeatureCard = ({ feature, index }) => (
    <div className="relative bg-[#111827] rounded-2xl p-4 aspect-square shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-800 hover:border-gray-700 flex flex-col justify-between">
        {/* Top row: Number left, Logo right */}
        <div className="flex justify-between items-start">
            <span className="text-5xl font-bold text-white">{index + 1}</span>
            <img src={mythos} alt="Mythos" className="w-12 h-12" />
        </div>

        {/* Title centered and big */}
        <h2 className="font-outfit font-semibold text-white text-lg text-center">
            {feature.title}
        </h2>
    </div>
);

const FeatureCards = () => {
    return (
        <section className="relative z-10 py-24 px-4 bg-[#0a0a1a]">
            <div className="max-w-xl mx-auto">
                {/* Top Row - 3 cards */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                    {features.slice(0, 3).map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>

                {/* Middle Row - 2 cards with croc image in center */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <FeatureCard feature={features[3]} index={3} />

                    {/* Center Croc Image */}
                    <div className="flex items-center justify-center">
                        <img
                            src={crocImg}
                            alt="Croc"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>

                    <FeatureCard feature={features[4]} index={4} />
                </div>

                {/* Bottom Row - 3 cards */}
                <div className="grid grid-cols-3 gap-3">
                    {features.slice(5, 8).map((feature, index) => (
                        <FeatureCard key={index + 5} feature={feature} index={index + 5} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
