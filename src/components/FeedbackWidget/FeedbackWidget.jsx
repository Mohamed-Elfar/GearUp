// src/components/FeedbackWidget/FeedbackWidget.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import Styles from "./FeedbackWidget.module.css";
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
      <div className="fixed bottom-0 sm:left-8 md:left-16 z-50 ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={Styles.feedbackBtn}
        >
          <span>💬</span>
          <span className="font-medium">{t("feedback.button")}</span>
        </button>
      </div>

      {/* Feedback Panel */}
      {isOpen && (
        <div className="fixed bottom-16 sm:left-8 md:left-16 z-50">
          <div className="bg-primary-500 text-white rounded-t-lg shadow-xl w-96 overflow-hidden">
            {!selectedType ? (
              // Type Selection Panel
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">
                    {t("feedback.title")}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedType("idea")}
                    className="w-full p-3 bg-primary-700 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      💡
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {t("feedback.idea.title")}
                      </div>
                      <div className="text-sm text-blue-100">
                        {t("feedback.idea.description")}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedType("issue")}
                    className="w-full p-3 bg-primary-700 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                      🐛
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {t("feedback.issue.title")}
                      </div>
                      <div className="text-sm text-blue-100">
                        {t("feedback.issue.description")}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // Form Panel
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedType(null)}
                    className="text-white hover:text-gray-200 fs-2"
                  >
                    {language === "AR" ? "→" : "←"}
                  </button>
                  <h3 className="font-semibold text-white">
                    {selectedType === "idea"
                      ? t("feedback.idea.title")
                      : t("feedback.issue.title")}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={t("feedback.form.fullName")}
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
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
                      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
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
                      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
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
                      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500 resize-none"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleScreenshot}
                        className="flex-1 p-2 bg-primary-700 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
                      >
                        📷{" "}
                        <span className="text-sm">
                          {t("feedback.form.screenshot")}
                        </span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 p-2 bg-primary-700 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
                      >
                        📎{" "}
                        <span className="text-sm">
                          {t("feedback.form.upload")}
                        </span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="hidden"
                    />

                    {/* Display uploaded file */}
                    {uploadedFile && (
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded min-h-[60px]">
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <span className="text-sm truncate text-gray-800">
                            {uploadedFile.name}
                          </span>
                          <span className="text-xs text-gray-600">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Display screenshot */}
                    {screenshot && (
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded min-h-[60px]">
                        <div className="flex items-center gap-2">
                          <span>📷</span>
                          <span className="text-sm text-gray-800">
                            {t("feedback.files.screenshot")}
                          </span>
                          <span className="text-xs text-gray-600">
                            {(screenshot.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={removeScreenshot}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full p-2 bg-secondary-400 hover:bg-secondary-600 rounded font-medium transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🖥️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("feedback.screenshotPermission.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("feedback.screenshotPermission.description")}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelScreenshot}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
              >
                {t("feedback.screenshotPermission.cancel")}
              </button>
              <button
                onClick={allowScreenshot}
                className="flex-1 px-4 py-2 bg-primary-700 text-white font-bold rounded hover:bg-primary-800 transition-colors"
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
