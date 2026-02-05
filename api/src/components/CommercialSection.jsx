import "./CommercialSection.css";

const CommercialSection = () => {
  return (
    <section className="commercial-section">
      <div className="commercial-container">
        <h2 className="commercial-title">COMMERCIAL SPACES</h2>
        <p className="commercial-subtitle">
          Choose from a wide variety of commercial properties
        </p>
        <div className="commercial-grid">
          <a href="#" className="commercial-card">
            <h3>BUY FOR COMMERCIAL USE</h3>
            <p>Buy a Commercial property</p>
            <p className="commercial-detail">
              Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more
            </p>
            <span className="commercial-link">Explore Buying Commercial →</span>
          </a>
          <a href="#" className="commercial-card">
            <h3>LEASE FOR COMMERCIAL USE</h3>
            <p>Lease a Commercial property</p>
            <p className="commercial-detail">
              Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more
            </p>
            <span className="commercial-link">Explore Leasing Commercial →</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommercialSection;
