import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome, FiUser, FiBriefcase, FiShield } from "react-icons/fi";
import { useAuth } from "../context/authcontext.jsx";
import "./Auth.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRole] = useState("buyer"); // buyer, seller, admin
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { id: "buyer", label: "Buyer/Renter", icon: <FiUser />, color: "from-blue-500 to-indigo-600" },
        { id: "seller", label: "Agent/Seller", icon: <FiBriefcase />, color: "from-[var(--emerald)] to-[var(--pacific-cyan)]" },
        { id: "admin", label: "Admin", icon: <FiShield />, color: "from-purple-600 to-indigo-700" }
    ];

    /* const demoCredentials = {
        buyer: { email: "buyer@example.com", password: "password123" },
        seller: { email: "seller@example.com", password: "password123" },
        admin: { email: "admin@example.com", password: "password123" }
    };*/

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login(formData);
            const userRole = response?.user?.role || activeRole;

            if (userRole === "admin" || userRole === "seller") {
                // Ensure we prefer the specific dashboard routes if available, 
                // but /dashboard with DashboardRouter is also fine.
                // Let's stick to /dashboard as it handles the logic.
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const activeRoleData = roles.find(r => r.id === activeRole);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className={`auth-left ${activeRole}-theme`}>
                    <div className="auth-brand">
                        <h1>UrbanStay.com</h1>
                    </div>

                    <div className="auth-welcome-content">
                        <h2>
                            {activeRole === "buyer" && "Find Your Dream Home"}
                            {activeRole === "seller" && "Sell With Confidence"}
                            {activeRole === "admin" && "Manage Platform"}
                        </h2>
                        <p>
                            {activeRole === "buyer" && "Discover thousands of premium properties. Buy, rent, and move in today."}
                            {activeRole === "seller" && "Reach millions of buyers. List your property and close deals faster."}
                            {activeRole === "admin" && "Oversee operations, manage users, and ensure platform quality."}
                        </p>
                    </div>

                    <div className="auth-features">
                        <div className="feature-item">
                            <span className="feature-icon"><svg fill="#190fdd" width="30" height="30" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m4e2 565.31c3.3008.007812 6.4688-1.293 8.8164-3.6133l60.512-60.07v-.003906c9.4648-9.0391 15.422-21.141 16.816-34.152 1.3984-13.016-1.8594-26.102-9.1875-36.945-8.5547-11.895-21.535-19.84-36.02-22.043-14.48-2.1992-29.238 1.5273-40.938 10.344-11.695-8.8164-26.453-12.547-40.934-10.348-14.477 2.1953-27.461 10.133-36.016 22.023-7.3359 10.844-10.594 23.934-9.1953 36.949 1.3945 13.016 7.3555 25.117 16.82 34.156l60.504 60.07.003906.003906c2.3398 2.332 5.5117 3.6367 8.8164 3.6289zm-64.207-125.57c6.5898-9.2695 16.957-15.129 28.293-15.996 1.0547-.085938 2.1016-.13281 3.1484-.13281v-.003907c10.207-.019531 20.008 4.0039 27.254 11.195l5.5117 5.5117 5.5117-5.5117h-.003907c8.0547-7.9648 19.191-12.004 30.477-11.051 11.285.94922 21.59 6.7969 28.195 15.996 5.1406 7.793 7.3594 17.156 6.2656 26.43-1.0977 9.2734-5.4336 17.863-12.25 24.25l-58.195 57.82-58.254-57.82c-6.8164-6.3867-11.152-14.98-12.242-24.258-1.0898-9.2773 1.1406-18.641 6.2891-26.43z"/><path d="m633.8 387.73-228.29-221.68c-3.0508-2.9609-7.9023-2.9609-10.957.0l-228.29 221.68c-1.6445 1.5977-2.5117 3.8359-2.375 6.125.14062 2.2891 1.2734 4.4062 3.1016 5.793l39.656 30.262c3.0234 2.3008 7.2578 2.1133 10.07-.44141l183.29-166.52 183.28 166.49c2.8125 2.5547 7.0469 2.7422 10.07.4375l39.699-30.23v.003906c1.8242-1.3867 2.957-3.5039 3.0938-5.793.13672-2.293-.73047-4.5273-2.3789-6.125zm-44.766 25.648-183.74-166.89c-3-2.7227-7.5781-2.7227-10.582.0l-183.74 166.89-27.215-20.723 216.25-209.98 216.24 209.98z"/><path d="m573.18 447.23c-4.3477.0-7.8711 3.5234-7.8711 7.8711v165.31h-330.62v-165.31c0-4.3477-3.5273-7.8711-7.875-7.8711s-7.8711 3.5234-7.8711 7.8711v173.19c0 2.0859.82812 4.0898 2.3047 5.5664 1.4766 1.4727 3.4805 2.3047 5.5664 2.3047h346.37c2.0859.0 4.0898-.83203 5.5664-2.3047 1.4766-1.4766 2.3047-3.4805 2.3047-5.5664v-173.19c0-2.0859-.82813-4.0898-2.3047-5.5664-1.4766-1.4766-3.4805-2.3047-5.5664-2.3047z"/><path d="m242.56 289.79c2.0859.0 4.0898-.82812 5.5664-2.3047s2.3047-3.4766 2.3047-5.5664v-78.719h39.359v15.742c0 4.3477 3.5273 7.8711 7.875 7.8711s7.8711-3.5234 7.8711-7.8711v-23.617c0-2.0859-.83203-4.0898-2.3047-5.5664-1.4766-1.4727-3.4805-2.3047-5.5664-2.3047h-55.105c-4.3477.0-7.8711 3.5234-7.8711 7.8711v86.594c0 2.0898.82812 4.0898 2.3047 5.5664 1.4766 1.4766 3.4766 2.3047 5.5664 2.3047z"/></g></svg></span>
                            <span>150+ Properties</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon"><svg fill="#190fdd" width="30" height="30" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m267.5 344.12c-19.773.0-35.852 16.086-35.852 35.852v198.75c0 19.773 16.078 35.855 35.852 35.855h265.01c19.773.0 35.855-16.086 35.855-35.855v-198.75c0-19.77-16.082-35.852-35.855-35.852zm265.01 278.27H267.5c-24.066.0-43.656-19.586-43.656-43.66V379.98c0-24.07 19.586-43.656 43.656-43.656h265.01c24.066.0 43.656 19.582 43.656 43.656v198.75c0 24.07-19.586 43.66-43.656 43.66z"/><path d="m479.27 344.12c-2.1523.0-3.9023-1.7461-3.9023-3.8984l-.019532-37.055c-.007812-.097657-.007812-.19531-.007812-.29688v-21.199c0-41.383-33.801-75.055-75.355-75.055-41.43.0-75.242 33.574-75.352 74.84v58.762c0 2.1523-1.75 3.8984-3.9023 3.8984s-3.9023-1.7461-3.9023-3.8984v-58.773c.13281-45.566 37.43-82.633 83.156-82.633 45.848.0 83.156 37.172 83.156 82.855v20.91c.007813.097656.007813.19531.007813.28906l.019531 37.344c0 2.1562-1.7461 3.9023-3.8984 3.9023z"/><path d="m299.53 344.12c-2.1523.0-3.9023-1.7461-3.9023-3.8984v-58.609c0-2.1523 1.75-3.9023 3.9023-3.9023s3.8984 1.75 3.8984 3.9023v58.609c0 2.1523-1.7461 3.8984-3.8984 3.8984z"/><path d="m500.44 285.58c-2.1523.0-3.9023-1.75-3.9023-3.9023.0-53.078-43.32-96.254-96.555-96.254s-96.559 43.18-96.559 96.254c0 2.1523-1.7461 3.9023-3.8984 3.9023-2.1523.0-3.9023-1.75-3.9023-3.9023.0-57.379 46.816-104.06 104.36-104.06 57.547.0 104.36 46.68 104.36 104.06.0 2.1523-1.75 3.9023-3.9023 3.9023z"/><path d="m500.47 344.12c-2.1523.0-3.9023-1.7461-3.9023-3.8984l-.03125-58.543c0-2.1562 1.75-3.9023 3.9023-3.9062 2.1523.0 3.9023 1.7461 3.9023 3.9023l.027344 58.543c0 2.1562-1.7461 3.9023-3.8984 3.9023z"/><path d="m379.73 550.17h40.547l-7.6328-68.773c-.18359-1.6758.73047-3.2852 2.2656-3.9844 12.844-5.8398 21.145-18.727 21.145-32.832.0-19.879-16.172-36.051-36.047-36.051-19.883.0-36.055 16.172-36.055 36.051.0 14.105 8.2969 26.992 21.145 32.832 1.5312.69922 2.4492 2.3086 2.2656 3.9844zm44.902 7.8008H375.37c-1.1055.0-2.1602-.47266-2.9062-1.3008-.73828-.82812-1.0977-1.9258-.97266-3.0312l7.8086-70.395c-14.148-7.5938-23.152-22.469-23.152-38.664.0-24.18 19.68-43.848 43.855-43.848 24.18.0 43.848 19.668 43.848 43.848.0 16.199-9 31.074-23.156 38.664l7.8047 70.395c.12109 1.1016-.22656 2.2031-.96875 3.0312-.73828.82812-1.793 1.3008-2.9062 1.3008z"/></g></svg></span>
                            <span>Verified Listings</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon"><svg fill="#190fdd" width="30" height="30" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m287.48 551.14c-2.2383.0-5.0391.0-7.8359-1.1211l-1.6797-.55859c-7.2773-3.918-12.316-11.754-12.316-19.59v-52.621c-32.469-6.1562-57.098-34.707-57.098-68.293v-90.688c0-38.066 31.348-69.414 69.414-69.414h244.07c38.066.0 69.414 31.348 69.414 69.414v91.246c0 38.066-31.348 69.414-69.414 69.414h-151.7l-67.734 66.055c-3.918 3.918-8.9531 6.1562-15.113 6.1562zm-2.2383-16.793h2.2383c1.1211.0 2.2383-.55859 3.3594-1.1211l72.773-71.652h158.42c29.109.0 52.621-23.512 52.621-52.621l-.003906-90.684c0-29.109-23.512-52.621-52.621-52.621h-244.07c-29.109.0-52.621 23.512-52.621 52.621v91.246c0 27.988 21.273 50.941 49.262 52.621l7.8359.55859v67.734c0 1.1172 1.1211 2.7969 2.8008 3.918zm97.961-106.92c-6.7188.0-12.875-2.8008-17.914-7.2773l-41.984-41.984c-10.078-10.078-10.078-26.309.0-36.387 4.4766-4.4766 11.195-7.2773 17.914-7.2773s12.875 2.2383 17.914 7.2773l24.07 24.629 58.777-58.777c5.0391-5.0391 11.195-7.8359 17.914-7.8359s12.875 2.8008 17.914 7.8359c5.0391 4.4766 7.8359 11.195 7.8359 17.914s-2.8008 13.434-7.8359 18.473l-76.129 76.133c-4.4805 5.0352-11.199 7.2773-18.477 7.2773zm-41.422-75.574c-2.2383.0-4.4766.55859-6.1562 2.2383-3.918 3.918-3.918 8.957.0 12.875l41.984 41.984c3.3594 3.3594 9.5156 2.8008 12.316.0l76.691-77.25c1.6797-1.6797 2.8008-3.918 2.8008-6.1562s-1.1211-4.4766-2.8008-5.5977l-.55859-.55859c-3.3594-3.3594-8.3984-3.3594-11.754.0l-71.102 70.531-35.266-35.828c-1.6797-1.6758-3.918-2.2383-6.1562-2.2383z"/><path d="m4e2 648.54c-137.15.0-248.55-111.39-248.55-248.54S262.85 151.45 4e2 151.45 648.54 262.85 648.54 4e2 537.15 648.54 4e2 648.54zm0-480.3c-127.63.0-231.75 104.12-231.75 231.75S272.37 631.74 4e2 631.74s231.75-104.12 231.75-231.75S527.63 168.24 4e2 168.24z"/></g></svg></span>
                            <span>Direct Contact</span>
                        </div>
                    </div>

                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h2>Welcome Back</h2>
                            
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group slide-in-1">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group slide-in-2">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <div className="form-options slide-in-3">
                                <label className="checkbox-wrapper">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" className={`auth-button slide-in-4 bg-gradient-to-r ${activeRoleData.color}`} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                        <p className="auth-switch">
                            Don't have an account?{" "}
                            <Link to="/register">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
