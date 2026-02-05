import { useEffect, useState } from "react";
import Hero from "../components/hero.jsx";
import PropertyCard from "../components/propertycard";
import { fetchProperties } from "../services/propertyservice.js";
import "./Home.css";

const Home = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties()
      .then((data) => setProperties(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Property Listing Section */}
      <section className="listing">
        <h2>Featured Properties</h2>

        <div className="grid">
          {properties.length === 0 ? (
            <p>No properties found</p>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
