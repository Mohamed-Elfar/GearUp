import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage, SplashPage } from "../pages";
import ProfilePage from "../components/Profile/ProfilePage";
import AuthCallback from "../components/AuthCallback";
import NearbySearch from "../components/Map/NearbySearch";
import AdminDashboard from "../components/Admin/AdminDashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Splash Page - No Layout */}
      <Route path="/" element={<SplashPage />} />
      
      {/* Auth Callback - No Layout */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Admin Dashboard - No Layout */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* Map Search - No Layout */}
      <Route path="/map" element={
        <div className="container py-4">
          <h2 className="mb-4">Find Nearby Services</h2>
          <div className="row">
            <div className="col-lg-6">
              <NearbySearch searchType="shops" />
            </div>
            <div className="col-lg-6">
              <NearbySearch searchType="services" />
            </div>
          </div>
        </div>
      } />

      {/* Main App Routes with Layout */}
      <Route path="/home" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </>
  )
);export default router;
