// src/components/LocationTest.jsx
import React, { useState } from "react";
import {
  checkLocationPermission,
  getCurrentLocation,
} from "../utils/geolocation";

const LocationTest = () => {
  const [permissionState, setPermissionState] = useState("unknown");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckPermission = async () => {
    try {
      const permissionInfo = await checkLocationPermission();
      setPermissionState(permissionInfo.state);
      console.log("Permission info:", permissionInfo);
      alert(
        `Permission Status: ${permissionInfo.state}\nMessage: ${permissionInfo.message}\nCan Request: ${permissionInfo.canRequest}`
      );
    } catch (error) {
      console.error("Permission check error:", error);
      alert("Error checking permission: " + error.message);
    }
  };

  const handleGetLocation = async () => {
    setLoading(true);
    setError("");
    setLocation(null);

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      console.log("Location data:", locationData);
    } catch (error) {
      setError(error.message);
      console.error("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header">
          <h3>Location Permission & Access Test</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h5>
              Current Permission Status:
              <span
                className={`badge ms-2 ${
                  permissionState === "granted"
                    ? "bg-success"
                    : permissionState === "denied"
                    ? "bg-danger"
                    : "bg-warning"
                }`}
              >
                {permissionState}
              </span>
            </h5>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button className="btn btn-info" onClick={handleCheckPermission}>
              <i className="bi bi-shield-check me-2"></i>
              Check Permission Status
            </button>

            <button
              className="btn btn-primary"
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
                  <i className="bi bi-geo-alt me-2"></i>
                  Get My Location
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <h6>Error:</h6>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}>
                {error}
              </pre>
            </div>
          )}

          {location && (
            <div className="alert alert-success">
              <h6>Location Found:</h6>
              <p>
                <strong>Address:</strong> {location.address}
              </p>
              <p>
                <strong>Coordinates:</strong> {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
              <p>
                <strong>Accuracy:</strong> ±{Math.round(location.accuracy || 0)}{" "}
                meters
              </p>
            </div>
          )}

          <div className="mt-4">
            <h6>Tips for Location Issues:</h6>
            <ul className="small">
              <li>
                <strong>Permission Denied:</strong> Click the location icon in
                your browser's address bar and allow location access
              </li>
              <li>
                <strong>Not Working:</strong> Make sure you're on HTTPS or
                localhost
              </li>
              <li>
                <strong>Inaccurate:</strong> Try moving to an area with better
                GPS signal
              </li>
              <li>
                <strong>Slow:</strong> Check your internet connection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTest;
