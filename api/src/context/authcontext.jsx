import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authservice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await authService.getMe();
                    setUser(response.user);
                } catch (err) {
                    // Token invalid - clear storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authService.register(userData);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authService.login(credentials);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            setError(null);
            const response = await authService.updateProfile(data);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
            throw err;
        }
    };

    const toggleFavorite = async (propertyId) => {
        try {
            const response = await authService.toggleFavorite(propertyId);
            // Update user favorites in state
            const updatedUser = await authService.getMe();
            setUser(updatedUser.user);
            return response;
        } catch (err) {
            throw err;
        }
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "admin";
    const isSeller = user?.role === "seller" || user?.role === "admin";

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isSeller,
        register,
        login,
        logout,
        updateProfile,
        toggleFavorite,
        setError,
    };

    console.log('AuthProvider rendering, loading:', loading);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
