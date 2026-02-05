import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiHome, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import authService from "../services/authservice";
import "./Auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");
    const [resetToken, setResetToken] = useState(""); // Only for demo/dev purposes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await authService.forgotPassword(email);
            setIsSent(true);
            // In a real app, we wouldn't return the token. 
            // But for this project's convenience, we display it.
            if (response.resetToken) {
                setResetToken(response.resetToken);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left buyer-theme">
                    <div className="auth-brand">
                        <h1>UrbanStay.com</h1>
                    </div>

                    <div className="auth-welcome-content">
                        <h2>Recover Your Account</h2>
                        <p>Don't worry, it happens to the best of us. We'll help you get back in.</p>
                    </div>

                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        {!isSent ? (
                            <>
                                <div className="auth-header text-center">
                                    <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                                    <p className="text-gray-500">Enter your email and we'll send you a reset link.</p>
                                </div>

                                {error && <div className="auth-error mb-4">{error}</div>}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-group mb-6">
                                        <label htmlFor="email">Email Address</label>
                                        <div className="input-wrapper">

                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-button bg-gradient-to-r from-blue-500 to-indigo-600"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="loading-spinner"></span> : "Send Reset Link"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                                <p className="text-gray-500 mb-6">
                                    We've sent a password reset link to <strong>{email}</strong>.
                                </p>

                                {resetToken && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-left">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Development Demo Mode:</p>
                                        <p className="text-sm text-gray-700 mb-3">Since email sending is currently mocked, use this link to reset:</p>
                                        <Link
                                            to={`/reset-password/${resetToken}`}
                                            className="text-blue-600 font-semibold break-all hover:underline"
                                        >
                                            {window.location.origin}/reset-password/{resetToken}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <Link to="/login" className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                <FiArrowLeft />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
