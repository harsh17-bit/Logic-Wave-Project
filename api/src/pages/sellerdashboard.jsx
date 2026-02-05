import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiHome, FiPlus, FiMessageSquare, FiBarChart2, FiSettings,
    FiEdit2, FiTrash2, FiEye, FiTrendingUp, FiUsers, FiDollarSign, FiCheck, FiX
} from "react-icons/fi";
import { useAuth } from "../context/authcontext.jsx";
import { propertyService } from "../services/propertyservice";
import { inquiryService } from "../services/dataservice";
import "./Dashboard.css";

const SellerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [properties, setProperties] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [respondingTo, setRespondingTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [propertiesRes, inquiriesRes] = await Promise.all([
                propertyService.getMyProperties(),
                inquiryService.getReceived(),
            ]);
            setProperties(propertiesRes.properties || []);
            setStats(propertiesRes.stats || []);
            setInquiries(inquiriesRes.inquiries || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (id) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                await propertyService.deleteProperty(id);
                setProperties(properties.filter(p => p._id !== id));
            } catch (error) {
                console.error("Error deleting property:", error);
            }
        }
    };

    const handleOpenReply = (inquiry) => {
        setRespondingTo(inquiry);
        setReplyMessage("");
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setActionLoading(true);
        try {
            await inquiryService.respond(respondingTo._id, replyMessage);

            // Update local state
            setInquiries(inquiries.map(iq =>
                iq._id === respondingTo._id
                    ? { ...iq, status: "responded" }
                    : iq
            ));

            // Close modal and show success (using simple alert for now as requested)
            setRespondingTo(null);
            alert("Response sent successfully!");
        } catch (error) {
            console.error("Error sending reply:", error);
            alert("Failed to send response. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalInquiries = inquiries.length;
    const activeListings = properties.filter(p => p.status === "available").length;

    const tabs = [
        { id: "overview", label: "Overview", icon: FiBarChart2 },
        { id: "properties", label: "My Properties", icon: FiHome },
        { id: "inquiries", label: "Inquiries", icon: FiMessageSquare },
        { id: "analytics", label: "Analytics", icon: FiTrendingUp },
        { id: "settings", label: "Settings", icon: FiSettings },
    ];

    return (
        <div className="dashboard-page seller-dashboard">
            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <div className="user-avatar seller">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                        </div>
                        <h3>{user?.name}</h3>
                        <p>{user?.companyName || "Property Seller"}</p>
                        <span className="user-badge seller">Seller</span>
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

                    <div className="sidebar-action">
                        <button className="btn-primary full" onClick={() => navigate("/post-property")}>
                            <FiPlus /> Add New Property
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="dashboard-content">
                            <h1>Seller Dashboard</h1>
                            <p className="subtitle">Manage your properties and track performance</p>

                            <div className="stats-grid seller-stats">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ backgroundColor: "#dbeafe", color: "#2563eb" }}>
                                        <FiHome />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{properties.length}</span>
                                        <span className="stat-label">Total Properties</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ backgroundColor: "#d1fae5", color: "#059669" }}>
                                        <FiCheck />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{activeListings}</span>
                                        <span className="stat-label">Active Listings</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                                        <FiEye />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{totalViews}</span>
                                        <span className="stat-label">Total Views</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ backgroundColor: "var(--light-yellow)", color: "var(--secondary-color)" }}>
                                        <FiMessageSquare />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{totalInquiries}</span>
                                        <span className="stat-label">Inquiries</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Inquiries */}
                            <div className="dashboard-section">
                                <div className="section-header">
                                    <h2>Recent Inquiries</h2>
                                    <button onClick={() => setActiveTab("inquiries")}>View All</button>
                                </div>
                                {inquiries.length > 0 ? (
                                    <div className="inquiry-list">
                                        {inquiries.slice(0, 5).map((inquiry) => (
                                            <div key={inquiry._id} className="inquiry-card">
                                                <div className="inquiry-property">
                                                    <img src={inquiry.property?.images?.[0]?.url || "https://via.placeholder.com/60"} alt="" />
                                                    <div>
                                                        <h4>{inquiry.property?.title}</h4>
                                                        <p>From: {inquiry.sender?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="inquiry-meta">
                                                    <span className={`status-badge ${inquiry.status}`}>{inquiry.status}</span>
                                                    {inquiry.status !== 'responded' && (
                                                        <button
                                                            className="btn-outline small"
                                                            onClick={() => handleOpenReply(inquiry)}
                                                        >
                                                            Respond
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <FiMessageSquare />
                                        <p>No inquiries yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Properties */}
                            <div className="dashboard-section">
                                <div className="section-header">
                                    <h2>Your Properties</h2>
                                    <button onClick={() => setActiveTab("properties")}>View All</button>
                                </div>
                                {properties.length > 0 ? (
                                    <div className="property-table-wrapper">
                                        <table className="property-table">
                                            <thead>
                                                <tr>
                                                    <th>Property</th>
                                                    <th>Status</th>
                                                    <th>Views</th>
                                                    <th>Price</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {properties.slice(0, 5).map((property) => (
                                                    <tr key={property._id}>
                                                        <td>
                                                            <div className="property-cell">
                                                                <img src={property.images?.[0]?.url || "https://via.placeholder.com/50"} alt="" />
                                                                <span>{property.title}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${property.status}`}>{property.status}</span>
                                                        </td>
                                                        <td>{property.views || 0}</td>
                                                        <td>₹{property.price?.toLocaleString()}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button className="btn-icon" onClick={() => navigate(`/property/${property._id}`)}>
                                                                    <FiEye />
                                                                </button>
                                                                <button className="btn-icon" onClick={() => navigate(`/edit-property/${property._id}`)}>
                                                                    <FiEdit2 />
                                                                </button>
                                                                <button className="btn-icon delete" onClick={() => handleDeleteProperty(property._id)}>
                                                                    <FiTrash2 />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <FiHome />
                                        <p>No properties listed yet</p>
                                        <button className="btn-primary" onClick={() => navigate("/post-property")}>
                                            <FiPlus /> Add Your First Property
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Properties Tab */}
                    {activeTab === "properties" && (
                        <div className="dashboard-content">
                            <div className="section-header">
                                <div>
                                    <h1>My Properties</h1>
                                    <p className="subtitle">Manage all your property listings</p>
                                </div>
                                <button className="btn-primary" onClick={() => navigate("/post-property")}>
                                    <FiPlus /> Add Property
                                </button>
                            </div>

                            {properties.length > 0 ? (
                                <div className="property-table-wrapper full">
                                    <table className="property-table">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Views</th>
                                                <th>Inquiries</th>
                                                <th>Price</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {properties.map((property) => (
                                                <tr key={property._id}>
                                                    <td>
                                                        <div className="property-cell">
                                                            <img src={property.images?.[0]?.url || "https://via.placeholder.com/50"} alt="" />
                                                            <div>
                                                                <span className="property-title">{property.title}</span>
                                                                <small>{property.location?.city}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="capitalize">{property.listingType}</td>
                                                    <td>
                                                        <span className={`status-badge ${property.status}`}>{property.status}</span>
                                                    </td>
                                                    <td>{property.views || 0}</td>
                                                    <td>{property.inquiries || 0}</td>
                                                    <td>₹{property.price?.toLocaleString()}</td>
                                                    <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="btn-icon" onClick={() => navigate(`/property/${property._id}`)}>
                                                                <FiEye />
                                                            </button>
                                                            <button className="btn-icon" onClick={() => navigate(`/edit-property/${property._id}`)}>
                                                                <FiEdit2 />
                                                            </button>
                                                            <button className="btn-icon delete" onClick={() => handleDeleteProperty(property._id)}>
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state large">
                                    <FiHome />
                                    <h3>No properties yet</h3>
                                    <p>Start by adding your first property listing</p>
                                    <button className="btn-primary" onClick={() => navigate("/post-property")}>
                                        <FiPlus /> Add Property
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Inquiries Tab */}
                    {activeTab === "inquiries" && (
                        <div className="dashboard-content">
                            <h1>Property Inquiries</h1>
                            <p className="subtitle">Respond to buyer inquiries</p>

                            {inquiries.length > 0 ? (
                                <div className="inquiry-list full">
                                    {inquiries.map((inquiry) => (
                                        <div key={inquiry._id} className="inquiry-card detailed">
                                            <div className="inquiry-property">
                                                <img src={inquiry.property?.images?.[0]?.url || "https://via.placeholder.com/80"} alt="" />
                                                <div>
                                                    <h4>{inquiry.property?.title}</h4>
                                                    <p className="sender-info">
                                                        <strong>{inquiry.sender?.name}</strong> • {inquiry.sender?.email}
                                                    </p>
                                                    <p className="inquiry-message">{inquiry.message}</p>
                                                </div>
                                            </div>
                                            <div className="inquiry-details">
                                                <span className={`status-badge ${inquiry.status}`}>{inquiry.status}</span>
                                                <span className="inquiry-date">
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </span>
                                                {inquiry.status !== 'responded' ? (
                                                    <button
                                                        className="btn-primary small"
                                                        onClick={() => handleOpenReply(inquiry)}
                                                    >
                                                        Respond
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-gray-500">Replied</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state large">
                                    <FiMessageSquare />
                                    <h3>No inquiries yet</h3>
                                    <p>When buyers contact you, their inquiries will appear here</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && (
                        <div className="dashboard-content">
                            <h1>Analytics & Insights</h1>
                            <p className="subtitle">Track your property performance</p>

                            <div className="analytics-grid">
                                <div className="analytics-card">
                                    <h3>Performance Overview</h3>
                                    <div className="analytics-chart placeholder">
                                        <FiBarChart2 />
                                        <p>Coming soon: Detailed analytics charts</p>
                                    </div>
                                </div>

                                <div className="analytics-card">
                                    <h3>Top Performing Properties</h3>
                                    {properties.sort((a, b) => b.views - a.views).slice(0, 3).map((property, index) => (
                                        <div key={property._id} className="performance-item">
                                            <span className="rank">#{index + 1}</span>
                                            <div className="performance-info">
                                                <span>{property.title}</span>
                                                <small>{property.views} views • {property.inquiries || 0} inquiries</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div >

            {/* Response Modal */}
            {
                respondingTo && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Respond to Inquiry</h3>
                                <button className="btn-icon" onClick={() => setRespondingTo(null)}><FiX /></button>
                            </div>
                            <div className="modal-body">
                                <div className="inquiry-summary">
                                    <p><strong>Property:</strong> {respondingTo.property?.title}</p>
                                    <p><strong>From:</strong> {respondingTo.sender?.name}</p>
                                    <p><strong>Message:</strong> "{respondingTo.message}"</p>
                                </div>
                                <form onSubmit={handleSendReply}>
                                    <div className="form-group">
                                        <label>Your Reply</label>
                                        <textarea
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            placeholder="Type your response here..."
                                            rows="4"
                                            required
                                            className="form-input"
                                        ></textarea>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn-outline" onClick={() => setRespondingTo(null)}>Cancel</button>
                                        <button type="submit" className="btn-primary" disabled={actionLoading}>
                                            {actionLoading ? "Sending..." : "Send Reply"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default SellerDashboard;
