import { Outlet } from "react-router-dom";
import { Footer, Header, Navbar, FeedbackWidget } from "../components";

const RootLayout = () => {
  return (
    <main className="d-flex flex-column min-vh-100">
      <Navbar />
      {/* <Header /> */}
      <div
        className="flex-grow-1"
        style={{ minHeight: "calc(100vh - 128px)", marginTop: "88px" }}
      >
        <Outlet />
      </div>
      <Footer />
      <FeedbackWidget />
    </main>
  );
};

export default RootLayout;
