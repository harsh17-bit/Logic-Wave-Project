import { Link } from "react-router-dom";
import { FiHeart, FiMapPin, FiMaximize, FiHome, FiStar, FiShield } from "react-icons/fi";
import "./PropertyCard.css";

const PropertyCard = ({ property, viewMode = "grid" }) => {
  if (!property) return null;

  const {
    _id,
    title = "Property",
    location = {},
    price = 0,
    specifications = {},
    propertyType = "Apartment",
    listingType = "buy",
    images = [],
    isFeatured = false,
    isVerified = false,
    views = 0,
  } = property;

  const image = images?.[0]?.url ||
    images?.[0] ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400";

  const formatPrice = (price, type) => {
    if (type === "rent") {
      return `₹${price?.toLocaleString("en-IN")}/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price?.toLocaleString("en-IN")}`;
  };

  const cityName = location?.city || location || "Location";
  const bhk = specifications?.bedrooms || property.bhk || 0;
  const area = specifications?.carpetArea || property.area || 0;

  if (viewMode === "list") {
    return (
      <Link to={`/property/${_id}`} className="property-card list-view">
      <div className="property-image-wrap">
        <img 
          src={image} 
          alt={title} 
          className="property-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400";
          }}
          loading="lazy"
        />
        <div className="image-badges">
            {isFeatured && (
              <span className="badge featured"><FiStar /> Featured</span>
            )}
            {isVerified && (
              <span className="badge verified"><FiShield /></span>
            )}
          </div>
          <span className="listing-type-badge">{listingType === "rent" ? "For Rent" : "For Sale"}</span>
        </div>

        <div className="property-body">
          <div className="property-main-info">
            <span className="property-type-tag">{propertyType}</span>
            <h3 className="property-title">{title}</h3>
            <p className="property-location">
              <FiMapPin />
              {cityName}
            </p>
          </div>

          <div className="property-specs">
            {bhk > 0 && (
              <div className="spec">
                <FiHome />
                <span>{bhk} BHK</span>
              </div>
            )}
            {area > 0 && (
              <div className="spec">
                <FiMaximize />
                <span>{area} sq.ft</span>
              </div>
            )}
          </div>

          <div className="property-footer">
            <p className="property-price">{formatPrice(price, listingType)}</p>
            <button className="favorite-btn" onClick={(e) => e.preventDefault()}>
              <FiHeart />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/property/${_id}`} className="property-card">
      <div className="property-image-wrap">
        <img 
          src={image} 
          alt={title} 
          className="property-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400";
          }}
          loading="lazy"
        />
        <div className="image-badges">
          {isFeatured && (
            <span className="badge featured"><FiStar /> Featured</span>
          )}
          {isVerified && (
            <span className="badge verified"><FiShield /></span>
          )}
        </div>
        <span className="listing-type-badge">{listingType === "rent" ? "For Rent" : "For Sale"}</span>
        <button className="favorite-btn" onClick={(e) => e.preventDefault()}>
          <FiHeart />
        </button>
      </div>

      <div className="property-body">
        <span className="property-type-tag">{propertyType}</span>
        <h3 className="property-title">{title}</h3>
        <p className="property-location">
          <FiMapPin />
          {cityName}
        </p>

        <div className="property-meta">
          {bhk > 0 && <span><FiHome /> {bhk} BHK</span>}
          {area > 0 && <span><FiMaximize /> {area} sq.ft</span>}
        </div>

        <div className="property-footer">
          <p className="property-price">{formatPrice(price, listingType)}</p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
