import "./FeaturedProjects.css";
import PropertyCard from "./propertycard";

const FEATURED = [
  {
    title: "Bricks Marvella",
    location: "Tellapur, Hyderabad",
    price: "99.71 Lac - 2.58 Cr",
    bhk: "2,3,4 BHK",
    area: "Apartment",
    type: "Apartment",
    featured: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
  },
  {
    title: "Rishi Coral Wood Bungalows",
    location: "Hoshangabad Road, Bhopal",
    price: " 1.95 Cr",
    bhk: "4,5 BHK",
    area: "Independent House/Villa",
    type: "Villa",
    featured: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
  },
  {
    title: "Green Valley Residency",
    location: "Sector 62, Noida",
    price: " 72 Lac - 1.2 Cr",
    bhk: "2,3 BHK",
    area: "1,200 - 1,800 sq.ft",
    type: "Apartment",
    featured: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
];

const FeaturedProjects = () => {
  return (
    <section className="featured-projects">
      <div className="featured-container">
        <h2 className="featured-title">Handpicked Residential Projects</h2>
        <p className="featured-subtitle">Featured Residential projects across India</p>
        <div className="featured-grid">
          {FEATURED.map((item, i) => (
            <PropertyCard key={i} property={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
