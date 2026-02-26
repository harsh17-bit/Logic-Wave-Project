import React from "react";
import ModernPropertyCard from "../components/ModernPropertyCard";

const ModernCardDemo = () => {
    const dummyProperty = {
        _id: "1",
        title: "Lakeshore Blvd West",
        location: "2464 Royal Ln. Mesa, New Jersey",
        price: 250,
        specifications: {
            bedrooms: 3,
            bathrooms: 4,
            carpetArea: 3210
        },
        rating: 4.8,
        reviewsCount: 20,
        images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]
    };

    return (
        <div style={{
            padding: "80px 20px",
            background: "#f4f4f4",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px"
        }}>
            <h1 style={{ color: "#333", fontWeight: "800" }}>Modern Property Card Design</h1>
            <p style={{ color: "#666", maxWidth: "600px", textAlign: "center" }}>
                This is a preview of the new modern property card design inspired by your image.
                It features glassmorphism, premium typography, and an interactive layout.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", width: "100%", maxWidth: "1200px", justifyContent: "center" }}>
                <ModernPropertyCard property={dummyProperty} />

                {/* Another example with different image */}
                <ModernPropertyCard property={{
                    ...dummyProperty,
                    _id: "2",
                    title: "Sunset Valley Estates",
                    price: 450,
                    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]
                }} />
            </div>

            <div style={{ marginTop: "40px" }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: "12px 24px",
                        background: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ModernCardDemo;
