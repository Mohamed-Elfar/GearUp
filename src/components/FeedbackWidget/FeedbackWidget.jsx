// src/components/FeedbackWidget/FeedbackWidget.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import styles from "./FeedbackWidget.module.css";

export default function FeedbackWidget() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); // 'idea' or 'issue'
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    details: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [showScreenshotPermission, setShowScreenshotPermission] =
    useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("File size must be less than 2MB");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleScreenshot = async () => {
    setShowScreenshotPermission(true);
  };

  const allowScreenshot = async () => {
    try {
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });

      // Create video element to capture frame
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("loadedmetadata", () => {
        // Create canvas to capture screenshot
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        // Convert to blob
        canvas.toBlob((blob) => {
          setScreenshot(blob);
          setShowScreenshotPermission(false);
          // Stop the stream
          stream.getTracks().forEach((track) => track.stop());
        }, "image/png");
      });
    } catch (err) {
      console.error("Error capturing screenshot:", err);
      setShowScreenshotPermission(false);
    }
  };

  const cancelScreenshot = () => {
    setShowScreenshotPermission(false);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", {
      type: selectedType,
      ...formData,
      file: uploadedFile,
      screenshot: screenshot,
    });

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      title: "",
      details: "",
    });
    setUploadedFile(null);
    setScreenshot(null);
    setSelectedType(null);
    setIsOpen(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
  };

  return (
    <>
      {/* Main Feedback Button*/}
      <div
        className={`position-fixed bottom-0 start-0 ms-3 ms-md-5 ${styles.feedbackButtonContainer}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn btn-secondary d-flex align-items-center gap-2 px-3 py-2 border-0 shadow-lg ${styles.feedbackButton}`}
        >
          <span>💬</span>
          <span className="fw-medium text-white">{t("feedback.button")}</span>
        </button>
      </div>

      {/* Feedback Panel */}
      {isOpen && (
        <div
          className={`position-fixed bottom-0 start-0 ms-3 ms-md-5 ${styles.feedbackPanel}`}
        >
          <div
            className={`bg-primary text-white shadow-lg overflow-hidden ${styles.feedbackPanelContent}`}
          >
            {!selectedType ? (
              // Type Selection Panel
              <div className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="fw-semibold text-white mb-0">
                    {t("feedback.title")}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`btn btn-link text-white p-0 text-decoration-none ${styles.closeButton}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  <button
                    onClick={() => setSelectedType("idea")}
                    className={`btn w-100 p-3 text-white fw-bold d-flex align-items-center gap-3 text-start ${styles.typeButton}`}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-center text-white ${styles.typeIcon} ${styles.ideaIcon}`}
                    >
                      💡
                    </div>
                    <div>
                      <div className="fw-medium">
                        {t("feedback.idea.title")}
                      </div>
                      <div className={`small ${styles.typeDescription}`}>
                        {t("feedback.idea.description")}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedType("issue")}
                    className={`btn w-100 p-3 text-white fw-bold d-flex align-items-center gap-3 text-start ${styles.typeButton}`}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-center text-white ${styles.typeIcon} ${styles.issueIcon}`}
                    >
                      🐛
                    </div>
                    <div>
                      <div className="fw-medium">
                        {t("feedback.issue.title")}
                      </div>
                      <div className={`small ${styles.typeDescription}`}>
                        {t("feedback.issue.description")}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // Form Panel
              <div className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`btn btn-link text-white p-0 text-decoration-none ${styles.backButton}`}
                  >
                    {language === "AR" ? "→" : "←"}
                  </button>
                  <h3 className="fw-semibold text-white mb-0">
                    {selectedType === "idea"
                      ? t("feedback.idea.title")
                      : t("feedback.issue.title")}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`btn btn-link text-white p-0 text-decoration-none ${styles.closeButton}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder={t("feedback.form.fullName")}
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`form-control ${styles.formInput}`}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder={t("feedback.form.email")}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`form-control ${styles.formInput}`}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder={t("feedback.form.title")}
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={`form-control ${styles.formInput}`}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder={t("feedback.form.details")}
                      value={formData.details}
                      onChange={(e) =>
                        handleInputChange("details", e.target.value)
                      }
                      rows={4}
                      className={`form-control ${styles.formTextarea}`}
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      <button
                        onClick={handleScreenshot}
                        className={`btn flex-fill fw-bold d-flex align-items-center justify-content-center gap-2 ${styles.uploadButton}`}
                      >
                        📷{" "}
                        <span className="small">
                          {t("feedback.form.screenshot")}
                        </span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`btn flex-fill fw-bold d-flex align-items-center justify-content-center gap-2 ${styles.uploadButton}`}
                      >
                        📎{" "}
                        <span className="small">
                          {t("feedback.form.upload")}
                        </span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="d-none"
                    />

                    {/* Display uploaded file */}
                    {uploadedFile && (
                      <div
                        className={`d-flex align-items-center justify-content-between p-3 bg-white border rounded ${styles.fileDisplay}`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span>📄</span>
                          <span className="small text-truncate text-dark">
                            {uploadedFile.name}
                          </span>
                          <span className={`text-muted ${styles.fileSize}`}>
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={removeFile}
                          className="btn btn-link text-danger p-0 text-decoration-none"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Display screenshot */}
                    {screenshot && (
                      <div
                        className={`d-flex align-items-center justify-content-between p-3 bg-white border rounded ${styles.fileDisplay}`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span>📷</span>
                          <span className="small text-dark">
                            {t("feedback.files.screenshot")}
                          </span>
                          <span className={`text-muted ${styles.fileSize}`}>
                            {(screenshot.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={removeScreenshot}
                          className="btn btn-link text-danger p-0 text-decoration-none"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className={`btn w-100 fw-medium ${styles.submitButton}`}
                  >
                    {t("feedback.form.submit")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screenshot Permission Modal */}
      {showScreenshotPermission && (
        <div
          className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${styles.modalOverlay}`}
        >
          <div className={`bg-white rounded p-4 mx-3 ${styles.modalContent}`}>
            <div className="text-center mb-4">
              <div
                className={`mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle ${styles.modalIcon}`}
              >
                <span className={styles.modalIconText}>🖥️</span>
              </div>
              <h3 className="fs-5 fw-semibold text-dark mb-2">
                {t("feedback.screenshotPermission.title")}
              </h3>
              <p className="small text-muted">
                {t("feedback.screenshotPermission.description")}
              </p>
            </div>

            <div className="d-flex gap-3">
              <button
                onClick={cancelScreenshot}
                className={`btn btn-light flex-fill fw-medium ${styles.modalButton}`}
              >
                {t("feedback.screenshotPermission.cancel")}
              </button>
              <button
                onClick={allowScreenshot}
                className={`btn btn-primary flex-fill fw-bold ${styles.modalPrimaryButton}`}
              >
                {t("feedback.screenshotPermission.allow")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
