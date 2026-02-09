import { useState, useEffect, useRef } from "react";
import { FiHome, FiUsers, FiMapPin, FiTrendingUp } from "react-icons/fi";
import "./StatsCounter.css";

const STATS = [
  {
    icon: FiHome,
    end: 12000,
    suffix: "+",
    label: "Properties Listed",
    color: "#10b981",
  },
  {
    icon: FiUsers,
    end: 50000,
    suffix: "+",
    label: "Happy Customers",
    color: "#3b82f6",
  },
  {
    icon: FiMapPin,
    end: 50,
    suffix: "+",
    label: "Cities Covered",
    color: "#f59e0b",
  },
  {
    icon: FiTrendingUp,
    end: 98,
    suffix: "%",
    label: "Success Rate",
    color: "#8b5cf6",
  },
];

const StatsCounter = () => {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    STATS.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.end / steps;

      const timer = setInterval(() => {
        currentStep++;
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[index] = Math.min(
            Math.floor(increment * currentStep),
            stat.end
          );
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="stats-counter-section">
      <div className="stats-counter-container">
        <h2 className="stats-counter-title">Why Trust UrbanStay.com?</h2>
        <p className="stats-counter-subtitle">
          Numbers that speak for our reliability and commitment
        </p>
        <div className="stats-counter-grid">
          {STATS.map((stat, index) => (
            <div key={index} className="stats-counter-card">
              <div
                className="stats-counter-icon"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon />
              </div>
              <div className="stats-counter-value">
                {counts[index].toLocaleString()}
                <span>{stat.suffix}</span>
              </div>
              <div className="stats-counter-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
