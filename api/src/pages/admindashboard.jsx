import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiHome, FiUsers, FiStar, FiSettings, FiTrendingUp, FiCheck, FiX,
    FiEye, FiEdit2, FiTrash2, FiSearch, FiFilter, FiShield, FiAward,
    FiPhone, FiMail, FiMapPin, FiBriefcase, FiCalendar, FiUser
} from "react-icons/fi";
import { useAuth } from "../context/authcontext.jsx";
import { propertyService } from "../services/propertyservice";
import { reviewService } from "../services/dataservice";
import api from "../services/api";
import "./Dashboard.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDetailModal, setShowUserDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "overview" || activeTab === "properties") {
                const statsRes = await propertyService.getAdminStats();
                setStats(statsRes.stats);
                setProperties(statsRes.recentProperties || []);
            }
            if (activeTab === "users") {
                const usersRes = await api.get("/auth/users");
                setUsers(usersRes.data.users || []);
            }
            if (activeTab === "reviews") {
                const reviewsRes = await reviewService.getPending();
                setPendingReviews(reviewsRes.reviews || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyProperty = async (id) => {
        try {
            await propertyService.verifyProperty(id);
            await fetchData();
        } catch (error) {
            console.error("Error verifying property:", error);
        }
    };

    const handleFeatureProperty = async (id) => {
        try {
            await propertyService.featureProperty(id, 30);
            await fetchData();
        } catch (error) {
            console.error("Error featuring property:", error);
        }
    };

    const handleModerateReview = async (id, status) => {
        try {
                await reviewService.moderate(id, status);
            setPendingReviews(pendingReviews.filter(r => r._id !== id));
        } catch (error) {
            console.error("Error moderating review:", error);
        }
    };

    const handleUpdateUserRole = async (userId, role) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role });
            setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/auth/users/${userToDelete._id}`);
            setUsers(users.filter(u => u._id !== userToDelete._id));
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            alert('User deleted successfully!');
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error.response?.data?.message || 'Error deleting user');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const tabs = [
        { id: "overview", label: "Overview", icon: FiTrendingUp },
        { id: "properties", label: "Properties", icon: FiHome },
        { id: "users", label: "Users", icon: FiUsers },
        { id: "reviews", label: "Reviews", icon: FiStar },
        { id: "settings", label: "Settings", icon: FiSettings },
    ];

    return (
        <div className="dashboard-page admin-dashboard">
            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar admin">
                    <div className="sidebar-header">
                        <div className="user-avatar admin">
                            <FiShield />
                        </div>
                        <h3>{user?.name}</h3>
                        <p>Administrator</p>
                        <span className="user-badge admin">Admin</span>
                    </div>

                    <nav className="sidebar-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="dashboard-content">
                            <h1>Admin Dashboard</h1>
                            <p className="subtitle">Platform overview and statistics</p>

                            {stats && (
                                <>
                                    <div className="stats-grid admin-stats">
                                        <div className="stat-card gradient-blue">
                                            <div className="stat-icon">
                                                <FiHome />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{stats.totalProperties}</span>
                                                <span className="stat-label">Total Properties</span>
                                            </div>
                                        </div>
                                        <div className="stat-card gradient-green">
                                            <div className="stat-icon">
                                                <FiCheck />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{stats.activeProperties}</span>
                                                <span className="stat-label">Active Listings</span>
                                            </div>
                                        </div>
                                        <div className="stat-card gradient-orange">
                                            <div className="stat-icon">
                                                <FiShield />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{stats.verifiedProperties}</span>
                                                <span className="stat-label">Verified</span>
                                            </div>
                                        </div>
                                        <div className="stat-card gradient-purple">
                                            <div className="stat-icon">
                                                <FiStar />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{pendingReviews.length}</span>
                                                <span className="stat-label">Pending Reviews</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-grid">
                                        <div className="dashboard-section">
                                            <h2>Properties by Type</h2>
                                            <div className="chart-placeholder">
                                                {stats.propertyByType?.map((type) => (
                                                    <div key={type._id} className="chart-bar-item">
                                                        <span className="bar-label">{type._id}</span>
                                                        <div className="bar-container">
                                                            <div
                                                                className="bar-fill"
                                                                style={{ width: `${(type.count / stats.totalProperties) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="bar-value">{type.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="dashboard-section">
                                            <h2>Properties by Listing</h2>
                                            <div className="chart-placeholder">
                                                {stats.propertyByListing?.map((type) => (
                                                    <div key={type._id} className="chart-bar-item">
                                                        <span className="bar-label capitalize">{type._id}</span>
                                                        <div className="bar-container">
                                                            <div
                                                                className="bar-fill green"
                                                                style={{ width: `${(type.count / stats.totalProperties) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="bar-value">{type.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="dashboard-section">
                                <div className="section-header">
                                    <h2>Recent Properties</h2>
                                    <button onClick={() => setActiveTab("properties")}>View All</button>
                                </div>
                                <div className="property-table-wrapper">
                                    <table className="property-table">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Owner</th>
                                                <th>Status</th>
                                                <th>Verified</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {properties.map((property) => (
                                                <tr key={property._id}>
                                                    <td>
                                                        <div className="property-cell">
                                                            <span>{property.title}</span>
                                                        </div>
                                                    </td>
                                                    <td>{property.owner?.name}</td>
                                                    <td>
                                                        <span className={`status-badge ${property.status}`}>{property.status}</span>
                                                    </td>
                                                    <td>
                                                        {property.isVerified ? (
                                                            <span className="verified-badge"><FiCheck /> Verified</span>
                                                        ) : (
                                                            <span className="unverified-badge">Pending</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            {!property.isVerified && (
                                                                <button className="btn-icon success" onClick={() => handleVerifyProperty(property._id)}>
                                                                    <FiShield />
                                                                </button>
                                                            )}
                                                            {!property.isFeatured && (
                                                                <button className="btn-icon star" onClick={() => handleFeatureProperty(property._id)}>
                                                                    <FiAward />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <div className="dashboard-content">
                            <h1>User Management</h1>
                            <p className="subtitle">Manage platform users and roles</p>

                            <div className="filter-bar">
                                <div className="search-box">
                                    <FiSearch />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="user">Users</option>
                                    <option value="seller">Sellers</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>

                            <div className="property-table-wrapper full">
                                <table className="property-table users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Contact</th>
                                            <th>Address</th>
                                            <th>Role</th>
                                            <th>Professional Details</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr key={u._id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-small">
                                                            {u.name?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="user-name">{u.name}</span>
                                                            {u.gender && <span className="user-gender">{u.gender}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-info">
                                                        <div className="contact-item">
                                                            <FiMail size={14} />
                                                            <span>{u.email}</span>
                                                        </div>
                                                        {u.phone && (
                                                            <div className="contact-item">
                                                                <FiPhone size={14} />
                                                                <span>{u.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {u.address?.city || u.address?.state ? (
                                                        <div className="address-info">
                                                            <FiMapPin size={14} />
                                                            <span>
                                                                {u.address?.city}
                                                                {u.address?.city && u.address?.state ? ", " : ""}
                                                                {u.address?.state}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                                        className={`role-select ${u.role}`}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="seller">Seller</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    {u.role === "seller" ? (
                                                        <div className="professional-info">
                                                            {u.companyName && (
                                                                <div className="info-item">
                                                                    <FiBriefcase size={14} />
                                                                    <span>{u.companyName}</span>
                                                                </div>
                                                            )}
                                                            {u.reraNumber && (
                                                                <div className="info-item">
                                                                    <FiAward size={14} />
                                                                    <span>{u.reraNumber}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="date-text">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-icon"
                                                            onClick={() => {
                                                                setSelectedUser(u);
                                                                setShowUserDetailModal(true);
                                                            }}
                                                            title="View Details"
                                                        >
                                                            <FiEye />
                                                        </button>
                                                        <button 
                                                            className="btn-icon delete" 
                                                            onClick={() => confirmDeleteUser(u)}
                                                            title="Delete User"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === "reviews" && (
                        <div className="dashboard-content">
                            <h1>Review Moderation</h1>
                            <p className="subtitle">Approve or reject user reviews</p>

                            {pendingReviews.length > 0 ? (
                                <div className="review-moderation-list">
                                    {pendingReviews.map((review) => (
                                        <div key={review._id} className="review-card">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="user-avatar-small">
                                                        {review.user?.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4>{review.user?.name}</h4>
                                                        <p>{review.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                </div>
                                            </div>
                                            <div className="review-property">
                                                <span>Property: {review.property?.title}</span>
                                            </div>
                                            <p className="review-content">{review.comment}</p>
                                            <div className="moderation-actions">
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleModerateReview(review._id, "approved")}
                                                >
                                                    <FiCheck /> Approve
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleModerateReview(review._id, "rejected")}
                                                >
                                                    <FiX /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state large">
                                    <FiStar />
                                    <h3>No pending reviews</h3>
                                    <p>All reviews have been moderated</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* User Detail Modal */}
                {showUserDetailModal && selectedUser && (
                    <div className="modal-overlay" onClick={() => setShowUserDetailModal(false)}>
                        <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>User Details</h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowUserDetailModal(false)}
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Personal Information */}
                                <div className="detail-section">
                                    <h3>Personal Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <label>
                                                <FiUser /> Full Name
                                            </label>
                                            <p>{selectedUser.name}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>
                                                <FiCalendar /> Date of Birth
                                            </label>
                                            <p>
                                                {selectedUser.dateOfBirth
                                                    ? new Date(selectedUser.dateOfBirth).toLocaleDateString()
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                        <div className="detail-item">
                                            <label>Gender</label>
                                            <p>{selectedUser.gender ? selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1) : "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="detail-section">
                                    <h3>Contact Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <label>
                                                <FiMail /> Email
                                            </label>
                                            <p>{selectedUser.email}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>
                                                <FiPhone /> Phone
                                            </label>
                                            <p>{selectedUser.phone || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                {(selectedUser.address?.street ||
                                    selectedUser.address?.city ||
                                    selectedUser.address?.state ||
                                    selectedUser.address?.zipCode) && (
                                    <div className="detail-section">
                                        <h3>Address</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>
                                                    <FiMapPin /> Street
                                                </label>
                                                <p>{selectedUser.address?.street || "-"}</p>
                                            </div>
                                            <div className="detail-item">
                                                <label>City</label>
                                                <p>{selectedUser.address?.city || "-"}</p>
                                            </div>
                                            <div className="detail-item">
                                                <label>State</label>
                                                <p>{selectedUser.address?.state || "-"}</p>
                                            </div>
                                            <div className="detail-item">
                                                <label>Zip Code</label>
                                                <p>{selectedUser.address?.zipCode || "-"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Professional Information */}
                                {selectedUser.role === "seller" && (
                                    <div className="detail-section">
                                        <h3>Professional Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>
                                                    <FiBriefcase /> Company Name
                                                </label>
                                                <p>{selectedUser.companyName || "Not provided"}</p>
                                            </div>
                                            <div className="detail-item">
                                                <label>
                                                    <FiAward /> RERA Number
                                                </label>
                                                <p>{selectedUser.reraNumber || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bio */}
                                {selectedUser.bio && (
                                    <div className="detail-section">
                                        <h3>Bio</h3>
                                        <p className="bio-text">{selectedUser.bio}</p>
                                    </div>
                                )}

                                {/* Account Information */}
                                <div className="detail-section">
                                    <h3>Account Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <label>Role</label>
                                            <p className={`role-badge ${selectedUser.role}`}>{selectedUser.role.toUpperCase()}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>
                                                <FiCalendar /> Joined
                                            </label>
                                            <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>Verified</label>
                                            <p>{selectedUser.isVerified ? <FiCheck className="text-success" /> : "Not Verified"}</p>
                                        </div>
                                        {selectedUser.lastLogin && (
                                            <div className="detail-item">
                                                <label>Last Login</label>
                                                <p>{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={() => setShowUserDetailModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && userToDelete && (
                    <div className="modal-overlay" onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
                        <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header delete-header">
                                <FiTrash2 className="delete-icon" />
                                <h3>Delete User</h3>
                            </div>
                            <div className="modal-body">
                                <p className="warning-text">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                                <div className="user-info-box">
                                    <div className="user-avatar-small">
                                        {userToDelete.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{userToDelete.name}</strong>
                                        <p>{userToDelete.email}</p>
                                        <span className={`role-badge ${userToDelete.role}`}>
                                            {userToDelete.role.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn-danger" 
                                    onClick={handleDeleteUser}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
