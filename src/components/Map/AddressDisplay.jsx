// src/components/Map/AddressDisplay.jsx
import React from "react";

const AddressDisplay = ({
  addressComponents,
  showCoordinates = false,
  showDetailed = true,
}) => {
  if (!addressComponents) {
    return <span className="text-muted">Address not available</span>;
  }

  const {
    streetAddress,
    houseNumber,
    building,
    area,
    district,
    city,
    governorate,
    country,
    postcode,
    latitude,
    longitude,
  } = addressComponents;

  // Build display address parts
  const addressParts = [];

  // Street level
  if (houseNumber && streetAddress) {
    addressParts.push(`${houseNumber} ${streetAddress}`);
  } else if (streetAddress) {
    addressParts.push(streetAddress);
  }

  // Building/landmark
  if (building) {
    addressParts.push(building);
  }

  // Area/neighborhood
  if (area) {
    addressParts.push(area);
  }

  // District
  if (district && district !== city) {
    addressParts.push(district);
  }

  // City
  if (city) {
    addressParts.push(city);
  }

  // Governorate
  if (governorate) {
    addressParts.push(governorate);
  }

  // Country (usually not needed for local businesses)
  if (country && showDetailed) {
    addressParts.push(country);
  }

  const mainAddress = addressParts.join(", ");

  if (!showDetailed) {
    return (
      <div>
        <div>{mainAddress || "Address not specified"}</div>
        {postcode && (
          <small className="text-muted">Postal Code: {postcode}</small>
        )}
      </div>
    );
  }

  return (
    <div className="address-display">
      <div className="mb-2">
        <i className="bi bi-geo-alt text-primary me-2"></i>
        <strong>{mainAddress || "Address not specified"}</strong>
      </div>

      {showDetailed && (
        <div className="address-details small text-muted">
          {streetAddress && (
            <div>
              <i className="bi bi-signpost me-1"></i>
              Street: {houseNumber ? `${houseNumber} ` : ""}
              {streetAddress}
            </div>
          )}

          {building && (
            <div>
              <i className="bi bi-building me-1"></i>
              Building: {building}
            </div>
          )}

          {area && (
            <div>
              <i className="bi bi-map me-1"></i>
              Area: {area}
            </div>
          )}

          {city && (
            <div>
              <i className="bi bi-geo me-1"></i>
              City: {city}
            </div>
          )}

          {governorate && (
            <div>
              <i className="bi bi-geo-fill me-1"></i>
              Governorate: {governorate}
            </div>
          )}

          {postcode && (
            <div>
              <i className="bi bi-mailbox me-1"></i>
              Postal Code: {postcode}
            </div>
          )}

          {showCoordinates && (
            <div>
              <i className="bi bi-crosshair me-1"></i>
              Coordinates: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for compact address display in cards/lists
export const CompactAddressDisplay = ({ addressComponents }) => {
  return (
    <AddressDisplay
      addressComponents={addressComponents}
      showDetailed={false}
    />
  );
};

// Component for detailed address display in modals/full views
export const DetailedAddressDisplay = ({
  addressComponents,
  showCoordinates = false,
}) => {
  return (
    <AddressDisplay
      addressComponents={addressComponents}
      showDetailed={true}
      showCoordinates={showCoordinates}
    />
  );
};

export default AddressDisplay;
