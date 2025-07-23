// src/components/GeolocationTest.jsx
import React, { useState } from "react";
import {
  getCurrentLocation,
  isGeolocationAvailable,
  requestLocationPermission,
} from "../utils/geolocation";

export default function GeolocationTest() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState(null);

  const handleGetLocation = async () => {
    setIsLoading(true);
    setError("");

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      console.log("Location data:", locationData);
    } catch (err) {
      setError(err.message);
      console.error("Geolocation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckPermission = async () => {
    try {
      const permissionState = await requestLocationPermission();
      setPermission(permissionState);
    } catch (err) {
      console.error("Permission check error:", err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-geo-alt me-2"></i>
                Geolocation Test
              </h5>
            </div>
            <div className="card-body">
              {/* Browser Environment Info */}
              <div className="mb-3">
                <h6>Browser Environment:</h6>
                <ul className="small">
                  <li>
                    <strong>Protocol:</strong> {window.location.protocol}
                  </li>
                  <li>
                    <strong>Hostname:</strong> {window.location.hostname}
                  </li>
                  <li>
                    <strong>User Agent:</strong>{" "}
                    {navigator.userAgent.substring(0, 50)}...
                  </li>
                  <li>
                    <strong>Is Secure Context:</strong>{" "}
                    {window.isSecureContext ? "Yes" : "No"}
                  </li>
                </ul>
              </div>

              {/* Geolocation Support Check */}
              <div className="mb-3">
                <strong>Geolocation Support:</strong>
                <span
                  className={`ms-2 badge ${
                    isGeolocationAvailable() ? "bg-success" : "bg-danger"
                  }`}
                >
                  {isGeolocationAvailable() ? "Supported" : "Not Supported"}
                </span>
              </div>

              {/* Permission Status */}
              <div className="mb-3">
                <strong>Permission Status:</strong>
                <span className="ms-2">
                  {permission ? (
                    <span
                      className={`badge ${
                        permission === "granted"
                          ? "bg-success"
                          : permission === "denied"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {permission}
                    </span>
                  ) : (
                    "Unknown"
                  )}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={handleCheckPermission}
                >
                  Check Permission
                </button>
              </div>

              {/* Get Location Button */}
              <div className="d-grid gap-2 mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleGetLocation}
                  disabled={isLoading || !isGeolocationAvailable()}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-geo-alt me-2"></i>
                      Get Current Location
                    </>
                  )}
                </button>

                {error && error.includes("denied") && (
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => {
                      setError("");
                      setLocation(null);
                      alert(
                        "Permission Reset:\n\n" +
                          "1. The error has been cleared\n" +
                          "2. Make sure to allow location access when prompted\n" +
                          "3. Click 'Get Current Location' to try again"
                      );
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Clear Error & Try Again
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Location Error:</strong> {error}
                  {error.includes("denied") && (
                    <div className="mt-2">
                      <small>
                        <strong>To fix this:</strong>
                        <ol className="mb-0 mt-1">
                          <li>
                            Look for the location/lock icon in your browser's
                            address bar
                          </li>
                          <li>
                            Click it and change location permission to "Allow"
                          </li>
                          <li>Refresh this page and try again</li>
                        </ol>
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* Location Display */}
              {location && (
                <div className="alert alert-success" role="alert">
                  <h6 className="alert-heading">
                    <i className="bi bi-check-circle me-2"></i>
                    Location Retrieved Successfully!
                  </h6>
                  <hr />
                  <p className="mb-2">
                    <strong>Address:</strong>
                    <br />
                    {location.address}
                  </p>
                  <p className="mb-2">
                    <strong>Coordinates:</strong>
                    <br />
                    Latitude: {location.latitude.toFixed(6)}
                    <br />
                    Longitude: {location.longitude.toFixed(6)}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                      window.open(mapsUrl, "_blank");
                    }}
                  >
                    <i className="bi bi-map me-1"></i>
                    View on Google Maps
                  </button>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4">
                <h6>Instructions:</h6>
                <ul className="small text-muted">
                  <li>Click "Get Current Location" to test geolocation</li>
                  <li>
                    Your browser will ask for permission to access your location
                  </li>
                  <li>Allow the permission to get your current address</li>
                  <li>The address will be automatically formatted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
