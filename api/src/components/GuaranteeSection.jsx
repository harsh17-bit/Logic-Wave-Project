import { FiCheck, FiShield, FiClock, FiDollarSign } from "react-icons/fi";
import "./GuaranteeSection.css";

const GUARANTEES = [
  {
    icon: FiCheck,
    title: "100% Verified Listings",
    description: "Every property is physically verified and authenticated by our team",
  },
  {
    icon: FiShield,
    title: "Buyer Protection",
    description: "Your transactions are secure with our encrypted payment gateway",
  },
  {
    icon: FiClock,
    title: "24/7 Support",
    description: "Dedicated customer support team available round the clock",
  },
  {
    icon: FiDollarSign,
    title: "No Hidden Charges",
    description: "Transparent pricing with zero hidden fees or commissions",
  },
];

const GuaranteeSection = () => {
  return (
    <section className="guarantee-section">
      <div className="guarantee-container">
        <div className="guarantee-header">
          <h2 className="guarantee-title">Our Promise to You</h2>
          <p className="guarantee-subtitle">
            Your trust is our top priority. We guarantee a safe, transparent, and hassle-free experience.
          </p>
        </div>

        <div className="guarantee-grid">
          {GUARANTEES.map((item, index) => (
            <div key={index} className="guarantee-card">
              <div className="guarantee-icon">
                <item.icon />
              </div>
              <h3 className="guarantee-card-title">{item.title}</h3>
              <p className="guarantee-card-desc">{item.description}</p>
              <div className="guarantee-checkmark">✓</div>
            </div>
          ))}
        </div>

        <div className="guarantee-cta">
          <p className="guarantee-cta-text">
            Still have questions? We're here to help!
          </p>
          <div className="guarantee-cta-buttons">
            <a href="mailto:support@urbanstay.com" className="guarantee-btn primary">
              Contact Support
            </a>
            <a href="/faq" className="guarantee-btn secondary">
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
