import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage, SplashPage } from "../pages";
import ProfilePage from "../components/Profile/ProfilePage";
import AuthCallback from "../components/AuthCallback";
import GeolocationTest from "../components/GeolocationTest";
import NearbySearch from "../components/Map/NearbySearch";
import LocationTest from "../components/LocationTest";
import LocationDebug from "../components/LocationDebug";
import AddressTestPage from "../components/AddressTestPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Splash Page - No Layout */}
      <Route path="/" element={<SplashPage />} />

      {/* Auth Callback - No Layout */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Geolocation Test - No Layout */}
      <Route path="/test/geolocation" element={<GeolocationTest />} />

      {/* Location Permission Test - No Layout */}
      <Route path="/test/location" element={<LocationTest />} />

      {/* Location Debug - No Layout */}
      <Route path="/test/debug" element={<LocationDebug />} />

      {/* Address Test - No Layout */}
      <Route path="/test/address" element={<AddressTestPage />} />

      {/* Map Test - No Layout */}
      <Route
        path="/test/map"
        element={
          <div className="container py-4">
            <h2 className="mb-4">Map Search Test</h2>
            <div className="row">
              <div className="col-lg-6">
                <NearbySearch searchType="shops" />
              </div>
              <div className="col-lg-6">
                <NearbySearch searchType="services" />
              </div>
            </div>
          </div>
        }
      />

      {/* Main App Routes with Layout */}
      <Route path="/home" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </>
  )
);

export default router;
