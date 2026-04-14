import React, { useState, useRef, useEffect } from "react";
import { Plus, MessageSquare, LogOut, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function Sidebar({
    stories,
    selectedStoryId,
    onSelectStory,
    onNewStory,
    onDeleteStory,
    onRenameStory,
    user,
    onLogout
}) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    const filteredStories = stories.filter((story) => {
        const name = (story.story_name || "").toLowerCase();
        const genre = (story.genre || "").toLowerCase();
        const q = searchText.trim().toLowerCase();
        if (!q) return true;
        return name.includes(q) || genre.includes(q);
    });

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpenId(null);
            }
        };
        if (menuOpenId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpenId]);

    const handleRenameClick = (story, e) => {
        e.stopPropagation();
        setMenuOpenId(null);
        setEditingId(story.id);
        setEditName(story.story_name || `Story ${story.id}`);
    };

    const handleDeleteClick = (storyId, e) => {
        e.stopPropagation();
        setMenuOpenId(null);
        onDeleteStory(storyId);
    };

    const handleSave = () => {
        if (editName.trim()) onRenameStory(editingId, editName.trim());
        setEditingId(null);
        setEditName("");
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
    };

    const toggleMenu = (storyId, e) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === storyId ? null : storyId);
    };

    return (
        <div className="w-[260px] h-full bg-black border-r border-[#222] flex flex-col">
            <img src="/logo/mythos-2.png" className="w-[100px] mx-auto mt-[12px]" alt="" />
            <div className="px-[12px] pt-[12px]">
                <button
                    onClick={onNewStory}
                    className="
                        w-full flex items-center justify-center gap-[12px]
                        px-[16px] py-[12px]
                        text-[14px] text-white
                        border border-[#333] rounded-[8px]
                        bg-transparent cursor-pointer
                        hover:bg-[#111] transition
                    "
                >
                    <Plus size={16} />
                    New Story
                </button>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search stories"
                    className="mt-2 w-full px-3 py-2 bg-[#111] border border-[#333] rounded-[8px] text-[13px] text-gray-200 outline-none"
                />
            </div>

            <div className="flex-1 overflow-y-auto px-[12px]">

                <p className="text-[11px] text-[#666] uppercase tracking-[1px] py-[8px] mb-[8px]">
                    Your Stories
                </p>

                {filteredStories.length === 0 && (
                    <div className="text-center py-[32px] text-[#666] text-[13px]">
                        <MessageSquare
                            size={24}
                            className="mx-auto mb-[8px] opacity-50"
                        />
                        <p>No stories yet</p>
                        <p className="text-[12px] mt-[4px]">Create your first story!</p>
                    </div>
                )}

                {filteredStories.length > 0 && (
                    <div className="flex flex-col gap-[4px]">
                        {filteredStories.map((story) => (
                            <div
                                key={story.id}
                                onClick={() =>
                                    editingId !== story.id && onSelectStory(story)
                                }
                                className={`
                                    group relative flex items-center gap-[12px]
                                    p-[12px] rounded-[8px]
                                    transition duration-200
                                    ${selectedStoryId === story.id
                                        ? "bg-[#1a1a1a]"
                                        : "hover:bg-[#111]"
                                    }
                                    ${editingId === story.id ? "cursor-default" : "cursor-pointer"}
                                `}
                            >
                                <MessageSquare
                                    size={16}
                                    className="text-[#666] shrink-0"
                                />

                                <div className="flex-1 min-w-0">

                                    {editingId === story.id ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={handleSave}
                                            onClick={(e) => e.stopPropagation()}
                                            className="
                                                w-full px-[8px] py-[4px]
                                                bg-[#1a1a1a] border border-[#444]
                                                rounded-[4px] text-white text-[14px]
                                                outline-none
                                            "
                                        />
                                    ) : (
                                        <>
                                            <p
                                                className="
                                                    text-[14px] text-[#e0e0e0]
                                                    whitespace-nowrap overflow-hidden text-ellipsis
                                                "
                                            >
                                                {story.story_name || `Story ${story.id}`}
                                            </p>

                                            <p className="text-[11px] text-[#666]">
                                                {story.genre && `${story.genre} • `}
                                                {new Date(
                                                    story.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Three-dot menu button (Owner Only) */}
                                {editingId !== story.id && story.access_level === 'owner' && (
                                    <button
                                        onClick={(e) => toggleMenu(story.id, e)}
                                        className={`
                                            shrink-0 p-1 rounded-md transition
                                            ${menuOpenId === story.id
                                                ? "opacity-100 bg-[#333]"
                                                : "opacity-0 group-hover:opacity-100 hover:bg-[#333]"
                                            }
                                        `}
                                    >
                                        <MoreHorizontal size={16} className="text-[#999]" />
                                    </button>
                                )}

                                {/* Dropdown menu */}
                                {menuOpenId === story.id && (
                                    <div
                                        ref={menuRef}
                                        className="
                                            absolute right-[8px] top-[44px] z-50
                                            w-[140px] py-[4px]
                                            bg-[#1a1a1a] border border-[#333]
                                            rounded-[8px] shadow-lg shadow-black/50
                                        "
                                    >
                                        <button
                                            onClick={(e) => handleRenameClick(story, e)}
                                            className="
                                                w-full flex items-center gap-[8px]
                                                px-[12px] py-[8px]
                                                text-[13px] text-[#e0e0e0]
                                                hover:bg-[#333] transition
                                            "
                                        >
                                            <Pencil size={14} className="text-[#999]" />
                                            Rename
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(story.id, e)}
                                            className="
                                                w-full flex items-center gap-[8px]
                                                px-[12px] py-[8px]
                                                text-[13px] text-red-400
                                                hover:bg-[#333] transition
                                            "
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[#222]">
                {user && (
                    <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="p-2 hover:bg-[#1a1a1a] rounded-md transition"
                            title="Logout"
                        >
                            <LogOut size={18} className="text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
