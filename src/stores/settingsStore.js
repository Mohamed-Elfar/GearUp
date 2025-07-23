import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      // State
      theme: "light", // 'light' | 'dark'
      language: "en", // 'en' | 'ar'
      currency: "USD",
      notifications: {
        orders: true,
        messages: true,
        services: true,
        marketing: false,
        push: true,
        email: true,
        sms: false,
      },
      location: {
        enabled: false,
        latitude: null,
        longitude: null,
        address: "",
      },
      privacy: {
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        allowServiceRequests: true,
      },

      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", theme);
      },

      setLanguage: (language) => {
        set({ language });
        // Apply language direction
        document.documentElement.setAttribute(
          "dir",
          language === "ar" ? "rtl" : "ltr"
        );
        document.documentElement.setAttribute("lang", language);
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      updateNotificationSettings: (updates) => {
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        }));
      },

      updateLocationSettings: (updates) => {
        set((state) => ({
          location: { ...state.location, ...updates },
        }));
      },

      updatePrivacySettings: (updates) => {
        set((state) => ({
          privacy: { ...state.privacy, ...updates },
        }));
      },

      // Location helpers
      requestLocation: async () => {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            });
          });

          const { latitude, longitude } = position.coords;

          // Reverse geocoding to get address (you might want to use a service for this)
          let address = `${latitude}, ${longitude}`;

          try {
            // You can integrate with a geocoding service here
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              address = data.results[0].formatted;
            }
          } catch (geocodeError) {
            console.warn("Geocoding failed:", geocodeError);
          }

          set((state) => ({
            location: {
              ...state.location,
              enabled: true,
              latitude,
              longitude,
              address,
            },
          }));

          return { latitude, longitude, address };
        } catch (error) {
          console.error("Location request failed:", error);
          return null;
        }
      },

      clearLocation: () => {
        set((state) => ({
          location: {
            ...state.location,
            enabled: false,
            latitude: null,
            longitude: null,
            address: "",
          },
        }));
      },

      // Reset to defaults
      resetSettings: () => {
        set({
          theme: "light",
          language: "en",
          currency: "USD",
          notifications: {
            orders: true,
            messages: true,
            services: true,
            marketing: false,
            push: true,
            email: true,
            sms: false,
          },
          location: {
            enabled: false,
            latitude: null,
            longitude: null,
            address: "",
          },
          privacy: {
            showEmail: false,
            showPhone: false,
            allowMessages: true,
            allowServiceRequests: true,
          },
        });
      },
    }),
    {
      name: "gearup-settings", // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        notifications: state.notifications,
        location: state.location,
        privacy: state.privacy,
      }),
    }
  )
);

// Initialize settings on app start
export const initializeSettings = () => {
  const { theme, language } = useSettingsStore.getState();

  // Apply theme
  document.documentElement.setAttribute("data-theme", theme);

  // Apply language and direction
  document.documentElement.setAttribute(
    "dir",
    language === "ar" ? "rtl" : "ltr"
  );
  document.documentElement.setAttribute("lang", language);
};
