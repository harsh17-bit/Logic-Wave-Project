import "./ExploreOptions.css";
import {
  FaHome,
  FaKey,
  FaChartLine,
  FaClipboardList,
  FaTree,
  FaChartBar,
  FaUsers,
  FaBuilding,
  FaFileContract
} from "react-icons/fa";

const OPTIONS = [
  { label: "Buying a home", icon: FaHome, href: "#" },
  { label: "Renting a home", icon: FaKey, href: "#" },
  { label: "Invest in Real Estate", icon: FaChartLine, href: "#", badge: "NEW" },
  { label: "Sell/Rent your property", icon: FaClipboardList, href: "#" },
  { label: "Plots/Land", icon: FaTree, href: "#", badge: "NEW" },
  { label: "Explore Insights", icon: FaChartBar, href: "#" },
  { label: "PG and co-living", icon: FaUsers, href: "#" },
  { label: "Buying commercial spaces", icon: FaBuilding, href: "#" },
  { label: "Lease commercial spaces", icon: FaFileContract, href: "#" },
];


const ExploreOptions = () => {
  return (
    <section className="explore-options">
      <div className="explore-container">
        <h2 className="explore-title">Get started with exploring real estate options</h2>
        <div className="explore-grid">
          {OPTIONS.map((item) => (
            <a key={item.label} href={item.href} className="explore-card">
              {item.badge && <span className="explore-badge">{item.badge}</span>}
              <span className="explore-icon"><item.icon size={32} /></span>
              <span className="explore-label">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreOptions;
