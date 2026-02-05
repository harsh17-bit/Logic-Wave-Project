import "./TopCities.css";

const CITIES = [
  { name: "Delhi / NCR", count: "227,000+", slug: "delhi-ncr" },
  { name: "Mumbai", count: "64,000+", slug: "mumbai" },
  { name: "Bangalore", count: "62,000+", slug: "bangalore" },
  { name: "Hyderabad", count: "29,000+", slug: "hyderabad" },
  { name: "Pune", count: "64,000+", slug: "pune" },
  { name: "Kolkata", count: "41,000+", slug: "kolkata" },
  { name: "Chennai", count: "42,000+", slug: "chennai" },
  { name: "Ahmedabad", count: "29,000+", slug: "ahmedabad" },
];

const TopCities = () => {
  return (
    <section className="top-cities">
      <div className="top-cities-container">
        <h2 className="top-cities-title">Explore Real Estate in Popular Indian Cities</h2>
        <p className="top-cities-subtitle">TOP CITIES</p>
        <div className="top-cities-grid">
          {CITIES.map((city) => (
            <a key={city.slug} href={`#city-${city.slug}`} className="top-cities-card">
              <span className="top-cities-name">{city.name}</span>
              <span className="top-cities-count">{city.count} Properties</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
