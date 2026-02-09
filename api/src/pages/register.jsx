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
                            <span><svg fill="#08808D" width="30" height="30" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m480.45 522.57c-3.9336-.18359-7.125-3.2422-7.4766-7.1641-7.3203-81.238-52.508-125.95-138.07-137.76-4.3477.0-7.875-3.5234-7.875-7.8711.0-4.3477 3.5273-7.8711 7.875-7.8711 88.48-7.8711 133.82-52.98 137.68-137.45h-.003906c-.36719-4.3477 2.8555-8.1719 7.2031-8.543 4.3477-.36719 8.1719 2.8555 8.543 7.2031 19.68 89.27 64.707 134.61 137.6 138.7v.003906c4.3477-.15234 7.9961 3.2461 8.1484 7.5938.15234 4.3477-3.25 7.9961-7.5977 8.1484-77.305 9.8398-122.49 55.105-138.07 138.47-.66406 3.8477-4.0469 6.6289-7.9531 6.5352zM377.17 370.72c55.105 17.082 90.449 52.742 104.78 106.59 18.262-54.16 52.664-89.82 102.73-106.43-47.23-14.328-81.398-50.223-101.47-107.14-12.832 55.969-48.336 91.867-106.04 106.98z"/><path d="m274.05 394.09c-3.9336-.17969-7.1289-3.2422-7.4805-7.1641-4.8789-54.633-35.266-84.859-92.891-92.574h.003907c-4.3477.0-7.875-3.5234-7.875-7.8711s3.5273-7.8711 7.875-7.8711c59.434-5.4336 89.742-35.582 92.574-92.262-.37109-4.3477 2.8555-8.1719 7.2031-8.5391 4.3477-.37109 8.1719 2.8516 8.5391 7.1992 13.305 60.223 43.531 90.844 92.418 93.52 4.3477-.14844 7.9961 3.25 8.1484 7.5977s-3.25 7.9961-7.5977 8.1484c-51.953 6.6914-82.34 37.234-93.047 93.441-.72656 3.7539-4.0469 6.4453-7.8711 6.375zm-62.977-106.75v.003906c30.832 10.105 54.895 34.465 64.629 65.414 10.555-29.863 33.523-53.691 62.977-65.336-27.918-10.496-48.57-32.379-61.953-65.652-8.7188 31.777-33.453 56.664-65.18 65.574z"/><path d="m368.51 621.05c-3.9336-.18359-7.1289-3.2422-7.4805-7.1641-3.7773-41.801-27.078-65.023-71.242-70.848v-.003906c-4.3477.0-7.8711-3.5234-7.8711-7.8711s3.5234-7.8711 7.8711-7.8711c45.578-4.1719 68.723-27.238 70.848-70.848-.36719-4.3477 2.8555-8.1719 7.2031-8.543 4.3477-.36719 8.1719 2.8555 8.543 7.2031 10.234 46.289 33.379 69.824 70.848 71.871 4.3477-.15234 7.9961 3.25 8.1484 7.5977.15234 4.3477-3.25 7.9961-7.5977 8.1484-39.91 5.2734-63.527 28.734-71.398 71.871-.69141 3.7891-4.0234 6.5195-7.8711 6.457zm-44.32-85.258c21 8.25 37.492 25.055 45.344 46.211 8.4023-20.602 24.414-37.176 44.711-46.289-20.023-9.2695-35.699-25.906-43.77-46.445-7.3203 21.883-24.441 39.094-46.285 46.523z"/></g></svg></span>
                            <span>Free Registration</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon"><svg fill="#08808D" width="30" height="30" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m639.48 218.48c-1.043-3.3281-3.8477-5.8047-7.2773-6.4219l-37.5-6.7578-6.7578-37.496c-.62109-3.4336-3.0898-6.2383-6.4219-7.2773-3.3281-1.043-6.957-.15234-9.4258 2.3125l-46.449 46.449c-38.676-25.883-83.609-39.527-130.48-39.527-62.793.0-121.82 24.449-166.22 68.848-44.398 44.398-68.855 103.43-68.855 166.22.0 62.789 24.449 121.82 68.855 166.22 44.398 44.398 103.43 68.848 166.22 68.848 62.789.0 121.82-24.449 166.22-68.848 44.398-44.398 68.855-103.43 68.855-166.22.0-46.863-13.645-91.797-39.527-130.48l46.449-46.449c2.4688-2.4609 3.3594-6.0898 2.3164-9.4219zM431.31 404.84c0 19.926-16.211 36.137-36.137 36.137s-36.137-16.211-36.137-36.137 16.211-36.137 36.137-36.137c6.5703.0 12.727 1.7695 18.039 4.8438l-24.664 24.664c-3.6562 3.6562-3.6562 9.5938.0 13.25 1.832 1.832 4.2305 2.7461 6.6289 2.7461s4.7969-.91406 6.6289-2.7461l24.664-24.664c3.0703 5.3164 4.8398 11.473 4.8398 18.043zM426.7592 360c-8.9375-6.3125-19.832-10.043-31.586-10.043-30.262.0-54.879 24.617-54.879 54.879s24.617 54.879 54.879 54.879 54.879-24.617 54.879-54.879c0-11.754-3.7266-22.645-10.039-31.582l28.508-28.508c-5.9258 9.0898-7.0312 20.371-2.6992 30.832 4.9844 12.035 15.824 19.758 28.617 20.562v17.398c-12.793.80859-23.637 8.5352-28.617 20.566-4.9805 12.035-2.7812 25.16 5.6953 34.777l-12.301 12.301c-9.6211-8.4766-22.746-10.68-34.777-5.6953-12.035 4.9844-19.758 15.824-20.566 28.617h-17.398c-.80859-12.809-8.5273-23.652-20.555-28.637-12.027-4.9844-25.16-2.7773-34.789 5.7148l-12.301-12.301c8.4766-9.6211 10.68-22.746 5.6953-34.777-4.9844-12.035-15.824-19.758-28.617-20.566v-17.398c12.793-.80859 23.633-8.5273 28.617-20.562 4.9844-12.035 2.7812-25.16-5.6953-34.777l12.301-12.301c9.6211 8.4766 22.746 10.68 34.777 5.6953 12.035-4.9844 19.758-15.824 20.566-28.621h17.398c.80859 12.793 8.5352 23.637 20.566 28.621 10.461 4.3281 21.742 3.2266 30.832-2.7031zm44.176-46.293c-3.1172-3.1172-7.2617-4.832-11.672-4.832-4.4102.0-8.5547 1.7148-11.672 4.832-4.3281 4.3359-10.309 5.5156-15.98 3.1641-5.6797-2.3516-9.0625-7.4141-9.0625-13.539.0-9.1016-7.4062-16.512-16.512-16.512h-21.727c-9.1016.0-16.504 7.4062-16.504 16.512.0 6.125-3.3906 11.188-9.0625 13.539-5.6797 2.3516-11.652 1.1719-15.98-3.1641-3.1172-3.1172-7.2617-4.832-11.672-4.832-4.4102.0-8.5547 1.7148-11.672 4.832l-15.367 15.367c-3.1172 3.1172-4.832 7.2617-4.832 11.672.0 4.4141 1.7148 8.5547 4.832 11.672 4.3281 4.3281 5.5156 10.309 3.1641 15.984-2.3516 5.6797-7.4102 9.0625-13.539 9.0625-9.1016.0-16.512 7.4062-16.512 16.512v21.727c0 9.1055 7.4062 16.512 16.512 16.512 6.125.0 11.188 3.3906 13.539 9.0625 2.3516 5.6797 1.1719 11.652-3.1641 15.98-3.1172 3.1172-4.832 7.2617-4.832 11.672.0 4.4141 1.7148 8.5547 4.832 11.672l15.359 15.367c3.1172 3.1172 7.2617 4.832 11.672 4.832s8.5547-1.7148 11.672-4.832c4.3398-4.3398 10.316-5.5312 15.992-3.1797 5.6719 2.3516 9.0586 7.4141 9.0586 13.555.0 9.1016 7.4062 16.512 16.504 16.512h21.727c9.1016.0 16.512-7.4062 16.512-16.512.0-6.125 3.3906-11.188 9.0625-13.539 5.6797-2.3516 11.652-1.1719 15.98 3.1641 3.1172 3.1172 7.2617 4.832 11.672 4.832 4.4102.0 8.5547-1.7148 11.672-4.832l15.359-15.367c3.1172-3.1172 4.8398-7.2617 4.8398-11.672s-1.7148-8.5547-4.832-11.672c-4.3281-4.3281-5.5156-10.309-3.1641-15.98 2.3516-5.6797 7.4102-9.0625 13.539-9.0625 9.1016.0 16.512-7.4062 16.512-16.512v-21.727c0-9.1016-7.4062-16.512-16.512-16.512-6.125.0-11.188-3.3906-13.539-9.0625-2.3516-5.6797-1.1719-11.652 3.1641-15.98 3.1172-3.1172 4.8398-7.2617 4.8398-11.672.0-4.4102-1.7148-8.5547-4.832-11.672l-1.0547-1.0547 18.629-18.629c22.414 25.5 36.031 58.914 36.031 95.449.0 79.812-64.93 144.74-144.74 144.74s-144.74-64.93-144.74-144.74 64.93-144.74 144.74-144.74c36.543.0 69.957 13.617 95.457 36.031l-18.629 18.629zm140.57 91.133c0 119.29-97.047 216.33-216.33 216.33-119.29.0-216.33-97.047-216.33-216.33-.003906-119.28 97.039-216.33 216.32-216.33 41.879.0 82.074 11.836 116.94 34.316l-3.7227 3.7227c-2.1719 2.1719-3.1367 5.2695-2.5977 8.2852l7.043 39.078-8.9492 8.9492c-28.91-25.801-67.016-41.508-108.72-41.508-90.145.0-163.48 73.336-163.48 163.48s73.336 163.48 163.48 163.48c90.148.0 163.49-73.332 163.49-163.48.0-41.707-15.707-79.812-41.508-108.72l8.9492-8.9492 39.078 7.043c.55469.10156 1.1133.14844 1.6641.14844 2.4609.0 4.8555-.97266 6.6289-2.7461l3.7227-3.7227c22.48 34.879 34.32 75.074 34.32 116.95zm-47.832-129.94-32.676-5.8867-5.8867-32.676 47.566-47.566 4.7344 26.266c.69141 3.8516 3.7109 6.8633 7.5625 7.5625l26.266 4.7344z"/></svg></span>
                            <span>Personalized Alerts</span>
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
