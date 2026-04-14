import React, { useState } from 'react';
import { Lock, Send, CheckCircle, RefreshCw } from 'lucide-react';

export default function AccessRequestModal({ isOpen, storyHash, onRequestAccess, token, isPending }) {
    const [accessType, setAccessType] = useState('view'); // 'view' or 'collaborate'
    const [status, setStatus] = useState(isPending ? 'pending-approval' : 'idle'); // 'idle', 'submitting', 'success', 'error', 'pending-approval'
    const [errorMsg, setErrorMsg] = useState('');

    const [submittedType, setSubmittedType] = useState(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            window.location.href = '/app';
        }
    };

    const handleSubmit = async () => {
        setStatus('submitting');
        setErrorMsg('');
        setSubmittedType(accessType);

        try {
            const API_BASE = "http://localhost:8000/api";
            const res = await fetch(`${API_BASE}/stories/hash/${storyHash}/request_access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ access_type: accessType })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400 && data.detail === "Owner already has access") {
                    throw new Error("You are the owner of this story.");
                }
                throw new Error(data.detail || "Failed to request access");
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
            setSubmittedType(null); // Allow retry on error
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-300"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-[#1a1a1a] border border-[#333] rounded-3xl w-full max-w-md p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center transform transition-all animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {status === 'success' || status === 'pending-approval' ? (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
                            <CheckCircle size={40} className={`transform transition-all duration-700 ${status === 'success' ? 'scale-110 text-green-500' : 'text-blue-500'}`} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">
                            {status === 'success' ? 'Request Sent' : 'Request Pending'}
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                            {status === 'success'
                                ? `Your request to ${submittedType} this story has been sent. Please wait for the owner's approval.`
                                : "You have already requested access to this story. Our team (the owner) is reviewing your request."
                            }
                        </p>
                        <button
                            onClick={() => window.location.href = '/app'}
                            className="w-full px-6 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-[1.02]"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Lock size={40} className="text-red-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">Access Required</h2>
                        <p className="text-gray-400 mb-10 leading-relaxed">
                            You need permission to access this story. Choose your access level below.
                        </p>

                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex gap-4 mb-10">
                            <button
                                onClick={() => setAccessType('view')}
                                disabled={status === 'submitting'}
                                className={`flex-1 p-5 rounded-2xl border transition-all duration-200 group ${accessType === 'view'
                                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white scale-[1.05]'
                                    : 'bg-[#222] border-[#333] text-gray-500 hover:border-[#444] hover:bg-[#252525]'
                                    }`}
                            >
                                <div className="font-bold text-lg mb-1">View</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Read Only</div>
                            </button>

                            <button
                                onClick={() => setAccessType('collaborate')}
                                disabled={status === 'submitting'}
                                className={`flex-1 p-5 rounded-2xl border transition-all duration-200 group ${accessType === 'collaborate'
                                    ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white scale-[1.05]'
                                    : 'bg-[#222] border-[#333] text-gray-500 hover:border-[#444] hover:bg-[#252525]'
                                    }`}
                            >
                                <div className="font-bold text-lg mb-1">Collab</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Edit Access</div>
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={status === 'submitting'}
                            className="w-full py-5 bg-white text-black font-extrabold text-lg rounded-2xl hover:bg-gray-100 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <RefreshCw className="animate-spin" size={22} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={22} />
                                    Request Access
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => window.location.href = '/app'}
                            className="mt-8 text-gray-600 text-sm hover:text-gray-400 font-medium transition-colors"
                        >
                            Nevermind, go back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
