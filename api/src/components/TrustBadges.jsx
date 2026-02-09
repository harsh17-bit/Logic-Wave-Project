import { FiShield, FiLock, FiCheckCircle, FiAward } from "react-icons/fi";
import "./TrustBadges.css";

const TRUST_BADGES = [
  {
    icon: FiShield,
    title: "100% Verified",
    subtitle: "All listings verified",
  },
  {
    icon: FiLock,
    title: "Secure Platform",
    subtitle: "256-bit SSL encryption",
  },
  {
    icon: FiCheckCircle,
    title: "RERA Approved",
    subtitle: "Licensed & compliant",
  },
  {
    icon: FiAward,
    title: "Trusted by 50K+",
    subtitle: "Happy customers",
  },
];

const TrustBadges = () => {
  return (
    <section className="trust-badges-section">
      <div className="trust-badges-container">
        {TRUST_BADGES.map((badge, index) => (
          <div key={index} className="trust-badge-item">
            <div className="trust-icon">
              <badge.icon />
            </div>
            <div className="trust-content">
              <h4>{badge.title}</h4>
              <p>{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
