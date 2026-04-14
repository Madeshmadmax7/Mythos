import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import warriorImg from "../../image/crocrock.png";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How does Mythos AI generate stories?",
            answer: "Mythos AI uses advanced language models to understand your prompts and generate creative, coherent narratives. Simply describe your story idea, choose a genre, and let the AI craft unique tales tailored to your imagination.",
        },
        {
            question: "Can I edit or refine the generated stories?",
            answer: "Absolutely! You can refine any part of your story by selecting specific paragraphs and requesting changes. The AI will regenerate that section while maintaining consistency with the rest of your narrative.",
        },
        {
            question: "What genres are available for story creation?",
            answer: "We support a wide range of genres including Fantasy, Sci-Fi, Horror, Romance, Mystery, Adventure, and more. Each genre influences the AI's writing style and narrative elements.",
        },
        {
            question: "Is my story data saved and secure?",
            answer: "Yes, all your stories are securely saved to your account. We use encryption and follow best practices to ensure your creative works remain private and accessible only to you.",
        },
        {
            question: "Can I continue a story from where I left off?",
            answer: "Yes! Simply select your story from the sidebar, and use the 'Continue' button to generate new paragraphs that seamlessly extend your existing narrative.",
        },
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a1a] text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-1 space-y-3 w-full">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-white/10 rounded-xl overflow-hidden bg-[#0f0f1a]"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-blue-400 font-mono text-sm">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-medium text-white/90">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openIndex === index
                                        ? "bg-blue-500 text-white"
                                        : "bg-white/10 text-white/60"
                                        }`}>
                                        {openIndex === index ? (
                                            <Minus size={16} />
                                        ) : (
                                            <Plus size={16} />
                                        )}
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}>
                                    <div className="px-6 pb-5 pt-0">
                                        <div className="pl-10 text-white/60 text-sm leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Warrior Image - Right Side */}
                    <div className="hidden lg:flex flex-shrink-0 mt-20 items-center justify-center">
                        <img
                            src={warriorImg}
                            alt="Warrior"
                            className="w-100 h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
