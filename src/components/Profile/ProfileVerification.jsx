// src/components/Profile/ProfileVerification.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../stores/authStore";
import {
  getCurrentLocation,
  isGeolocationAvailable,
  checkLocationPermission,
} from "../../utils/geolocation";

export default function ProfileVerification() {
  const { t } = useTranslation();
  const { user, updateProfile, isAuthenticated, authLoading } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("unknown"); // unknown, granted, denied, prompt

  // Check permission status on component mount
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        const permissionInfo = await checkLocationPermission();
        setPermissionStatus(permissionInfo.state);
        console.log("Initial permission check:", permissionInfo);
      } catch (error) {
        console.log("Permission check failed:", error);
        setPermissionStatus("unknown");
      }
    };

    checkPermissionStatus();
  }, []);

  // Show loading if auth is being initialized
  if (authLoading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect or show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <h2>Authentication Required</h2>
          <p>Please log in to access profile verification.</p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Get user's role from existing data
  const userRole = user?.role || "";

  console.log("ProfileVerification - User:", user);
  console.log("ProfileVerification - User Role:", userRole);
  console.log("ProfileVerification - Is Authenticated:", isAuthenticated);

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^[+]?[\d\s\-()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    idCardNumber: Yup.string().when([], {
      is: () => userRole === "seller",
      then: () =>
        Yup.string()
          .required("ID card number is required for sellers")
          .min(5, "ID card number must be at least 5 characters"),
      otherwise: () => Yup.string().notRequired(),
    }),
    idCard: Yup.mixed()
      .required("ID card is required for verification")
      .test("fileSize", "File too large (max 5MB)", (value) => {
        return !value || (value && value.size <= 5000000);
      })
      .test("fileType", "Invalid file type (only images and PDFs)", (value) => {
        return (
          !value ||
          (value &&
            [
              "image/jpeg",
              "image/png",
              "image/jpg",
              "application/pdf",
            ].includes(value.type))
        );
      }),
    // Conditional fields based on user's existing role
    businessLicense: Yup.mixed().when([], {
      is: () => userRole === "seller" || userRole === "service_provider",
      then: () =>
        Yup.mixed()
          .required(
            "Business license is required for sellers and service providers"
          )
          .test("fileSize", "File too large (max 5MB)", (value) => {
            return !value || (value && value.size <= 5000000);
          })
          .test(
            "fileType",
            "Invalid file type (only images and PDFs)",
            (value) => {
              return (
                !value ||
                (value &&
                  [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "application/pdf",
                  ].includes(value.type))
              );
            }
          ),
      otherwise: () => Yup.mixed().notRequired(),
    }),
    shopName: Yup.string().when([], {
      is: () => userRole === "seller",
      then: () => Yup.string().required("Shop name is required for sellers"),
      otherwise: () => Yup.string().notRequired(),
    }),
    shopAddress: Yup.string().when([], {
      is: () => userRole === "seller",
      then: () => Yup.string().required("Shop address is required for sellers"),
      otherwise: () => Yup.string().notRequired(),
    }),
    serviceName: Yup.string().when([], {
      is: () => userRole === "service_provider",
      then: () =>
        Yup.string().required("Service name is required for service providers"),
      otherwise: () => Yup.string().notRequired(),
    }),
    serviceAddress: Yup.string().when([], {
      is: () => userRole === "service_provider",
      then: () =>
        Yup.string().required(
          "Service address is required for service providers"
        ),
      otherwise: () => Yup.string().notRequired(),
    }),
    specializations: Yup.array().when([], {
      is: () => userRole === "service_provider",
      then: () =>
        Yup.array().min(1, "Please select at least one specialization"),
      otherwise: () => Yup.array().notRequired(),
    }),
  });

  const handleFileUpload = (event, fieldName, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue(fieldName, file);
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }));
    }
  };

  const handleGetCurrentLocation = async (fieldName, setFieldValue) => {
    console.log("Attempting to get location for field:", fieldName);

    if (!isGeolocationAvailable()) {
      const errorMsg = "Geolocation is not supported by your browser";
      setLocationError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Check if we're on HTTPS or localhost (required for geolocation)
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("ngrok") ||
      window.location.hostname.includes("ngrok-free.app");

    if (!isSecure) {
      const errorMsg =
        "Location access requires HTTPS or localhost. Please use a secure connection.";
      setLocationError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Check current permission state before making request (but don't block if unreliable)
    try {
      const permissionInfo = await checkLocationPermission();
      console.log("Permission check before request:", permissionInfo);
      setPermissionStatus(permissionInfo.state);

      // Only block if we're certain permission is denied
      if (permissionInfo.state === "denied" && !permissionInfo.canRequest) {
        const errorMsg =
          "Location access is blocked. Please enable location access in your browser settings and refresh the page.";
        setLocationError(errorMsg);
        alert(
          errorMsg +
            "\n\nTo fix this:\n1. Click the location/lock icon in your browser's address bar\n2. Allow location access for this site\n3. Refresh the page and try again"
        );
        return;
      }
    } catch {
      console.log(
        "Permission check failed, proceeding with location request anyway"
      );
      setPermissionStatus("unknown");
    }

    setIsGettingLocation(true);
    setLocationError("");
    setLocationSuccess(false);

    try {
      console.log("Requesting fresh location coordinates...");

      // Clear any cached location data first
      if ("permissions" in navigator) {
        try {
          // Try to clear any cached permission state
          console.log("Attempting to get fresh location...");
        } catch {
          console.log("Could not clear cache, proceeding anyway");
        }
      }

      const location = await getCurrentLocation();
      console.log("Location obtained successfully:", {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address.substring(0, 100) + "...",
        accuracy: location.accuracy,
        addressComponents: location.addressComponents,
      });

      // Set the address field
      setFieldValue(fieldName, location.address);

      // Store coordinates and detailed address components for later use (for map search functionality)
      const coordsFieldName =
        fieldName === "shopAddress" ? "shopCoordinates" : "serviceCoordinates";
      setFieldValue(coordsFieldName, {
        latitude: location.latitude,
        longitude: location.longitude,
        addressComponents: location.addressComponents,
      });

      setLocationSuccess(true);

      // Clear any previous errors
      setLocationError("");

      console.log("Location detection successful for field:", fieldName);

      // Show success message with option to verify coordinates
      const verifyUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      const confirmResult = confirm(
        `Location detected successfully!\n\n` +
          `Address: ${location.address}\n\n` +
          `Coordinates: ${location.latitude.toFixed(
            6
          )}, ${location.longitude.toFixed(6)}\n` +
          `Accuracy: ±${Math.round(location.accuracy || 0)} meters\n\n` +
          `Click OK to verify this location on Google Maps, or Cancel to continue.`
      );

      if (confirmResult) {
        window.open(verifyUrl, "_blank");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        code: error.code,
        originalMessage: error.originalMessage,
      });

      const errorMessage =
        error.message || "Unknown error occurred while getting location";
      setLocationError(errorMessage);

      // Clear any previous success messages
      setLocationSuccess(false);

      // Update permission status if this was a permission error
      if (error.code === 1) {
        // PERMISSION_DENIED
        setPermissionStatus("denied");
      }

      // Show the error message (it's already user-friendly from the geolocation utility)
      alert(`Location Error:\n\n${errorMessage}`);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("=== PROFILE UPDATE DEBUG START ===");
      console.log("Profile verification data:", values);
      console.log("Current user:", user);
      console.log("Is authenticated:", !!user);
      console.log("User ID:", user?.id);
      console.log("User role:", userRole);

      // Prepare the update object based on user's existing role
      const updateData = {
        phone_number: values.phoneNumber,
      };

      // Add role-specific data based on user's existing role
      if (userRole === "seller") {
        console.log("Processing seller data...");
        console.log("ID Card Number from form:", values.idCardNumber);

        if (!values.idCardNumber || values.idCardNumber.trim() === "") {
          alert(
            "ID Card Number is required for sellers. Please enter your national ID card number."
          );
          setIsSubmitting(false);
          return;
        }

        updateData.id_card_number = values.idCardNumber.trim(); // Required field for sellers
        updateData.shop_name = values.shopName;
        updateData.shop_address = values.shopAddress;
        // Add coordinates for map search functionality (matching DB schema: latitude, longitude)
        if (values.shopCoordinates) {
          updateData.latitude = values.shopCoordinates.latitude;
          updateData.longitude = values.shopCoordinates.longitude;
        }
      } else if (userRole === "service_provider") {
        updateData.specializations = values.specializations;
        updateData.service_address = values.serviceAddress;
        // Add coordinates for map search functionality (after DB schema update)
        if (values.serviceCoordinates) {
          updateData.latitude = values.serviceCoordinates.latitude;
          updateData.longitude = values.serviceCoordinates.longitude;
        }
      }

      console.log("Update data being sent:", updateData);

      // Note: File upload handling will be implemented later
      // For now, we'll skip the file uploads to avoid database errors
      if (values.idCard) {
        console.log("ID Card file selected:", values.idCard.name);
        // TODO: Implement file upload to Supabase storage
        // updateData.id_card_url = "uploaded_id_card_url";
      }

      if (values.businessLicense) {
        console.log(
          "Business License file selected:",
          values.businessLicense.name
        );
        // TODO: Implement file upload to Supabase storage
        // updateData.business_license_url = "uploaded_license_url";
      }

      // Call the auth store to update profile
      const { error } = await updateProfile(updateData);

      if (error) {
        console.error("Profile update error:", error);
        alert("Failed to update profile: " + error.message);
        return;
      }

      alert(
        "Profile verification submitted successfully! We'll review your documents within 24-48 hours."
      );
    } catch (error) {
      console.error("Profile verification error:", error);
      alert("Failed to submit profile verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceSpecializations = [
    "Oil Change",
    "Brake Service",
    "Engine Repair",
    "Transmission Service",
    "Air Conditioning",
    "Electrical Systems",
    "Tire Service",
    "Body Work",
    "Paint Service",
    "Diagnostic",
    "Towing Service",
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="h3 mb-0">{t("profile.verification.title")}</h2>
              <p className="mb-0 opacity-75">
                {t("profile.verification.subtitle")}
              </p>
            </div>
            <div className="card-body p-4">
              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">
                    {t("profile.verification.progress")}
                  </span>
                  <span className="small text-primary fw-semibold">
                    Step 2 of 2
                  </span>
                </div>
                <div className="progress" style={{ height: "4px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              {/* Location Permission Status */}
              {permissionStatus === "denied" && (
                <div className="alert alert-warning mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Location Access Blocked:</strong> Location features
                  are disabled. Click the location icon in your browser's
                  address bar to enable location access.
                </div>
              )}

              {permissionStatus === "granted" && (
                <div className="alert alert-success mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  <strong>Location Access Enabled:</strong> You can use the
                  location buttons to auto-detect addresses.
                </div>
              )}

              <Formik
                initialValues={{
                  phoneNumber: "",
                  idCardNumber: "",
                  idCard: null,
                  businessLicense: null,
                  shopName: "",
                  shopAddress: "",
                  shopCoordinates: null,
                  serviceName: "",
                  serviceAddress: "",
                  serviceCoordinates: null,
                  specializations: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue }) => (
                  <Form>
                    {/* Phone Number */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-telephone me-2"></i>
                        {t("profile.verification.phoneNumber")}
                      </label>
                      <Field
                        type="tel"
                        name="phoneNumber"
                        className="form-control"
                        placeholder={t(
                          "profile.verification.phoneNumberPlaceholder"
                        )}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Current Role Display */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-badge me-2"></i>
                        {t("profile.verification.role")}
                      </label>
                      <div className="p-3 bg-light rounded border">
                        <span className="badge bg-primary text-capitalize fs-6">
                          {userRole === "customer" &&
                            t("profile.verification.customer")}
                          {userRole === "seller" &&
                            t("profile.verification.seller")}
                          {userRole === "service_provider" &&
                            t("profile.verification.serviceProvider")}
                        </span>
                        <small className="text-muted ms-2">
                          {t(
                            "profile.verification.roleSelectedDuringRegistration"
                          )}
                        </small>
                      </div>
                    </div>

                    {/* ID Card Number - Only for sellers */}
                    {userRole === "seller" && (
                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-card-text me-2"></i>
                          ID Card Number
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="idCardNumber"
                          className="form-control"
                          placeholder="Enter your national ID card number"
                          required
                        />
                        <div className="form-text">
                          Enter the number from your national ID card (required)
                        </div>
                        <ErrorMessage
                          name="idCardNumber"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>
                    )}

                    {/* ID Card Upload */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-card-image me-2"></i>
                        {t("profile.verification.idCard")}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileUpload(e, "idCard", setFieldValue)
                        }
                      />
                      <div className="form-text">
                        {t("profile.verification.idCardHelper")}
                      </div>
                      {uploadedFiles.idCard && (
                        <div className="mt-2">
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {uploadedFiles.idCard}
                          </small>
                        </div>
                      )}
                      <ErrorMessage
                        name="idCard"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Conditional fields based on user role */}
                    {(userRole === "seller" ||
                      userRole === "service_provider") && (
                      <>
                        {/* Business License */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-file-earmark-text me-2"></i>
                            {t("profile.verification.businessLicense")}
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "businessLicense",
                                setFieldValue
                              )
                            }
                          />
                          <div className="form-text">
                            {t("profile.verification.businessLicenseHelper")}
                          </div>
                          {uploadedFiles.businessLicense && (
                            <div className="mt-2">
                              <small className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                {uploadedFiles.businessLicense}
                              </small>
                            </div>
                          )}
                          <ErrorMessage
                            name="businessLicense"
                            component="div"
                            className="text-danger small mt-1"
                          />
                        </div>
                      </>
                    )}

                    {/* Seller specific fields */}
                    {userRole === "seller" && (
                      <>
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              {t("profile.verification.shopName")}
                            </label>
                            <Field
                              type="text"
                              name="shopName"
                              className="form-control"
                              placeholder={t(
                                "profile.verification.shopNamePlaceholder"
                              )}
                            />
                            <ErrorMessage
                              name="shopName"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              {t("profile.verification.shopAddress")}
                            </label>
                            <div className="input-group">
                              <Field
                                type="text"
                                name="shopAddress"
                                className="form-control"
                                placeholder={t(
                                  "profile.verification.shopAddressPlaceholder"
                                )}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  handleGetCurrentLocation(
                                    "shopAddress",
                                    setFieldValue
                                  )
                                }
                                disabled={isGettingLocation}
                                title="Get current location"
                              >
                                {isGettingLocation ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  <i className="bi bi-geo-alt"></i>
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                  const mapsUrl = "https://www.google.com/maps";
                                  alert(
                                    "Manual Address Entry:\n\n" +
                                      "1. You can type your address manually in the field above, OR\n" +
                                      "2. Click OK to open Google Maps in a new tab\n" +
                                      "3. Find your location on the map\n" +
                                      "4. Copy the address and paste it in the field above"
                                  );
                                  window.open(mapsUrl, "_blank");
                                }}
                                title="Open Google Maps for manual address lookup"
                              >
                                <i className="bi bi-map"></i>
                              </button>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Click <i className="bi bi-geo-alt"></i> for
                              auto-detect or <i className="bi bi-map"></i> for
                              manual address lookup
                            </div>
                            {locationSuccess && (
                              <div className="text-success small mt-1">
                                <i className="bi bi-check-circle me-1"></i>
                                Location detected successfully!
                              </div>
                            )}
                            {locationError && (
                              <div className="text-danger small mt-1">
                                {locationError}
                              </div>
                            )}
                            <ErrorMessage
                              name="shopAddress"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Service Provider specific fields */}
                    {userRole === "service_provider" && (
                      <>
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              {t("profile.verification.serviceName")}
                            </label>
                            <Field
                              type="text"
                              name="serviceName"
                              className="form-control"
                              placeholder={t(
                                "profile.verification.serviceNamePlaceholder"
                              )}
                            />
                            <ErrorMessage
                              name="serviceName"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              {t("profile.verification.serviceAddress")}
                            </label>
                            <div className="input-group">
                              <Field
                                type="text"
                                name="serviceAddress"
                                className="form-control"
                                placeholder={t(
                                  "profile.verification.serviceAddressPlaceholder"
                                )}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  handleGetCurrentLocation(
                                    "serviceAddress",
                                    setFieldValue
                                  )
                                }
                                disabled={isGettingLocation}
                                title="Get current location"
                              >
                                {isGettingLocation ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  <i className="bi bi-geo-alt"></i>
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                  const mapsUrl = "https://www.google.com/maps";
                                  alert(
                                    "Manual Address Entry:\n\n" +
                                      "1. You can type your address manually in the field above, OR\n" +
                                      "2. Click OK to open Google Maps in a new tab\n" +
                                      "3. Find your location on the map\n" +
                                      "4. Copy the address and paste it in the field above"
                                  );
                                  window.open(mapsUrl, "_blank");
                                }}
                                title="Open Google Maps for manual address lookup"
                              >
                                <i className="bi bi-map"></i>
                              </button>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Click <i className="bi bi-geo-alt"></i> for
                              auto-detect or <i className="bi bi-map"></i> for
                              manual address lookup
                            </div>
                            {locationSuccess && (
                              <div className="text-success small mt-1">
                                <i className="bi bi-check-circle me-1"></i>
                                Location detected successfully!
                              </div>
                            )}
                            {locationError && (
                              <div className="text-danger small mt-1">
                                {locationError}
                              </div>
                            )}
                            <ErrorMessage
                              name="serviceAddress"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold">
                            {t("profile.verification.specializations")}
                          </label>
                          <div className="row g-2">
                            {serviceSpecializations.map((spec, index) => (
                              <div key={index} className="col-md-4">
                                <div className="form-check">
                                  <Field
                                    type="checkbox"
                                    name="specializations"
                                    value={spec}
                                    className="form-check-input"
                                    id={`spec-${index}`}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`spec-${index}`}
                                  >
                                    {spec}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage
                            name="specializations"
                            component="div"
                            className="text-danger small mt-1"
                          />
                        </div>
                      </>
                    )}

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-lg py-3"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            {t("profile.verification.submitting")}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>
                            {t("profile.verification.submitVerification")}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Info Alert */}
                    <div className="alert alert-info mt-4 d-flex align-items-start">
                      <i className="bi bi-info-circle me-2 mt-1"></i>
                      <div>
                        <strong>
                          {t("profile.verification.reviewProcess")}
                        </strong>
                        <br />
                        {t("profile.verification.reviewProcessDescription")}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
