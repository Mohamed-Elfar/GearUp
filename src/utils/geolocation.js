// src/utils/geolocation.js

/**
 * Get user's current location using the Geolocation API
 * @returns {Promise<{latitude: number, longitude: number, address: string}>}
 */
export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    console.log("Starting geolocation request...");

    const options = {
      enableHighAccuracy: true,
      timeout: 30000, // Increased timeout to 30 seconds for high accuracy
      maximumAge: 0, // Force fresh location, don't use cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log("Location obtained:", {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
          });

          // Get address from coordinates using reverse geocoding
          const addressData = await reverseGeocode(latitude, longitude);

          resolve({
            latitude,
            longitude,
            address: addressData.formatted,
            addressComponents: addressData.components,
            accuracy: position.coords.accuracy,
          });
        } catch (error) {
          console.error("Error in position success callback:", error);
          reject(error);
        }
      },
      (error) => {
        console.error("Geolocation API error occurred");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        let errorMessage = "Failed to get location";
        let userFriendlyMessage = "";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            userFriendlyMessage =
              "Location permission was denied. To use location features:\n\n" +
              "1. Click the location icon (🔒 or 🌐) in your browser's address bar\n" +
              '2. Change location setting to "Allow"\n' +
              "3. Refresh this page\n" +
              "4. Try again";
            console.error("User denied location permission");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            userFriendlyMessage =
              "Your location could not be determined. Please check:\n\n" +
              "1. Location services are enabled on your device\n" +
              "2. You have a GPS signal or internet connection\n" +
              "3. Try moving to an area with better signal";
            console.error("Location position unavailable");
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            userFriendlyMessage =
              "Location request took too long. Please:\n\n" +
              "1. Check your internet connection\n" +
              "2. Try moving to an area with better GPS signal\n" +
              "3. Try again in a moment";
            console.error("Location request timed out");
            break;
          default:
            errorMessage = `Geolocation error (code ${error.code}): ${error.message}`;
            userFriendlyMessage =
              "An unexpected error occurred while getting your location. Please try again.";
            console.error(
              "Unknown geolocation error:",
              error.code,
              error.message
            );
            break;
        }

        console.error("Geolocation error summary:", {
          code: error.code,
          message: error.message,
          readableMessage: errorMessage,
          userFriendlyMessage,
          timestamp: new Date().toISOString(),
        });

        // Create error with user-friendly message
        const locationError = new Error(userFriendlyMessage);
        locationError.code = error.code;
        locationError.originalMessage = error.message;
        reject(locationError);
      },
      options
    );
  });
};

