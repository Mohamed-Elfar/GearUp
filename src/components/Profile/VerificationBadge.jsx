// src/components/Profile/VerificationBadge.jsx
import React from "react";

export default function VerificationBadge({ user, size = "sm" }) {
  if (!user) return null;

  const hasPhone = !!user.phone_number;
  const hasIdCard = !!user.id_card_image;
  const role = user.role;
  const approvalStatus = user.approval_status;

  // Determine verification level
  let verificationLevel = "none";
  if (role === "customer") {
    if (hasPhone) verificationLevel = "verified";
  } else if (role === "seller" || role === "service_provider") {
    // For sellers and service providers, check approval status
    if (hasPhone && hasIdCard) {
      if (approvalStatus === "approved") {
        verificationLevel = "fully_verified";
      } else if (approvalStatus === "pending") {
        verificationLevel = "pending";
      } else if (approvalStatus === "rejected") {
        verificationLevel = "rejected";
      } else {
        verificationLevel = "verified"; // Profile complete but no approval status
      }
    } else if (hasPhone) {
      verificationLevel = "verified";
    }
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "d-flex gap-1",
      badge: "6px",
      icon: "10px",
    },
    md: {
      container: "d-flex gap-2",
      badge: "8px",
      icon: "12px",
    },
    lg: {
      container: "d-flex gap-2",
      badge: "10px",
      icon: "14px",
    },
  };

  const config = sizeConfig[size];

  const renderBadge = (type, color, icon) => (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center`}
      style={{
        width: config.badge,
        height: config.badge,
        backgroundColor: color,
        fontSize: config.icon,
        color: "white",
      }}
      title={`${type} verified`}
    >
      <i className={`bi bi-${icon}`} style={{ fontSize: config.icon }}></i>
    </div>
  );

  if (verificationLevel === "none") return null;

  return (
    <div className={config.container}>
      {verificationLevel === "verified" &&
        renderBadge("Phone", "#007bff", "check-circle-fill")}
      {verificationLevel === "pending" && (
        <>
          {renderBadge("Phone", "#007bff", "check-circle-fill")}
          {renderBadge("Under Review", "#ffc107", "clock")}
        </>
      )}
      {verificationLevel === "rejected" && (
        <>
          {renderBadge("Phone", "#007bff", "check-circle-fill")}
          {renderBadge("Rejected", "#dc3545", "x-circle")}
        </>
      )}
      {verificationLevel === "fully_verified" && (
        <>
          {renderBadge("Phone", "#007bff", "check-circle-fill")}
          {renderBadge("ID Card", "#28a745", "shield-check")}
          {renderBadge("Approved", "#198754", "patch-check-fill")}
        </>
      )}
    </div>
  );
}
