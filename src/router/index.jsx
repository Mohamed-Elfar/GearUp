import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage, SplashPage } from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Splash Page - No Layout */}
      <Route path="/" element={<SplashPage />} />

      {/* Main App Routes with Layout */}
      <Route path="/home" element={<RootLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </>
  )
);

export default router;
