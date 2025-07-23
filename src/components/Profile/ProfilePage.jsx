// src/components/Profile/ProfilePage.jsx
import React from "react";
import { useAuthStore } from "../../stores/authStore";
import ProfileVerification from "./ProfileVerification";
import VerificationBadge from "./VerificationBadge";

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Check if user needs to complete profile verification
  const needsProfileCompletion = !user?.phone_number || !user?.role;

  // For sellers and service providers, also check for required fields
  const needsIdVerification =
    (user?.role === "seller" || user?.role === "service_provider") &&
    (!user?.id_card_image ||
      (user?.role === "seller" && !user?.id_card_number));

  if (needsProfileCompletion || needsIdVerification) {
    return <ProfileVerification />;
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
                  {user?.verification_status === "verified" && (
                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Verified
                    </span>
                  )}
                  {user?.verification_status === "pending" && (
                    <span className="badge bg-warning">
                      <i className="bi bi-clock me-1"></i>
                      Under Review
                    </span>
                  )}
                  {user?.verification_status === "rejected" && (
                    <span className="badge bg-danger">
                      <i className="bi bi-x-circle me-1"></i>
                      Rejected
                    </span>
                  )}
                </div>
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
                {user?.verification_status === "rejected" && (
                  <button className="btn btn-warning">
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Resubmit Verification
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
