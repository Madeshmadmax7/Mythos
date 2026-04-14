import { useState, useEffect } from "react";
import { Wand2, RefreshCw, Send } from "lucide-react";

const InteractiveDemo = () => {
    const [phase, setPhase] = useState("typing");
    const [typedInput, setTypedInput] = useState("");
    const [showPrompt, setShowPrompt] = useState(false);
    const [typedResponse, setTypedResponse] = useState("");

    const prompt = "Write a fantasy story about a dragon";
    const response = `In the misty peaks of Mount Valdris, there lived a dragon named Ember. Unlike his fearsome ancestors, Ember had a curious heart and gentle wisdom.

One autumn morning, a young knight named Lira climbed to his lair—not with sword drawn, but with freshly baked honey cakes.

"I heard dragons love sweets," she called into the darkness. A rumbling laugh echoed back. "You heard correctly, little knight."`;

    useEffect(() => {
        let timeout;

        if (phase === "typing") {
            // Type in input box
            if (typedInput.length < prompt.length) {
                timeout = setTimeout(() => {
                    setTypedInput(prompt.slice(0, typedInput.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setPhase("click"), 500);
            }
        } else if (phase === "click") {
            // Simulate click - instantly show prompt
            setShowPrompt(true);
            timeout = setTimeout(() => setPhase("generating"), 300);
        } else if (phase === "generating") {
            timeout = setTimeout(() => setPhase("response"), 2200);
        } else if (phase === "response") {
            // Type response from left
            if (typedResponse.length < response.length) {
                timeout = setTimeout(() => {
                    setTypedResponse(response.slice(0, typedResponse.length + 2));
                }, 15);
            } else {
                timeout = setTimeout(() => {
                    // Reset all
                    setPhase("typing");
                    setTypedInput("");
                    setShowPrompt(false);
                    setTypedResponse("");
                }, 5000);
            }
        }

        return () => clearTimeout(timeout);
    }, [phase, typedInput, typedResponse]);

    return (
        <div className="bg-black rounded-2xl border border-[#222] overflow-hidden shadow-2xl">
            <div className="p-5 h-[320px] overflow-hidden">
                {showPrompt && (
                    <div className="py-2 flex justify-end">
                        <div className="flex gap-3 flex-row-reverse max-w-[80%]">
                            <div className="w-7 h-7 rounded-md bg-[#333] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                M
                            </div>
                            <div className="text-right">
                                <p className="text-gray-300 text-sm bg-[#1a1a1a] rounded-xl px-4 py-2.5">
                                    {prompt}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {phase === "generating" && (
                    <div className="py-2">
                        <div className="flex gap-3 items-center max-w-[80%]">
                            <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center shrink-0">
                                <Wand2 size={14} className="text-white" />
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <RefreshCw size={14} className="animate-spin" />
                                Crafting your story...
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Response - LEFT ALIGNED */}
                {phase === "response" && typedResponse && (
                    <div className="py-2">
                        <div className="flex gap-3 max-w-[95%]">
                            <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center shrink-0">
                                <Wand2 size={14} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-[10px] text-gray-400 font-semibold mb-2">Part 1</p>
                                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] rounded-xl px-4 py-3">
                                    {typedResponse}
                                    {typedResponse.length < response.length && <span className="animate-pulse">|</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-[#222] p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={typedInput}
                        placeholder="Describe your story idea..."
                        className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm outline-none"
                        readOnly
                    />
                    <button
                        className={`px-4 py-3 rounded-xl flex items-center justify-center ${phase === "generating" ? "bg-gray-600" : "bg-white text-black"
                            }`}
                    >
                        {phase === "generating" ? (
                            <RefreshCw size={16} className="animate-spin text-white" />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InteractiveDemo;
