// Geocoding Service using Nominatim (OpenStreetMap) - Completely Free
const BASE_URL = 'https://nominatim.openstreetmap.org';

export const geocodingService = {
  // Convert address to coordinates
  geocodeAddress: async (address) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'LogicWaveProperty/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding Error:', error);
      return null;
    }
  },

  // Reverse geocode - convert coordinates to address
  reverseGeocode: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'LogicWaveProperty/1.0'
          }
        }
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
      return null;
    }
  },

  // Search nearby places
  searchNearby: async (lat, lon, radius = 5000) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?format=json&lat=${lat}&lon=${lon}&radius=${radius}`,
        {
          headers: {
            'User-Agent': 'LogicWaveProperty/1.0'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Nearby Search Error:', error);
      return [];
    }
  }
};
