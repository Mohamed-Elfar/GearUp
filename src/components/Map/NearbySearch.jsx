// src/components/Map/NearbySearch.jsx
import React, { useState, useEffect } from "react";
import {
  findNearbyLocations,
  getUserLocationForSearch,
  generateDirectionsUrl,
} from "../../utils/mapUtils";
import { CompactAddressDisplay } from "./AddressDisplay";

// Mock data - in real app, this would come from your database
const mockShops = [
  {
    id: 1,
    shop_name: "Auto Parts Central",
    shop_address: "123 Main St, Cairo, Egypt",
    shop_latitude: 30.9592064,
    shop_longitude: 31.1492608,
    user_id: "user1",
    addressComponents: {
      streetAddress: "Main St",
      houseNumber: "123",
      area: "Downtown",
      city: "Cairo",
      governorate: "Cairo",
      country: "Egypt",
      latitude: 30.9592064,
      longitude: 31.1492608,
    },
  },
  {
    id: 2,
    shop_name: "Speed Parts Shop",
    shop_address: "456 Tahrir Square, Cairo, Egypt",
    shop_latitude: 30.944,
    shop_longitude: 31.1456,
    user_id: "user2",
    addressComponents: {
      streetAddress: "Tahrir Square",
      houseNumber: "456",
      area: "Tahrir",
      city: "Cairo",
      governorate: "Cairo",
      country: "Egypt",
      latitude: 30.944,
      longitude: 31.1456,
    },
  },
];

const mockServices = [
  {
    id: 1,
    service_name: "Quick Oil Change",
    service_address: "789 Nile Corniche, Cairo, Egypt",
    service_latitude: 30.96,
    service_longitude: 31.15,
    specializations: ["Oil Change", "Brake Service"],
    user_id: "user3",
    addressComponents: {
      streetAddress: "Nile Corniche",
      houseNumber: "789",
      area: "Zamalek",
      city: "Cairo",
      governorate: "Cairo",
      country: "Egypt",
      latitude: 30.96,
      longitude: 31.15,
    },
  },
  {
    id: 2,
    service_name: "Cairo Auto Repair",
    service_address: "321 Zamalek, Cairo, Egypt",
    service_latitude: 30.9618,
    service_longitude: 31.1519,
    specializations: ["Engine Repair", "Electrical Systems"],
    user_id: "user4",
    addressComponents: {
      streetAddress: "Zamalek Street",
      houseNumber: "321",
      area: "Zamalek",
      city: "Cairo",
      governorate: "Cairo",
      country: "Egypt",
      latitude: 30.9618,
      longitude: 31.1519,
    },
  },
];

const NearbySearch = ({ searchType = "shops" }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchRadius, setSearchRadius] = useState(10); // km

  const handleGetLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const location = await getUserLocationForSearch();
      setUserLocation(location);

      // Find nearby locations
      const locations = searchType === "shops" ? mockShops : mockServices;
      const nearby = findNearbyLocations(
        location.latitude,
        location.longitude,
        locations,
        searchRadius
      );

      setNearbyLocations(nearby);
    } catch (err) {
      setError("Unable to get your location. Please enable location services.");
      console.error("Location error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      const locations = searchType === "shops" ? mockShops : mockServices;
      const nearby = findNearbyLocations(
        userLocation.latitude,
        userLocation.longitude,
        locations,
        searchRadius
      );
      setNearbyLocations(nearby);
    }
  }, [searchRadius, userLocation, searchType]);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-geo-alt me-2"></i>
          Find Nearby{" "}
          {searchType === "shops" ? "Auto Parts Shops" : "Service Centers"}
        </h5>
      </div>
      <div className="card-body">
        {/* Location Controls */}
        <div className="mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={handleGetLocation}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Getting Location...
              </>
            ) : (
              <>
                <i className="bi bi-crosshair me-2"></i>
                Find {searchType === "shops" ? "Shops" : "Services"} Near Me
              </>
            )}
          </button>

          {userLocation && (
            <div className="d-inline-block ms-2">
              <label className="form-label me-2">Search Radius:</label>
              <select
                className="form-select d-inline-block w-auto"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* User Location Info */}
        {userLocation && (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Your location: {userLocation.latitude.toFixed(6)},{" "}
            {userLocation.longitude.toFixed(6)}
          </div>
        )}

        {/* Results */}
        {nearbyLocations.length > 0 && (
          <div>
            <h6 className="mb-3">
              Found {nearbyLocations.length} {searchType} within {searchRadius}
              km
            </h6>
            <div className="row">
              {nearbyLocations.map((location) => (
                <div key={location.id} className="col-md-6 mb-3">
                  <div className="card border">
                    <div className="card-body">
                      <h6 className="card-title">
                        {location.shop_name || location.service_name}
                      </h6>

                      {location.addressComponents ? (
                        <div className="card-text small">
                          <CompactAddressDisplay
                            addressComponents={location.addressComponents}
                          />
                        </div>
                      ) : (
                        <p className="card-text small text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {location.shop_address || location.service_address}
                        </p>
                      )}

                      {location.specializations && (
                        <p className="card-text small">
                          <strong>Services:</strong>{" "}
                          {location.specializations.join(", ")}
                        </p>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-success">
                          <i className="bi bi-geo me-1"></i>
                          {location.distanceText} away
                        </span>
                        <a
                          href={generateDirectionsUrl(
                            location.shop_latitude || location.service_latitude,
                            location.shop_longitude ||
                              location.service_longitude,
                            userLocation.latitude,
                            userLocation.longitude
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-map me-1"></i>
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {userLocation && nearbyLocations.length === 0 && !loading && (
          <div className="text-center text-muted py-4">
            <i className="bi bi-search display-4"></i>
            <p className="mt-2">
              No {searchType} found within {searchRadius}km of your location.
            </p>
            <p className="small">
              Try increasing the search radius or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbySearch;
