// src/utils/mapUtils.js

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Find nearby shops/services based on user location
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {Array} locations - Array of shop/service locations
 * @param {number} maxDistance - Maximum distance in kilometers (default: 50km)
 * @returns {Array} Sorted array of nearby locations with distances
 */
export const findNearbyLocations = (
  userLat,
  userLon,
  locations,
  maxDistance = 50
) => {
  if (!userLat || !userLon || !Array.isArray(locations)) {
    return [];
  }

  return locations
    .map((location) => {
      // Handle different location data structures
      const lat =
        location.shop_latitude ||
        location.service_latitude ||
        location.latitude;
      const lon =
        location.shop_longitude ||
        location.service_longitude ||
        location.longitude;

      if (!lat || !lon) {
        return null; // Skip locations without coordinates
      }

      const distance = calculateDistance(userLat, userLon, lat, lon);

      return {
        ...location,
        distance,
        distanceText: formatDistance(distance),
      };
    })
    .filter((location) => location !== null && location.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

/**
 * Get user's current location for map search
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserLocationForSearch = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        reject(new Error("Unable to get your location"));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
};

/**
 * Generate Google Maps URL for location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} name - Location name
 * @returns {string} Google Maps URL
 */
export const generateMapsUrl = (lat, lon, name = "") => {
  const query = name ? encodeURIComponent(name) : `${lat},${lon}`;
  return `https://www.google.com/maps/search/${query}/@${lat},${lon},15z`;
};

/**
 * Generate directions URL to a location
 * @param {number} toLat - Destination latitude
 * @param {number} toLon - Destination longitude
 * @param {number} fromLat - Origin latitude (optional)
 * @param {number} fromLon - Origin longitude (optional)
 * @returns {string} Google Maps directions URL
 */
export const generateDirectionsUrl = (
  toLat,
  toLon,
  fromLat = null,
  fromLon = null
) => {
  let url = "https://www.google.com/maps/dir/";

  if (fromLat && fromLon) {
    url += `${fromLat},${fromLon}/`;
  }

  url += `${toLat},${toLon}`;

  return url;
};
