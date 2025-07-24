import { faSliders, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function SellerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
    { icon: faSliders, text: "Dashboard", path: "dashboard" },
    { icon: faSliders, text: "Orders", path: "orders" },
    { icon: faSliders, text: "Products", path: "products" },
    { icon: faSliders, text: "Customers", path: "customers" },
    { icon: faSliders, text: "AddProduct", path: "AddProduct" },
  ];

  return (
    <div className="container-fluid p-0 d-flex flex-column vh-100">
      {/* Header */}
      <header className="bg-success py-2 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white p-1"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon
              icon={sidebarCollapsed ? faBars : faTimes}
              className="fs-4"
            />
          </button>
          <img
            src="/src/assets/logo.png"
            alt="Company Logo"
            className="img-fluid ms-2"
            style={{ maxHeight: "40px" }}
          />
        </div>

        <button className="btn btn-link text-white p-1" aria-label="Settings">
          <FontAwesomeIcon icon={faSliders} className="fs-4" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-danger d-flex flex-column ${
            sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
          }`}
          style={{
            width: sidebarCollapsed ? "70px" : "250px",
            transition: "width 0.7s ease",
          }}
        >
          <nav className="h-100 py-3">
            {menuItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className={`w-100 btn btn-link text-white text-decoration-none d-flex ${
                  sidebarCollapsed
                    ? "flex-column align-items-center py-2 px-0"
                    : "align-items-center py-2 px-3"
                }`}
                style={{
                  transition: "all 0.7s ease",
                }}
              >
                <FontAwesomeIcon icon={item.icon} className="fs-5" />
                <span className={`${sidebarCollapsed ? "mt-1 small" : "ms-3"}`}>
                  {item.text}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-light flex-grow-1 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerDashboard;
