import { useEffect, useState } from "react";
import Hero from "../components/hero.jsx";
import PropertyCard from "../components/propertycard";
import TrustBadges from "../components/TrustBadges.jsx";
import StatsCounter from "../components/StatsCounter.jsx";
import GuaranteeSection from "../components/GuaranteeSection.jsx";
import BenefitsSection from "../components/BenefitsSection.jsx";
import CertificationsSection from "../components/CertificationsSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import TopCities from "../components/TopCities.jsx";
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

      {/* Trust Badges - Immediately after hero */}
      <TrustBadges />

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

      {/* Stats Counter */}
      <StatsCounter />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Certifications & Awards */}
      <CertificationsSection />

      {/* Our Guarantee */}
      <GuaranteeSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Top Cities */}
      <TopCities />
    </>
  );
};

export default Home;
