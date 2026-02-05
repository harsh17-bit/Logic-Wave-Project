import "./BenefitsSection.css";

const BENEFITS = [
  {
    num: "01",
    title: "Over 12 Lac properties",
    desc: "10,000+ properties are added every day",
  },
  {
    num: "02",
    title: "Verification by our team",
    desc: "Photos, videos and other details are verified on location",
  },
  {
    num: "03",
    title: "Large user base",
    desc: "High active user count and engagement to find and close deals",
  },
];

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <h2 className="benefits-title">Why choose us</h2>
        <p className="benefits-subtitle">BENEFITS OF REALESTATEHUB</p>
        <div className="benefits-grid">
          {BENEFITS.map((item) => (
            <div key={item.num} className="benefits-card">
              <span className="benefits-num">{item.num}</span>
              <h3 className="benefits-card-title">{item.title}</h3>
              <p className="benefits-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
