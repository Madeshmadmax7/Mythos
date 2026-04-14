import { Plus, MessageSquare } from "lucide-react";

const SidebarPreview = () => (
    <div className="w-[200px] h-full bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col">
        <div className="px-3 pt-3">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-white/80 border border-white/20 rounded-lg bg-white/5">
                <Plus size={12} />
                New Story
            </button>
        </div>

        <div className="flex-1 overflow-hidden px-3 mt-3">
            <p className="text-[9px] text-white/40 uppercase tracking-wider py-1 mb-2">Your Stories</p>

            <div className="flex flex-col gap-1">
                {["Dragon's Quest", "Space Odyssey", "Mystery Manor"].map((name, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-lg ${i === 0 ? 'bg-white/10' : 'bg-transparent'}`}
                    >
                        <MessageSquare size={12} className="text-white/40 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-white/80 truncate">{name}</p>
                            <p className="text-[9px] text-white/40">Fantasy • Today</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/80 font-semibold text-[10px]">
                    M
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/80 truncate">Mythos</p>
                    <p className="text-[12px] text-white/40 truncate">mythos@gmail.com</p>
                </div>
            </div>
        </div>
    </div>
);

export default SidebarPreview;
