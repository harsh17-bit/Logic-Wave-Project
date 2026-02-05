import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiHome, FiBriefcase, FiMapPin, FiFileText, FiAward, FiInfo } from "react-icons/fi";
import { useAuth } from "../context/authcontext.jsx";
import "./Auth.css";

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        name: "",
        email: "",
        phone: "",
        // Authentication
        password: "",
        confirmPassword: "",
        // Profile Details
        dateOfBirth: "",
        gender: "",
        // Address Information
        street: "",
        city: "",
        state: "",
        zipCode: "",
        // Role & Professional
        role: "user",
        companyName: "",
        reraNumber: "",
        bio: "",
        // Legal Agreements
        acceptTerms: false,
        acceptPrivacy: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: "" });
        }
    };

    const validateStep = (currentStep) => {
        const errors = {};

        if (currentStep === 1) {
            // Validate Personal Information
            if (!formData.name.trim()) errors.name = "Name is required";
            if (!formData.email.trim()) errors.email = "Email is required";
            if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
                errors.email = "Please enter a valid email";
            }
            if (!formData.phone) errors.phone = "Phone number is required";
            if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
                errors.phone = "Please enter a valid 10-digit phone number";
            }
        } else if (currentStep === 2) {
            // Validate Password & Profile
            if (!formData.password) errors.password = "Password is required";
            if (formData.password && formData.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }
            if (!formData.confirmPassword) errors.confirmPassword = "Please confirm password";
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
            if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
            if (!formData.gender) errors.gender = "Gender is required";
        } else if (currentStep === 3) {
            // Validate Address
            if (!formData.street.trim()) errors.street = "Street address is required";
            if (!formData.city.trim()) errors.city = "City is required";
            if (!formData.state.trim()) errors.state = "State is required";
            if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required";
            if (formData.zipCode && !/^[0-9]{6}$/.test(formData.zipCode)) {
                errors.zipCode = "Please enter a valid 6-digit zip code";
            }
        } else if (currentStep === 4) {
            // Validate Professional Details
            if (formData.role === "seller") {
                if (!formData.companyName.trim()) errors.companyName = "Company name is required for sellers";
                if (!formData.reraNumber.trim()) errors.reraNumber = "RERA number is required for sellers";
            }
            // Validate Terms Acceptance
            if (!formData.acceptTerms) errors.acceptTerms = "You must accept the Terms of Service";
            if (!formData.acceptPrivacy) errors.acceptPrivacy = "You must accept the Privacy Policy";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(step)) {
            return;
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                },
                companyName: formData.companyName,
                reraNumber: formData.reraNumber,
                bio: formData.bio,
            });
            navigate("/");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-brand">
                        <h1>UrbanStay.com</h1>
                    </div>
                    <h2>Start Your Journey</h2>
                    <p>Join thousands of users finding their perfect property every day.</p>
                    <div className="auth-features">
                        <div className="feature-item">
                            <span className="feature-icon">✨</span>
                            <span>Free Registration</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🎯</span>
                            <span>Personalized Alerts</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">❤️</span>
                            <span>Save Favorites</span>
                        </div>
                    </div>
                    <div className="form-progress-section">
                        <h3>Registration Progress</h3>
                        <div className="progress-steps">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`progress-step ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}>
                                    <span className="step-number">{s}</span>
                                    <div className="step-title">
                                        {s === 1 && "Personal"}
                                        {s === 2 && "Passwor"}
                                        {s === 3 && "Address"}
                                        {s === 4 && "Details"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container multi-step">
                        <div className="form-header">
                            <h2>
                                {step === 1 && "Personal Information"}
                                {step === 2 && "Security & Profile"}
                                {step === 3 && "Address Details"}
                                {step === 4 && "Role & Professional"}
                            </h2>
                            <p>
                                {step === 1 && "Tell us about yourself"}
                                {step === 2 && "Create a secure password and set your profile"}
                                {step === 3 && "Where are you located?"}
                                {step === 4 && "Choose your role and professional details"}
                            </p>
                        </div>

                        {(error || passwordError) && (
                            <div className="auth-error">{error || passwordError}</div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form multi-step-form">
                            {/* Step 1: Personal Information */}
                            {step === 1 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            <FiUser /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            
                                            className={formErrors.name ? "input-error" : ""}
                                        />
                                        {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">
                                            <FiMail /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            
                                            className={formErrors.email ? "input-error" : ""}
                                        />
                                        {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="phone">
                                                <FiPhone /> Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                
                                                pattern="[0-9]{10}"
                                                className={formErrors.phone ? "input-error" : ""}
                                            />
                                            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Password & Profile */}
                            {step === 2 && (
                                <div className="form-step">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="password">
                                                <FiLock /> Password
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className={formErrors.password ? "input-error" : ""}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">
                                                <FiLock /> Confirm Password
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className={formErrors.confirmPassword ? "input-error" : ""}
                                                />
                                            </div>
                                            {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="dateOfBirth">
                                                <FiInfo /> Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className={formErrors.dateOfBirth ? "input-error" : ""}
                                            />
                                            {formErrors.dateOfBirth && <span className="error-text">{formErrors.dateOfBirth}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="gender">Gender</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className={formErrors.gender ? "input-error" : ""}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {formErrors.gender && <span className="error-text">{formErrors.gender}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Address */}
                            {step === 3 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label htmlFor="street">
                                            <FiMapPin /> Street Address
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            placeholder="123 Main Street"
                                            className={formErrors.street ? "input-error" : ""}
                                        />
                                        {formErrors.street && <span className="error-text">{formErrors.street}</span>}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="New York"
                                                className={formErrors.city ? "input-error" : ""}
                                            />
                                            {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="NY"
                                                className={formErrors.state ? "input-error" : ""}
                                            />
                                            {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="zipCode">Zip Code</label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                placeholder="100001"
                                                pattern="[0-9]{6}"
                                                className={formErrors.zipCode ? "input-error" : ""}
                                            />
                                            {formErrors.zipCode && <span className="error-text">{formErrors.zipCode}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Role & Professional */}
                            {step === 4 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label>You want to</label>
                                        <div className="role-selector">
                                            <button
                                                type="button"
                                                className={`role-option ${formData.role === "user" ? "active" : ""}`}
                                                onClick={() => setFormData({ ...formData, role: "user" })}
                                            >
                                                <FiHome />
                                                <span>Buy/Rent Property</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`role-option ${formData.role === "seller" ? "active" : ""}`}
                                                onClick={() => setFormData({ ...formData, role: "seller" })}
                                            >
                                                <FiBriefcase />
                                                <span>Sell/List Property</span>
                                            </button>
                                        </div>
                                    </div>

                                    {formData.role === "seller" && (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="companyName">
                                                    <FiBriefcase /> Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    placeholder="Your Company Name"
                                                    className={formErrors.companyName ? "input-error" : ""}
                                                />
                                                {formErrors.companyName && <span className="error-text">{formErrors.companyName}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="reraNumber">
                                                    <FiAward /> RERA Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="reraNumber"
                                                    name="reraNumber"
                                                    value={formData.reraNumber}
                                                    onChange={handleChange}
                                                    placeholder="RERA Registration Number"
                                                    className={formErrors.reraNumber ? "input-error" : ""}
                                                />
                                                {formErrors.reraNumber && <span className="error-text">{formErrors.reraNumber}</span>}
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="bio">
                                            <FiFileText /> Bio (Optional)
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us about yourself..."
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-wrapper">
                                            <input 
                                                type="checkbox" 
                                                name="acceptTerms"
                                                checked={formData.acceptTerms}
                                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                            />
                                            <span>
                                                I agree to the{" "}
                                                <Link to="/terms-of-service" target="_blank">Terms of Service</Link>
                                            </span>
                                        </label>
                                        {formErrors.acceptTerms && <span className="error-text">{formErrors.acceptTerms}</span>}

                                        <label className="checkbox-wrapper">
                                            <input 
                                                type="checkbox" 
                                                name="acceptPrivacy"
                                                checked={formData.acceptPrivacy}
                                                onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                                            />
                                            <span>
                                                I have read and accept the{" "}
                                                <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
                                            </span>
                                        </label>
                                        {formErrors.acceptPrivacy && <span className="error-text">{formErrors.acceptPrivacy}</span>}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="form-navigation">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        className="auth-button secondary"
                                        onClick={handlePrevStep}
                                    >
                                        Previous
                                    </button>
                                )}

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        className="auth-button"
                                        onClick={handleNextStep}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="auth-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading-spinner"></span>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                        <p className="auth-switch">
                            Already have an account?{" "}
                            <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
