import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiHome, FiCheckCircle } from "react-icons/fi";
import authService from "../services/authservice";
import "./Auth.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await authService.resetPassword(token, password);
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired reset token.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left admin-theme">
                    <div className="auth-brand">
                        <h1>UrbanStay.com</h1>
                    </div>

                    <div className="auth-welcome-content">
                        <h2>Secure Your Account</h2>
                        <p>Create a strong password that you haven't used before to keep your account safe.</p>
                    </div>

                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        {!isSuccess ? (
                            <>
                                <div className="auth-header text-center">
                                    <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                                    <p className="text-gray-500">Please enter your new password below.</p>
                                </div>

                                {error && <div className="auth-error mb-4">{error}</div>}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-group mb-4">
                                        <label htmlFor="new-password">New Password</label>
                                        <div className="input-wrapper">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="new-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group mb-6">
                                        <label htmlFor="confirm-password">Confirm New Password</label>
                                        <div className="input-wrapper">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="confirm-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-button bg-gradient-to-r from-purple-600 to-indigo-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="loading-spinner"></span> : "Update Password"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
                                <p className="text-gray-500">
                                    Your password has been reset successfully. Redirecting you to the login page...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
