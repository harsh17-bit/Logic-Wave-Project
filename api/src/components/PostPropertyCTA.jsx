import "./PostPropertyCTA.css";

const PostPropertyCTA = () => {
  return (
    <section className="post-property-cta">
      <div className="post-property-container">
        <div className="post-property-content">
          <h2 className="post-property-title">Sell or rent faster at the right price!</h2>
          <p className="post-property-desc">List your property now for FREE</p>
          <div className="post-property-actions">
            <a href="/post-property" className="post-property-btn primary">
              Post Property
            </a>
            <a href="https://wa.me/919876543210" className="post-property-btn secondary">
              Post via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPropertyCTA;
