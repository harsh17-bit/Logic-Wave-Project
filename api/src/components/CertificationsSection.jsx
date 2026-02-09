import { FiShield, FiAward, FiCheckCircle, FiStar } from "react-icons/fi";
import "./CertificationsSection.css";

const CERTIFICATIONS = [
  {
    icon: FiShield,
    title: "RERA Certified",
    description: "Real Estate Regulatory Authority approved platform",
    year: "2023",
  },
  {
    icon: FiAward,
    title: "ISO 9001:2015",
    description: "International quality management certification",
    year: "2024",
  },
  {
    icon: FiCheckCircle,
    title: "NAREDCO Member",
    description: "National Real Estate Development Council",
    year: "2023",
  },
  {
    icon: FiStar,
    title: "Best Platform 2024",
    description: "India Real Estate Awards",
    year: "2024",
  },
];

const CertificationsSection = () => {
  return (
    <section className="certifications-section">
      <div className="certifications-container">
        <h2 className="certifications-title">Certified & Trusted</h2>
        <p className="certifications-subtitle">
          Our certifications and memberships ensure the highest standards of service
        </p>
        <div className="certifications-grid">
          {CERTIFICATIONS.map((cert, index) => (
            <div key={index} className="certification-card">
              <div className="certification-badge">
                <cert.icon className="certification-icon" />
                <span className="certification-year">{cert.year}</span>
              </div>
              <h3 className="certification-title">{cert.title}</h3>
              <p className="certification-desc">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