/**
 * Reverse geocode coordinates to get human-readable address
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{formatted: string, components: object}>}
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log("Starting reverse geocoding for:", { latitude, longitude });

    // Using Nominatim (OpenStreetMap) free reverse geocoding service
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    console.log("Reverse geocoding URL:", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "GearUp-App/1.0",
      },
    });

    console.log("Reverse geocoding response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: Failed to fetch address from coordinates`
      );
    }

    const data = await response.json();
    console.log("Reverse geocoding data:", data);

    if (!data || !data.display_name) {
      throw new Error("No address found for these coordinates");
    }

    // Format the address with better detail for customer use
    const address = data.address;
    let formattedAddress = "";

    if (address) {
      const parts = [];
      const detailParts = [];

      // Street address (most specific)
      if (address.house_number && address.road) {
        parts.push(`${address.house_number} ${address.road}`);
      } else if (address.road) {
        parts.push(address.road);
      } else if (address.pedestrian) {
        parts.push(address.pedestrian);
      }

      // Add building/shop details if available
      if (address.building || address.shop || address.amenity) {
        detailParts.push(address.building || address.shop || address.amenity);
      }

      // Add neighbourhood/area details
      if (address.suburb) {
        parts.push(address.suburb);
      } else if (address.neighbourhood) {
        parts.push(address.neighbourhood);
      } else if (address.quarter) {
        parts.push(address.quarter);
      }

      // Add district/area
      if (address.city_district) {
        parts.push(address.city_district);
      } else if (address.district) {
        parts.push(address.district);
      }

      // Add city/town
      if (address.city) {
        parts.push(address.city);
      } else if (address.town) {
        parts.push(address.town);
      } else if (address.village) {
        parts.push(address.village);
      } else if (address.municipality) {
        parts.push(address.municipality);
      }

      // Add governorate/state
      if (address.state) {
        parts.push(address.state);
      } else if (address.governorate) {
        parts.push(address.governorate);
      } else if (address.province) {
        parts.push(address.province);
      }

      // Add country
      if (address.country) {
        parts.push(address.country);
      }

      // Combine detail parts with main address
      if (detailParts.length > 0) {
        formattedAddress = `${detailParts.join(", ")} - ${parts.join(", ")}`;
      } else {
        formattedAddress = parts.join(", ");
      }

      // Add postal code if available
      if (address.postcode) {
        formattedAddress += ` (${address.postcode})`;
      }
    }

    const finalAddress = formattedAddress || data.display_name;
    console.log("Formatted address:", finalAddress);

    // Create structured address components for map display
    const addressComponents = {
      coordinates: `${latitude}, ${longitude}`,
      latitude: latitude,
      longitude: longitude,
      streetAddress: address?.road || "",
      houseNumber: address?.house_number || "",
      building: address?.building || address?.shop || address?.amenity || "",
      area: address?.suburb || address?.neighbourhood || address?.quarter || "",
      district: address?.city_district || address?.district || "",
      city: address?.city || address?.town || address?.municipality || "",
      governorate:
        address?.state || address?.governorate || address?.province || "",
      country: address?.country || "",
      postcode: address?.postcode || "",
      displayName: data.display_name,
    };

    console.log("Address components for map display:", addressComponents);

    return {
      formatted: finalAddress,
      components: addressComponents,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    // Fallback to simple coordinate display with more details
    const coordString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(
      6
    )}`;
    console.log("Using coordinate fallback:", coordString);

    return {
      formatted: coordString,
      components: {
        coordinates: `${latitude}, ${longitude}`,
        latitude: latitude,
        longitude: longitude,
        streetAddress: "",
        houseNumber: "",
        building: "",
        area: "",
        district: "",
        city: "",
        governorate: "",
        country: "",
        postcode: "",
        displayName: coordString,
      },
    };
  }
};

/**
 * Check if geolocation is available
 * @returns {boolean}
 */
export const isGeolocationAvailable = () => {
  return "geolocation" in navigator;
};

/**
 * Request location permission explicitly and check current state
 * @returns {Promise<{state: string, canRequest: boolean}>}
 */
export const checkLocationPermission = async () => {
  const result = {
    state: "unknown",
    canRequest: true,
    message: "",
  };

  // Check if geolocation is available
  if (!navigator.geolocation) {
    result.state = "unavailable";
    result.canRequest = false;
    result.message = "Geolocation is not supported by this browser";
    return result;
  }

  // Check permission state using the Permissions API
  if ("permissions" in navigator) {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      result.state = permission.state;

      switch (permission.state) {
        case "granted":
          result.message = "Location access is allowed";
          break;
        case "denied":
          result.canRequest = false;
          result.message =
            "Location access is blocked. Please enable it in browser settings";
          break;
        case "prompt":
          result.message = "Location permission will be requested";
          break;
      }

      return result;
    } catch (error) {
      console.log("Permissions API error:", error);
    }
  }

  // Fallback: Try to detect permission state by making a quick geolocation call
  try {
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          result.state = "granted";
          result.message = "Location access is allowed";
          resolve();
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            result.state = "denied";
            result.canRequest = false;
            result.message = "Location access is blocked";
          } else {
            result.state = "prompt";
            result.message = "Location permission status unknown";
          }
          resolve();
        },
        { timeout: 100, maximumAge: 60000 } // Very quick check with 1-minute cache
      );
    });
  } catch {
    result.state = "unknown";
    result.message = "Could not determine location permission status";
  }

  return result;
};

/**
 * Request location permission explicitly
 * @returns {Promise<string>} Permission state: 'granted', 'denied', or 'prompt'
 */
export const requestLocationPermission = async () => {
  const permissionCheck = await checkLocationPermission();
  return permissionCheck.state;
};
