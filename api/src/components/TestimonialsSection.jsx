import "./TestimonialsSection.css";

const TESTIMONIALS = [
  {
    quote: "You get an exclusive RM from our team who tracks your property closely.",
    name: "Srikanth Malleboina",
    role: "Owner, Hyderabad",
  },
  {
    quote: "Better response rate compared to any of their competitors.",
    name: "Prateek Sengar",
    role: "Owner, Delhi",
  },
  {
    quote: "Platform to meet customers & generate revenues with lowest cost of acquisition.",
    name: "SOBHA Developers",
    role: "Builder",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">What our customers are saying</h2>
        <p className="testimonials-subtitle">
          Hear from our satisfied buyers, tenants, owners and dealers
        </p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{item.quote}"</p>
              <p className="testimonial-name">{item.name}</p>
              <p className="testimonial-role">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
