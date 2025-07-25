// src/components/Profile/ProfilePage.jsx
import React from "react";
import { useAuthStore } from "../../stores/authStore";
import ProfileVerification from "./ProfileVerification";
import VerificationBadge from "./VerificationBadge";
import PendingApprovalPage from "./PendingApprovalPage";
import RejectedApprovalPage from "./RejectedApprovalPage";

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Debug: Log user data to see what's happening
  console.log("ProfilePage - Current user:", user);
  console.log("ProfilePage - User role:", user?.role);
  console.log("ProfilePage - Is admin?", user?.role === "admin");
  console.log("ProfilePage - Approval status:", user?.approval_status);
  console.log("ProfilePage - Phone number:", user?.phone_number);
  console.log("ProfilePage - ID card:", user?.id_card_image);
  console.log("ProfilePage - Full user object:", JSON.stringify(user, null, 2));

  // Admin users don't need profile verification
  if (user?.role === "admin") {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-success text-white text-center">
                <h2 className="h4 mb-0">
                  <i className="bi bi-shield-check me-2"></i>
                  Admin Dashboard
                </h2>
              </div>
              <div className="card-body text-center p-5">
                <h3>Welcome, Administrator!</h3>
                <p className="text-muted mb-4">
                  Access your admin tools to manage user approvals and system
                  oversight.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <a href="/admin" className="btn btn-primary btn-lg">
                    <i className="bi bi-people me-2"></i>
                    Approval Requests
                  </a>
                  <a href="/map" className="btn btn-outline-secondary">
                    <i className="bi bi-geo-alt me-2"></i>
                    Map Search
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user needs to complete profile verification
  const needsProfileCompletion = !user?.phone_number || !user?.role;

  // For sellers and service providers, check approval status first
  if (user?.role === "seller" || user?.role === "service_provider") {
    console.log("Processing seller/service provider logic");
    console.log("needsProfileCompletion:", needsProfileCompletion);
    console.log("user.approval_status:", user?.approval_status);

    // If basic profile is incomplete, show verification form
    if (needsProfileCompletion) {
      console.log("Showing verification form - basic profile incomplete");
      return <ProfileVerification />;
    }

    // If basic profile is complete, check for business verification
    const needsIdVerification =
      !user?.id_card_image ||
      (user?.role === "seller" && !user?.id_card_number);

    console.log("needsIdVerification:", needsIdVerification);

    // If business verification is incomplete AND no approval status, show verification form
    if (needsIdVerification && !user?.approval_status) {
      console.log(
        "Showing verification form - business verification incomplete and no approval status"
      );
      return <ProfileVerification />;
    }

    // Handle approval statuses - regardless of verification completion
    if (user?.approval_status === "pending") {
      console.log("Showing pending approval page");
      return <PendingApprovalPage user={user} />;
    }

    if (user?.approval_status === "rejected") {
      console.log("Showing rejected approval page");
      return <RejectedApprovalPage user={user} />;
    }

    // If approved, show normal profile even if some verification is missing
    if (user?.approval_status === "approved") {
      console.log("User approved - showing normal profile");
      // Continue to normal profile page
    }

    // If no approval status but verification complete, show normal profile
    // If no approval status and verification incomplete, user needs to complete verification
    if (!user?.approval_status && needsIdVerification) {
      console.log(
        "No approval status and verification incomplete - showing verification form"
      );
      return <ProfileVerification />;
    }
  } else if (user?.role === "customer") {
    // For customers, check approval status after profile completion
    console.log("Processing customer logic");
    console.log("needsProfileCompletion:", needsProfileCompletion);
    console.log("user.approval_status:", user?.approval_status);

    // If basic profile is incomplete, show verification form
    if (needsProfileCompletion) {
      console.log("Customer needs profile completion");
      return <ProfileVerification />;
    }

    // Check if customer needs verification documents
    const needsIdVerification = !user?.customers?.[0]?.id_card_url;
    console.log("needsIdVerification:", needsIdVerification);
    console.log("customer data:", user?.customers?.[0]);

    // If verification is incomplete AND no approval status, show verification form
    if (needsIdVerification && !user?.approval_status) {
      console.log(
        "Showing verification form - customer verification incomplete and no approval status"
      );
      return <ProfileVerification />;
    }

    // Handle approval statuses for customers
    if (user?.approval_status === "pending") {
      console.log("Showing pending approval page for customer");
      return <PendingApprovalPage user={user} />;
    }

    if (user?.approval_status === "rejected") {
      console.log("Showing rejected approval page for customer");
      return <RejectedApprovalPage user={user} />;
    }

    // If approved, show normal profile page
    if (user?.approval_status === "approved") {
      console.log("Customer approved - showing profile page");
      // Continue to normal profile page below
    }

    // If no approval status and verification incomplete, show verification form
    if (!user?.approval_status && needsIdVerification) {
      console.log(
        "No approval status and verification incomplete - showing verification form for customer"
      );
      return <ProfileVerification />;
    }
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-circle me-2"></i>
                <h2 className="h4 mb-0">My Profile</h2>
              </div>
              <VerificationBadge user={user} size="lg" />
            </div>
            <div className="card-body p-4">
              {/* Profile Info */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Full Name</h6>
                  <p className="h6">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Email</h6>
                  <p className="h6">{user?.email}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Phone Number</h6>
                  <p className="h6">{user?.phone_number}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Role</h6>
                  <p className="h6">
                    <span className="badge bg-primary text-capitalize">
                      {user?.role?.replace("_", " ")}
                    </span>
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="mb-4">
                <h6 className="text-muted mb-1">Verification Status</h6>
                <div className="d-flex align-items-center">
                  {user?.approval_status === "approved" && (
                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Approved & Verified
                    </span>
                  )}
                  {user?.approval_status === "pending" && (
                    <span className="badge bg-warning">
                      <i className="bi bi-clock me-1"></i>
                      Under Review
                    </span>
                  )}
                  {user?.approval_status === "rejected" && (
                    <span className="badge bg-danger">
                      <i className="bi bi-x-circle me-1"></i>
                      Rejected
                    </span>
                  )}
                  {!user?.approval_status && user?.role === "customer" && (
                    <span className="badge bg-primary">
                      <i className="bi bi-check-circle me-1"></i>
                      Verified
                    </span>
                  )}
                  {!user?.approval_status &&
                    (user?.role === "seller" ||
                      user?.role === "service_provider") && (
                      <span className="badge bg-secondary">
                        <i className="bi bi-info-circle me-1"></i>
                        Complete Profile to Get Verified
                      </span>
                    )}
                </div>

                {/* Show additional approval information */}
                {user?.approval_status && user?.reviewed_at && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {user.approval_status === "approved"
                        ? "Approved"
                        : user.approval_status === "rejected"
                        ? "Rejected"
                        : "Submitted"}{" "}
                      on{" "}
                      {new Date(user.reviewed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                )}

                {/* Show rejection notes if applicable */}
                {user?.approval_status === "rejected" &&
                  user?.approval_notes && (
                    <div className="alert alert-danger mt-2" role="alert">
                      <small>
                        <strong>Rejection Reason:</strong> {user.approval_notes}
                      </small>
                    </div>
                  )}
              </div>

              {/* Business Info for Sellers/Service Providers */}
              {(user?.role === "seller" ||
                user?.role === "service_provider") && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Business Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted mb-1">
                        {user?.role === "seller" ? "Shop Name" : "Service Name"}
                      </h6>
                      <p className="h6">
                        {user?.shop_name ||
                          user?.service_name ||
                          "Not provided"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted mb-1">Address</h6>
                      <p className="h6">
                        {user?.shop_address ||
                          user?.service_address ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  {user?.role === "service_provider" &&
                    user?.specializations && (
                      <div className="mt-3">
                        <h6 className="text-muted mb-1">Specializations</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.isArray(user.specializations) ? (
                            user.specializations.map((spec, index) => (
                              <span key={index} className="badge bg-secondary">
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">
                              No specializations listed
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </button>
                {user?.approval_status === "rejected" && (
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      (window.location.href = "/home/profile?reapply=true")
                    }
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reapply for Verification
                  </button>
                )}
                {user?.approval_status === "approved" && (
                  <span className="badge bg-success-subtle text-success fs-6 px-3 py-2">
                    <i className="bi bi-patch-check me-2"></i>
                    Fully Verified Business
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
