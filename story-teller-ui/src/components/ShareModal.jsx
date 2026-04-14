import React, { useState } from 'react';
import { X, Copy, Check, Eye, Users } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, storyHash, isOwner }) {
    const [copiedMode, setCopiedMode] = useState(null); // 'view' or 'collab'

    if (!isOpen) return null;

    const generateLink = (mode) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/app/m/${storyHash}?mode=${mode}`;
    };

    const handleCopy = (mode) => {
        const link = generateLink(mode);
        navigator.clipboard.writeText(link);
        setCopiedMode(mode);
        setTimeout(() => setCopiedMode(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Share Story</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Share to View */}
                    <div className="bg-black/50 border border-[#333] rounded-xl p-4 hover:border-[#444] transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                                <Eye size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-medium mb-1">Share to View</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Recipients can read the story as it updates. They cannot make changes.
                                </p>
                                <button
                                    onClick={() => handleCopy('view')}
                                    className="w-full flex items-center justify-center gap-2 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg transition-all border border-[#333]"
                                >
                                    {copiedMode === 'view' ? (
                                        <>
                                            <Check size={16} className="text-green-400" />
                                            <span className="text-green-400">Link Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            <span>Copy View Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Share to Collaborate (Owner Only) */}
                    {isOwner && (
                        <div className="bg-black/50 border border-[#333] rounded-xl p-4 hover:border-[#444] transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400">
                                    <Users size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium mb-1">Share to Collaborate</h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Recipients can propose changes and add new messages (requires approval).
                                    </p>
                                    <button
                                        onClick={() => handleCopy('collaborate')}
                                        className="w-full flex items-center justify-center gap-2 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg transition-all border border-[#333]"
                                    >
                                        {copiedMode === 'collaborate' ? (
                                            <>
                                                <Check size={16} className="text-green-400" />
                                                <span className="text-green-400">Link Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                <span>Copy Collab Link</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
