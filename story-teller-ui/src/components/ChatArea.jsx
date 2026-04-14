import React, { useState, useRef, useEffect } from "react";
import {
    Send,
    RefreshCw,
    Sparkles,
    Edit3,
    Save,
    X,
    Pencil,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Share2,
    MoreVertical,
} from "lucide-react";
import crocLogo from "../image/croclogo.png";
import ShareModal from "./ShareModal";
import ManagementModal from "./ManagementModal";

function MessageBlock({
    message,
    isRefining,
    onRefine,
    onEditMessage,
    isNew,
    reaction,
    onReaction,
    onAddReview,
    user,
    selectedStory,
}) {
    const [showRefine, setShowRefine] = useState(false);
    const [refinePrompt, setRefinePrompt] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const [reviewComment, setReviewComment] = useState("");

    const textareaRef = useRef(null);

    const [displayedText, setDisplayedText] = useState(
        isNew ? "" : message.ai_response
    );
    const [isTyping, setIsTyping] = useState(isNew);

    useEffect(() => {
        if (!message.ai_response || isEditing || isRefining) return;

        if (!isNew) {
            setDisplayedText(message.ai_response);
            setIsTyping(false);
            return;
        }

        let text = message.ai_response;
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 3));
                index += 3;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 10);

        return () => clearInterval(timer);
    }, [message.ai_response, message.id, isNew]);

    const handleRefine = () => {
        if (!refinePrompt.trim()) return;
        onRefine(message.id, refinePrompt);
        setRefinePrompt("");
        setShowRefine(false);
    };

    const handleEdit = () => {
        setEditContent(message.ai_response);
        setIsEditing(true);
    };

    const saveEdit = async () => {
        if (!editContent.trim()) return;
        setIsSaving(true);
        await onEditMessage(message.id, editContent.trim());
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <>
            {/* USER MESSAGE (RIGHT) */}
            <div className="py-4 bg-black">
                <div className="max-w-4xl mx-auto px-6 flex justify-end">
                    <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="flex-1 text-right">
                            <p className="text-gray-300 bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tr-sm inline-block text-left">
                                {message.user_prompt}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                    </div>
                </div>
            </div>

            {/* AI MESSAGE (LEFT) */}
            <div className="py-4 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="flex items-start gap-3 max-w-[85%]">
                        <img
                            src={crocLogo}
                            alt="AI"
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            {isRefining && (
                                <div className="flex items-center gap-2 text-gray-400 bg-[#1a1a1a] px-4 py-3 rounded-2xl">
                                    <RefreshCw className="animate-spin" size={16} />
                                    Refining...
                                </div>
                            )}

                            {!isRefining && isEditing && (
                                <div className="flex flex-col gap-3">
                                    <textarea
                                        ref={textareaRef}
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full min-h-[200px] p-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-gray-200 resize-none outline-none"
                                    />

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-[#333] rounded-md text-gray-400"
                                        >
                                            <X size={14} />
                                            Cancel
                                        </button>

                                        <button
                                            onClick={saveEdit}
                                            disabled={isSaving || !editContent}
                                            className="px-4 py-2 rounded-md bg-green-500 text-white disabled:opacity-60"
                                        >
                                            {isSaving ? (
                                                <RefreshCw
                                                    className="animate-spin"
                                                    size={14}
                                                />
                                            ) : (
                                                <Save size={14} />
                                            )}
                                            {selectedStory?.user_id === user?.id ? "Save" : "Propose"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!isRefining && !isEditing && (
                                <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl">
                                    <p className="text-gray-200 whitespace-pre-wrap">
                                        {displayedText}
                                        {isTyping && (
                                            <span className="inline-block w-0.5 h-4 bg-blue-400 ml-1 animate-pulse" />
                                        )}
                                    </p>

                                    {(selectedStory?.user_id === user?.id || selectedStory?.access_level === 'collaborate') && !isTyping && (
                                        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#333]">
                                            <button
                                                onClick={handleEdit}
                                                className="px-2 py-1 text-[11px] text-gray-400 hover:text-gray-300 flex items-center gap-1"
                                            >
                                                <Pencil size={12} />
                                                {selectedStory?.user_id === user?.id ? "Edit" : "Propose Edit"}
                                            </button>

                                            <div className="flex items-center gap-3 ml-auto">
                                                <button
                                                    onClick={() =>
                                                        onReaction(
                                                            message.id,
                                                            reaction?.type === "like"
                                                                ? null
                                                                : "like"
                                                        )
                                                    }
                                                    className={`px-2 py-1 rounded text-[11px] ${reaction?.type === "like"
                                                        ? "text-green-400 bg-green-400/10"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    <ThumbsUp size={12} />
                                                    {reaction?.likes > 0 && reaction.likes}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        onReaction(
                                                            message.id,
                                                            reaction?.type === "dislike"
                                                                ? null
                                                                : "dislike"
                                                        )
                                                    }
                                                    className={`px-2 py-1 rounded text-[11px] ${reaction?.type === "dislike"
                                                        ? "text-red-400 bg-red-400/10"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    <ThumbsDown size={12} />
                                                    {reaction?.dislikes > 0 &&
                                                        reaction.dislikes}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setShowReviewInput(!showReviewInput)
                                                    }
                                                    className={`px-2 py-1 rounded text-[11px] ${showReviewInput
                                                        ? "text-blue-400 bg-blue-400/10"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    <MessageSquare size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showReviewInput && !isTyping && (
                                        <div className="mt-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={reviewComment}
                                                    onChange={(e) =>
                                                        setReviewComment(e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            reviewComment.trim()
                                                        ) {
                                                            onAddReview(
                                                                message.id,
                                                                reviewComment
                                                            );
                                                            setReviewComment("");
                                                        }
                                                    }}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-gray-200 text-xs outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (reviewComment.trim()) {
                                                            onAddReview(
                                                                message.id,
                                                                reviewComment
                                                            );
                                                            setReviewComment("");
                                                        }
                                                    }}
                                                    disabled={!reviewComment.trim()}
                                                    className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg disabled:opacity-50"
                                                >
                                                    <Send size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {(selectedStory?.user_id === user?.id || selectedStory?.access_level === 'collaborate') && !isRefining && !isEditing && (
                    <div className="max-w-3xl mx-auto px-6 mt-3 flex flex-wrap gap-2">
                        {!showRefine ? (
                            <button
                                onClick={() => setShowRefine(true)}
                                className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-300 text-sm flex items-center gap-2"
                            >
                                <Edit3 size={14} />
                                {selectedStory?.user_id === user?.id ? "Refine" : "Propose Refinement"}
                            </button>
                        ) : (
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={refinePrompt}
                                    onChange={(e) =>
                                        setRefinePrompt(e.target.value)
                                    }
                                    onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-200"
                                    placeholder="How should this part be refined?"
                                />

                                <button
                                    onClick={handleRefine}
                                    disabled={!refinePrompt.trim()}
                                    className="px-4 py-3 bg-[#333] text-white rounded-lg"
                                >
                                    {selectedStory?.user_id === user?.id ? "Refine" : "Propose"}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowRefine(false);
                                        setRefinePrompt("");
                                    }}
                                    className="px-4 py-3 bg-[#1a1a1a] border border-[#333] text-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default function ChatArea({
    messages,
    loading,
    refiningId,
    error,
    inputText,
    setInputText,
    genre,
    setGenre,
    onSend,
    onContinue,
    onRefine,
    onEditMessage,
    hasMessages,
    newMessageId,
    reactions,
    reviews,
    onReaction,
    onAddReview,
    user,
    selectedStory, // Added missing prop
    onRefresh,
    storyTools,
    onUpdateStoryTools,
    onExportStory,
    onGenerateRecap,
}) {
    const scrollRef = useRef(null);
    const [activeView, setActiveView] = useState("chat");
    const [showTools, setShowTools] = useState(false);

    const genres = [
        { id: "fantasy", name: "Fantasy" },
        { id: "scifi", name: "Sci-Fi" },
        { id: "horror", name: "Horror" },
        { id: "romance", name: "Romance" },
        { id: "mystery", name: "Mystery" },
        { id: "adventure", name: "Adventure" },
    ];

    const [showShareModal, setShowShareModal] = useState(false);
    const [showManagementModal, setShowManagementModal] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSubmit = () => {
        if (hasMessages) onContinue();
        else onSend();
    };

    return (
        <div className="flex flex-col flex-1 bg-black h-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-black">
                <div className="flex items-center gap-3">
                    <div className="font-semibold text-white">
                        {selectedStory?.story_name || "New Story"}
                    </div>
                    <div className="flex items-center bg-[#111] border border-[#222] rounded-lg p-1">
                        <button
                            onClick={() => setActiveView("chat")}
                            className={`px-3 py-1 text-xs rounded ${activeView === "chat" ? "bg-white text-black" : "text-gray-400"}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveView("timeline")}
                            className={`px-3 py-1 text-xs rounded ${activeView === "timeline" ? "bg-white text-black" : "text-gray-400"}`}
                        >
                            Timeline
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Share and Refresh visible for all with access */}
                    {(user?.id === selectedStory?.user_id || selectedStory?.access_level === 'collaborate' || selectedStory?.access_level === 'view' || !selectedStory) && (
                        <>
                            <button
                                onClick={async () => {
                                    const btn = document.getElementById('navbar-refresh-btn');
                                    if (btn) btn.classList.add('animate-spin');
                                    await onRefresh();
                                    if (btn) btn.classList.remove('animate-spin');
                                }}
                                id="navbar-refresh-btn"
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-all"
                                title="Refresh Messages"
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1a1a]"
                            >
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={() => onExportStory("txt")}
                                className="px-3 py-2 text-xs text-gray-300 border border-[#333] rounded-lg hover:bg-[#1a1a1a]"
                                title="Export TXT"
                            >
                                TXT
                            </button>
                            <button
                                onClick={() => onExportStory("md")}
                                className="px-3 py-2 text-xs text-gray-300 border border-[#333] rounded-lg hover:bg-[#1a1a1a]"
                                title="Export Markdown"
                            >
                                MD
                            </button>
                        </>
                    )}

                    {/* Show management menu for owner and collaborators */}
                    {(user?.id === selectedStory?.user_id || selectedStory?.access_level === 'collaborate') && (
                        <button
                            onClick={() => setShowManagementModal(true)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1a1a]"
                        >
                            <MoreVertical size={20} />
                        </button>
                    )}

                    <ShareModal
                        isOpen={showShareModal}
                        onClose={() => setShowShareModal(false)}
                        storyHash={selectedStory?.hash_id}
                        isOwner={user?.id === selectedStory?.user_id}
                    />

                    <ManagementModal
                        isOpen={showManagementModal}
                        onClose={() => setShowManagementModal(false)}
                        storyHash={selectedStory?.hash_id}
                        token={localStorage.getItem("token")}
                        isOwner={user?.id === selectedStory?.user_id}
                        currentUser={user}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                {error && (
                    <div className="max-w-3xl mx-auto px-6 py-4">
                        <div className="bg-red-600/10 text-red-400 border border-red-600/40 p-3 rounded-lg">
                            {error}
                        </div>
                    </div>
                )}

                {activeView === "timeline" && hasMessages && (
                    <div className="max-w-3xl mx-auto px-6 py-6">
                        <h3 className="text-white text-lg mb-4">Story Timeline</h3>
                        <div className="space-y-3">
                            {messages.map((m, i) => (
                                <div key={m.id} className="bg-[#111] border border-[#222] rounded-lg p-4">
                                    <div className="text-xs text-gray-500 mb-1">Turn {i + 1}</div>
                                    <div className="text-sm text-gray-300 mb-2 line-clamp-2">{m.user_prompt}</div>
                                    <div className="text-xs text-gray-500 line-clamp-2">{m.hint_context || "No hint"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!hasMessages && !loading && activeView === "chat" && (
                    <div className="flex items-center justify-center h-full text-center">
                        <div>
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                <Sparkles size={28} color="#fff" />
                            </div>

                            <h1 className="text-white text-3xl mt-4">AI Storyteller</h1>
                            <p className="text-gray-500 mt-2">
                                Create amazing stories with AI
                            </p>

                            <p className="text-sm text-gray-400 mt-4">Choose a genre</p>

                            <div className="flex flex-wrap justify-center gap-3 mt-3">
                                {genres.map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => {
                                            if (!selectedStory || selectedStory.user_id === user?.id || selectedStory.access_level === 'collaborate') {
                                                setGenre(g.id);
                                            }
                                        }}
                                        disabled={selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate'}
                                        className={`px-4 py-2 text-sm rounded-full transition-all ${genre === g.id
                                            ? "bg-white text-black"
                                            : "bg-[#1a1a1a] text-gray-300"
                                            } ${(selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate') ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#222]'}`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {hasMessages && activeView === "chat" && (
                    <div className="pb-32">
                        {messages.map((msg) => (
                            <MessageBlock
                                key={msg.id}
                                message={msg}
                                isRefining={refiningId === msg.id}
                                onRefine={onRefine}
                                onEditMessage={onEditMessage}
                                isNew={msg.id === newMessageId}
                                reaction={reactions?.[msg.id]}
                                onReaction={onReaction}
                                onAddReview={onAddReview}
                                user={user}
                                selectedStory={selectedStory}
                            />
                        ))}

                        {loading && (
                            <div className="py-6 bg-[#0a0a0a] px-6 flex gap-3 items-center text-gray-400">
                                <img
                                    src={crocLogo}
                                    className="w-8 h-8 rounded-md"
                                    alt=""
                                />
                                <RefreshCw className="animate-spin" size={16} />
                                Continuing your story...
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-[#222] bg-black p-5">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <button
                            onClick={() => setShowTools((s) => !s)}
                            className="px-3 py-2 text-xs border border-[#333] rounded-lg text-gray-300 hover:bg-[#1a1a1a]"
                        >
                            {showTools ? "Hide Controls" : "Story Controls"}
                        </button>
                        <button
                            onClick={onGenerateRecap}
                            className="px-3 py-2 text-xs border border-[#333] rounded-lg text-gray-300 hover:bg-[#1a1a1a]"
                        >
                            Quick Recap
                        </button>
                    </div>

                    {showTools && (
                        <div className="mb-4 bg-[#111] border border-[#222] rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Strictness</label>
                                    <select
                                        value={storyTools?.strictness || "strict_canon"}
                                        onChange={(e) => onUpdateStoryTools({ strictness: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-200 text-sm"
                                    >
                                        <option value="balanced">Balanced</option>
                                        <option value="strict_canon">Strict Canon</option>
                                        <option value="hard_science">Hard Science</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Max Words</label>
                                    <select
                                        value={storyTools?.maxWords || 450}
                                        onChange={(e) => onUpdateStoryTools({ maxWords: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-200 text-sm"
                                    >
                                        <option value={200}>200</option>
                                        <option value={300}>300</option>
                                        <option value={450}>450</option>
                                        <option value={650}>650</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-2 text-xs text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(storyTools?.noNewCharacters)}
                                        onChange={(e) => onUpdateStoryTools({ noNewCharacters: e.target.checked })}
                                    />
                                    No New Characters
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(storyTools?.scienceStrict)}
                                        onChange={(e) => onUpdateStoryTools({ scienceStrict: e.target.checked })}
                                    />
                                    Science Strict
                                </label>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Pinned Facts</label>
                                <textarea
                                    value={storyTools?.pinnedFacts || ""}
                                    onChange={(e) => onUpdateStoryTools({ pinnedFacts: e.target.value })}
                                    rows={3}
                                    placeholder="Facts that must never change..."
                                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-200 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Character Bible</label>
                                <textarea
                                    value={storyTools?.characterBible || ""}
                                    onChange={(e) => onUpdateStoryTools({ characterBible: e.target.value })}
                                    rows={3}
                                    placeholder="Name: role, traits, current state..."
                                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-200 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    inputText.trim() &&
                                    !loading
                                )
                                    handleSubmit();
                            }}
                            disabled={selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate'}
                            placeholder={
                                (selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate')
                                    ? "Read-only access"
                                    : hasMessages
                                        ? "What happens next?"
                                        : "Describe your story idea..."
                            }
                            className={`flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#333] rounded-xl text-white ${(selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !inputText.trim() || (selectedStory && selectedStory.user_id !== user?.id && selectedStory.access_level !== 'collaborate')}
                            className="px-6 py-4 rounded-xl bg-white text-black disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 pl-2 flex flex-wrap gap-4">
                        Genre: <span className="text-gray-400 capitalize">{genre || "None"}</span>
                        <span>
                            Strictness: <span className="text-gray-400 capitalize">{(storyTools?.strictness || "strict_canon").replace("_", " ")}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
