import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import crocImg from "../image/logincroc.png";

export default function Login({ onLoginSuccess }) {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
        const payload = isRegister
            ? { email, password, name }
            : { email, password };

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Authentication failed");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);

            // Fetch user info
            const userResponse = await fetch("http://localhost:8000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                onLoginSuccess(userData, data.access_token);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a1a]">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 mt-18">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md p-8 border border-gray-700 rounded-xl bg-[#0a0a1a]">
                        {/* Welcome Text */}
                        <h2 className="text-gray-400 text-lg mb-2">Welcome !</h2>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isRegister ? "Create Account" : "Sign in to"}
                        </h1>
                        <p className="text-gray-500 mb-8">
                            {isRegister
                                ? "Join Mythos AI and start creating amazing stories"
                                : "Your AI-powered storytelling journey"}
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 border border-red-500/40 bg-red-500/10 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field (Register Only) */}
                            {isRegister && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        User name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-gray-400 transition placeholder-gray-500"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    {isRegister ? "Email" : "User name"}
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-gray-400 transition placeholder-gray-500"
                                        placeholder={isRegister ? "Enter your email" : "Enter your user name"}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-gray-400 transition placeholder-gray-500"
                                        placeholder="Enter your Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            {!isRegister && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 border-gray-600 rounded accent-white bg-transparent"
                                        />
                                        <span className="text-sm text-gray-400">Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Forgot Password ?
                                    </button>
                                </div>
                            )}

                            {/* Submit Button - Dark/Black like Figma */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gray-900 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Please wait..."
                                    : isRegister
                                        ? "Register"
                                        : "Login"}
                            </button>
                        </form>

                        {/* Toggle Register/Login */}
                        <p className="text-center text-gray-400 text-sm mt-8">
                            {isRegister ? "Already have an Account ?" : "Don't have an Account ?"}{" "}
                            <button
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError("");
                                }}
                                className="text-white font-semibold hover:underline"
                            >
                                {isRegister ? "Sign In" : "Register"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Illustration (no box, just background) */}
            <div className="hidden lg:flex w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-2xl">
                    <img
                        src={crocImg}
                        alt="Illustration"
                        className="w-full h-auto scale-105"
                    />
                </div>
            </div>
        </div>
    );
}
