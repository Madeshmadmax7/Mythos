import React, { useState, useEffect } from 'react';
import { X, Check, X as XIcon, User, FileEdit, ArrowLeft } from 'lucide-react';

export default function ManagementModal({ isOpen, onClose, storyHash, token, isOwner, currentUser }) {
    const [activeTab, setActiveTab] = useState('access'); // 'access' or 'changes'
    const [accessRequests, setAccessRequests] = useState([]);
    const [changeRequests, setChangeRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null); // Full view of a change request
    const [loading, setLoading] = useState(false);

    const API_BASE = "http://localhost:8000/api";

    useEffect(() => {
        if (isOpen && storyHash) {
            fetchRequests();
        }
    }, [isOpen, storyHash, activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            if (activeTab === 'access') {
                const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/access_requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setAccessRequests(await res.json());
            } else {
                const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/change_requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setChangeRequests(await res.json());
            }
        } catch (e) {
            console.error("Error fetching requests", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAccessAction = async (requestId, status) => {
        try {
            const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/access_requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setAccessRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (e) {
            console.error("Error updating access request", e);
        }
    };

    const handleChangeAction = async (requestId, status) => {
        try {
            const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/change_requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setChangeRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (e) {
            console.error("Error updating change request", e);
        }
    };

    const handleRemoveAccess = async (requestUserId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/access/${requestUserId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setAccessRequests(prev => prev.filter(r => r.user_id !== requestUserId));
            }
        } catch (e) {
            console.error("Error removing access", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl p-6 shadow-2xl h-[600px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Manage Story</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-[#333]">
                    <button
                        onClick={() => setActiveTab('access')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'access'
                            ? 'text-white border-blue-500'
                            : 'text-gray-400 border-transparent hover:text-gray-200'
                            }`}
                    >
                        Access Requests
                        {accessRequests.length > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                {accessRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('changes')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'changes'
                            ? 'text-white border-blue-500'
                            : 'text-gray-400 border-transparent hover:text-gray-200'
                            }`}
                    >
                        Change Requests
                        {changeRequests.length > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                {changeRequests.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Loading...
                        </div>
                    ) : (
                        <>
                            {activeTab === 'access' && (
                                <div className="space-y-3">
                                    {accessRequests.filter(req => req.user_id !== currentUser?.id).length === 0 ? (
                                        <div className="text-center text-gray-500 py-10">No other members or requests</div>
                                    ) : (
                                        accessRequests
                                            .filter(req => req.user_id !== currentUser?.id)
                                            .map(req => (
                                                <div key={req.id} className="bg-black/50 border border-[#333] p-4 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center text-gray-400 font-bold uppercase transition-transform hover:scale-105">
                                                            {req.user_name?.charAt(0) || <User size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-medium flex items-center gap-2">
                                                                {req.user_name}
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-tighter font-bold ${req.status === 'approved'
                                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                                    }`}>
                                                                    {req.status === 'approved' ? 'Active' : 'Pending'}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {req.status === 'approved' ? 'Role: ' : 'Type: '}
                                                                <span className={req.access_type === 'collaborate' ? 'text-blue-400 font-bold' : 'text-gray-300 font-medium'}>
                                                                    {req.access_type === 'collaborate' ? 'Collaborator' : 'Viewer'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {(isOwner || (req.user_id === currentUser?.id)) && (
                                                        <div className="flex gap-2">
                                                            {req.status === 'pending' && isOwner && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleAccessAction(req.id, 'rejected')}
                                                                        className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                                        title="Reject"
                                                                    >
                                                                        <XIcon size={20} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAccessAction(req.id, 'approved')}
                                                                        className="p-2 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                                                                        title="Approve"
                                                                    >
                                                                        <Check size={20} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {req.status === 'approved' && isOwner && (
                                                                <button
                                                                    onClick={() => handleRemoveAccess(req.user_id)}
                                                                    className="text-xs text-red-500 hover:text-red-400 font-semibold px-3 py-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-md transition-all active:scale-95"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'changes' && (
                                <div className="space-y-3">
                                    {changeRequests.length === 0 ? (
                                        <div className="text-center text-gray-500 py-10">No pending change requests</div>
                                    ) : (
                                        changeRequests.map(req => (
                                            <div key={req.id} className="bg-black/50 border border-[#333] p-4 rounded-xl space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center text-gray-400">
                                                            <FileEdit size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-medium">{req.user_name}</div>
                                                            <div className="text-sm text-gray-400">
                                                                Type: <span className="text-blue-400 uppercase text-[10px] font-bold tracking-tight">{req.change_type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedRequest(req)}
                                                            className="text-[10px] uppercase font-bold tracking-wider text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-md transition-all"
                                                        >
                                                            View Details
                                                        </button>
                                                        {isOwner && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleChangeAction(req.id, 'rejected')}
                                                                    className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <XIcon size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleChangeAction(req.id, 'approved')}
                                                                    className="p-1.5 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <Check size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-[#111] p-3 rounded-lg text-sm text-gray-400 font-mono border border-[#333] truncate max-h-20">
                                                    {truncateContent(req.new_content)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Detailed Request View Overlay */}
            {selectedRequest && (
                <div className="absolute inset-0 z-50 bg-black flex flex-col">
                    <div className="p-4 border-b border-[#333] flex items-center justify-between bg-[#0a0a0a]">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h3 className="text-white font-bold">Proposed {selectedRequest.change_type === 'new_message' ? 'Story Segment' : 'Edit'}</h3>
                                <p className="text-xs text-gray-500">by {selectedRequest.user_name}</p>
                            </div>
                        </div>
                        {isOwner && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        handleChangeAction(selectedRequest.id, 'rejected');
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => {
                                        handleChangeAction(selectedRequest.id, 'approved');
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Approve & Apply
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
                        {renderDetailedContent(selectedRequest)}
                    </div>
                </div>
            )}
        </div>
    );
}

function renderDetailedContent(req) {
    const content = req.new_content;
    let parsed = null;

    if (content?.trim().startsWith('{')) {
        try {
            parsed = JSON.parse(content);
        } catch { }
    }

    if (parsed) {
        return (
            <div className="space-y-6">
                {parsed.user_prompt && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400/60 font-black">Context (Prompt)</label>
                            <div className="h-px flex-1 bg-gradient-to-r from-blue-400/20 to-transparent" />
                        </div>
                        <div className="p-5 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-400 leading-relaxed italic text-sm shadow-inner">
                            "{parsed.user_prompt}"
                        </div>
                    </div>
                )}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black">Proposed Story Segment</label>
                        <div className="h-px flex-1 bg-gradient-to-r from-blue-400/40 to-transparent" />
                    </div>
                    <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
                        {parsed.ai_response || parsed.content || content}
                    </div>
                </div>
                {parsed.hint_context && (
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black">System Hints</label>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent" />
                        </div>
                        <div className="p-4 bg-black/40 border border-[#222] rounded-xl text-xs text-gray-500 font-mono leading-loose">
                            {parsed.hint_context}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black">Proposed Edit</label>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-400/40 to-transparent" />
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
                {content}
            </div>
            {req.target_message_id && (
                <div className="flex items-center gap-2 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                    <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Targeting Message #{req.target_message_id}</div>
                </div>
            )}
        </div>
    );
}

function truncateContent(content) {
    if (!content) return "";
    // Try to parse if it looks like JSON (for new_message type)
    if (content.trim().startsWith('{')) {
        try {
            const data = JSON.parse(content);
            return data.user_prompt || data.content || content;
        } catch { }
    }
    return content.length > 200 ? content.slice(0, 200) + '...' : content;
}
