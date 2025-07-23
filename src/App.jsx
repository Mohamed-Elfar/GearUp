import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { SEO } from "./components";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { subscribeToAuthChanges, initializeAuth } = useAuthStore();

  useEffect(() => {
    let unsubscribe;

    const initAuth = async () => {
      try {
        // Initialize auth state first
        console.log("App: Initializing auth...");
        await initializeAuth();

        // Then subscribe to auth changes
        console.log("App: Setting up auth subscription...");
        unsubscribe = subscribeToAuthChanges();
      } catch (error) {
        console.error("App: Auth initialization error:", error);
      }
    };

    initAuth();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        console.log("App: Cleaning up auth subscription");
        unsubscribe();
      }
    };
  }, [initializeAuth, subscribeToAuthChanges]);

  return (
    <>
      <SEO />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
