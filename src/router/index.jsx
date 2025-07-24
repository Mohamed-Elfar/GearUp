import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage, SplashPage } from "../pages";
import SellerAddProducts from "../pages/MainContentSeller/SellerAddProducts";

import SellerDashboard from "../pages/SellerDashboard/SellerDashboard";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SplashPage />} />

      <Route path="/home" element={<RootLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/seller" element={<SellerDashboard />}>
        <Route path="dashboard" element={<SellerAddProducts />} />{" "}
        <Route path="orders" element={<overViews />} />{" "}
      </Route>
    </>
  )
);

export default router;
