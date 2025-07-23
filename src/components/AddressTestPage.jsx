// src/components/AddressTestPage.jsx
import React, { useState } from "react";
import { getCurrentLocation } from "../utils/geolocation";
import {
  DetailedAddressDisplay,
  CompactAddressDisplay,
} from "./Map/AddressDisplay";

const AddressTestPage = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testAddress = async () => {
    setLoading(true);
    setError("");
    setLocation(null);

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      console.log("Full location data:", locationData);
    } catch (error) {
      setError(error.message);
      console.error("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3>Enhanced Address Display Test</h3>
              <p className="mb-0 text-muted">
                Test the improved address formatting for customer display
              </p>
            </div>
            <div className="card-body">
              <button
                className="btn btn-primary mb-4"
                onClick={testAddress}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <i className="bi bi-geo-alt me-2"></i>
                    Get My Location & Format Address
                  </>
                )}
              </button>

              {error && (
                <div className="alert alert-danger">
                  <h6>Error:</h6>
                  <p>{error}</p>
                </div>
              )}

              {location && (
                <div>
                  {/* Raw Data */}
                  <div className="alert alert-info mb-4">
                    <h6>Raw Location Data:</h6>
                    <p>
                      <strong>Coordinates:</strong>{" "}
                      {location.latitude.toFixed(6)},{" "}
                      {location.longitude.toFixed(6)}
                    </p>
                    <p>
                      <strong>Accuracy:</strong> ±
                      {Math.round(location.accuracy || 0)} meters
                    </p>
                    <p>
                      <strong>Formatted Address:</strong> {location.address}
                    </p>
                  </div>

                  {/* Compact Display (for cards/lists) */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h6 className="mb-0">
                        Compact Address Display (for shop cards)
                      </h6>
                    </div>
                    <div className="card-body">
                      <CompactAddressDisplay
                        addressComponents={location.addressComponents}
                      />
                    </div>
                  </div>

                  {/* Detailed Display (for full views) */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h6 className="mb-0">
                        Detailed Address Display (for shop profiles)
                      </h6>
                    </div>
                    <div className="card-body">
                      <DetailedAddressDisplay
                        addressComponents={location.addressComponents}
                        showCoordinates={true}
                      />
                    </div>
                  </div>

                  {/* Address Components Debug */}
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        Address Components (for developers)
                      </h6>
                    </div>
                    <div className="card-body">
                      <pre
                        style={{
                          fontSize: "0.8em",
                          backgroundColor: "#f8f9fa",
                          padding: "1rem",
                          borderRadius: "0.375rem",
                        }}
                      >
                        {JSON.stringify(location.addressComponents, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Map Links */}
                  <div className="mt-4 d-flex gap-2">
                    <a
                      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-map me-2"></i>
                      View on Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=16`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-globe me-2"></i>
                      View on OpenStreetMap
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTestPage;
