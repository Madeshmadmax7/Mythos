import { Sparkles, Send } from "lucide-react";
import mythos from "/logo/mythos-2.png";

const ChatAreaPreview = () => {
    const genres = ["Fantasy", "Sci-Fi", "Horror", "Romance", "Mystery", "Adventure"];

    return (
        <div className="flex flex-col flex-1 bg-black/20 backdrop-blur-md h-full">
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-md font-semibold text-white/90 mb-1 flex items-center justify-center gap-1 whitespace-nowrap">Create amazing stories with <img src={mythos} alt="Mythos" className="w-16 h-16 inline-block" /></h1>
                    <p className="text-[10px] text-white/40 mb-2">Choose a genre</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {genres.map((g, i) => (
                            <button
                                key={g}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${i === 0 ? "bg-white/90 text-black" : "bg-white/10 text-white/70"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 bg-black/30 p-3">
                <div className="max-w-sm mx-auto">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Describe your story idea..."
                            className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white/80 text-xs outline-none placeholder:text-white/40"
                            disabled
                        />
                        <button className="px-3 py-2.5 rounded-lg bg-white/90 text-black flex items-center justify-center">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatAreaPreview;
