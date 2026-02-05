import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const [listingType, setListingType] = useState("buy"); // buy or rent
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Construct query parameters
    const params = new URLSearchParams();
    if (listingType) params.append("listingType", listingType);
    if (searchTerm) params.append("search", searchTerm);
    if (propertyType) params.append("propertyType", propertyType);

    // Navigate to search results page
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <h1>
          Find Your <span>Dream Home</span>
        </h1>
        <p>Buy, Rent or Sell properties across top cities in India</p>

        <div className="search-card">

          <div className="search-fields">
            <input
              type="text"
              placeholder="Enter city, locality or project"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">All Property Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="office">Office</option>
              <option value="shop">Shop</option>
            </select>

            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
