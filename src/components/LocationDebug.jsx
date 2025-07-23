// src/components/LocationDebug.jsx
import React, { useState } from "react";
import {
  getCurrentLocation,
  checkLocationPermission,
} from "../utils/geolocation";

const LocationDebug = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testLocation = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test permission check
      console.log("Testing permission check...");
      const permissionInfo = await checkLocationPermission();
      testResults.permission = permissionInfo;

      // Test actual location
      console.log("Testing location retrieval...");
      const location = await getCurrentLocation();
      testResults.location = location;

      // Test specific coordinate reverse geocoding
      console.log("Testing specific coordinates...");
      const testLat = 30.9751; // Your actual coordinates
      const testLon = 30.9546;

      const testUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${testLat}&lon=${testLon}&zoom=18&addressdetails=1`;
      const testResponse = await fetch(testUrl, {
        headers: { "User-Agent": "GearUp-App/1.0" },
      });
      const testData = await testResponse.json();
      testResults.testCoordinates = {
        lat: testLat,
        lon: testLon,
        address: testData.display_name,
        detailedAddress: testData.address,
      };
    } catch (error) {
      testResults.error = error.message;
      console.error("Test error:", error);
    }

    setResults(testResults);
    setLoading(false);
  };

  const testBrowserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log("High accuracy location:", latitude, longitude, accuracy);
          // Continue processing
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true, // <--- add this
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header">
          <h3>Location Debug Tool</h3>
          <p className="mb-0 text-muted">
            Your Expected Location: 30°58'30.4"N 30°57'16.4"E (30.9751°N,
            30.9546°E)
          </p>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-4">
            <button
              className="btn btn-primary"
              onClick={testLocation}
              disabled={loading}
            >
              {loading ? "Testing..." : "Run Full Location Test"}
            </button>

            <button className="btn btn-secondary" onClick={testBrowserLocation}>
              Test Direct Browser Geolocation
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="results">
              {results.permission && (
                <div className="alert alert-info">
                  <h6>Permission Status:</h6>
                  <pre>{JSON.stringify(results.permission, null, 2)}</pre>
                </div>
              )}

              {results.location && (
                <div className="alert alert-success">
                  <h6>Detected Location:</h6>
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {results.location.latitude.toFixed(6)},{" "}
                    {results.location.longitude.toFixed(6)}
                  </p>
                  <p>
                    <strong>Address:</strong> {results.location.address}
                  </p>
                  <p>
                    <strong>Accuracy:</strong> ±
                    {Math.round(results.location.accuracy || 0)} meters
                  </p>
                </div>
              )}

              {results.testCoordinates && (
                <div className="alert alert-warning">
                  <h6>Your Expected Location Test:</h6>
                  <p>
                    <strong>Test Coordinates:</strong>{" "}
                    {results.testCoordinates.lat}, {results.testCoordinates.lon}
                  </p>
                  <p>
                    <strong>Should Be:</strong>{" "}
                    {results.testCoordinates.address}
                  </p>
                  <details>
                    <summary>Detailed Address Components</summary>
                    <pre style={{ fontSize: "0.8em" }}>
                      {JSON.stringify(
                        results.testCoordinates.detailedAddress,
                        null,
                        2
                      )}
                    </pre>
                  </details>
                </div>
              )}

              {results.browserDirect && (
                <div className="alert alert-info">
                  <h6>Direct Browser Geolocation:</h6>
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {results.browserDirect.latitude.toFixed(6)},{" "}
                    {results.browserDirect.longitude.toFixed(6)}
                  </p>
                  <p>
                    <strong>Accuracy:</strong> ±
                    {Math.round(results.browserDirect.accuracy)} meters
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {results.browserDirect.timestamp}
                  </p>
                </div>
              )}

              {results.browserError && (
                <div className="alert alert-danger">
                  <h6>Direct Browser Error:</h6>
                  <p>
                    <strong>Code:</strong> {results.browserError.code}
                  </p>
                  <p>
                    <strong>Message:</strong> {results.browserError.message}
                  </p>
                </div>
              )}

              {results.error && (
                <div className="alert alert-danger">
                  <h6>Test Error:</h6>
                  <p>{results.error}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <h6>Location Accuracy Issues:</h6>
            <ul className="small">
              <li>
                <strong>GPS vs Network:</strong> Browser might use network
                location (cell towers/WiFi) instead of GPS
              </li>
              <li>
                <strong>Cached Location:</strong> Browser might return
                cached/old location data
              </li>
              <li>
                <strong>Indoor Location:</strong> GPS accuracy is poor indoors
              </li>
              <li>
                <strong>Location Services:</strong> Device location settings
                might affect accuracy
              </li>
            </ul>

            <h6 className="mt-3">To Improve Accuracy:</h6>
            <ul className="small">
              <li>
                Enable <strong>High Accuracy</strong> mode in device settings
              </li>
              <li>
                Move to an <strong>outdoor area</strong> with clear sky view
              </li>
              <li>Clear browser location cache (site settings)</li>
              <li>Try on a mobile device with GPS enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDebug;
