import React, { useState, useRef } from "react";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productImages, setProductImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // NEW: expanded/collapsed state
  const fileInputRef = useRef(null);

  // Sample data for dashboard stats with icons
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      change: "+12%",
      positive: true,
      icon: "bi-currency-dollar",
      color: "text-success",
    },
    {
      title: "Orders",
      value: "189",
      change: "+5%",
      positive: true,
      icon: "bi-cart3",
      color: "text-primary",
    },
    {
      title: "Products",
      value: "42",
      change: "+3",
      positive: true,
      icon: "bi-box-seam",
      color: "text-info",
    },
    {
      title: "Return Rate",
      value: "3.2%",
      change: "-0.5%",
      positive: false,
      icon: "bi-arrow-return-left",
      color: "text-warning",
    },
  ];

  // Sample recent orders data
  const recentOrders = [
    {
      id: "#12345",
      date: "2023-05-15",
      customer: "John Doe",
      amount: "$125.00",
      status: "Shipped",
    },
    {
      id: "#12346",
      date: "2023-05-14",
      customer: "Jane Smith",
      amount: "$89.50",
      status: "Processing",
    },
    {
      id: "#12347",
      date: "2023-05-13",
      customer: "Robert Johnson",
      amount: "$245.75",
      status: "Delivered",
    },
    {
      id: "#12348",
      date: "2023-05-12",
      customer: "Emily Davis",
      amount: "$67.30",
      status: "Cancelled",
    },
  ];

  // Sample products data
  const products = [
    {
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      price: "$99.99",
      stock: 25,
      status: "Active",
    },
    {
      name: "Cotton T-Shirt",
      sku: "CT-002",
      category: "Clothing",
      price: "$19.99",
      stock: 50,
      status: "Active",
    },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (productImages.length < 10) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file,
            preview: e.target.result,
          };
          setProductImages((prev) => [...prev, imageData]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Product would be saved! (This is a demo)");
    // Reset form
    e.target.reset();
    setProductImages([]);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Cancelled":
        return "bg-danger";
      case "Delivered":
        return "bg-success";
      case "Active":
        return "bg-success";
      default:
        return "bg-primary";
    }
  };

  // Sidebar width and label visibility based on expanded state
  const sidebarWidth = sidebarExpanded ? "220px" : "64px";
  const showLabels = sidebarExpanded;

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <style>{`
        .seller-dashboard {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .sidebar {
          background-color: #212529;
          transition: all 0.3s;
          min-height: 100vh;
          width: ${sidebarWidth};
          position: relative;
        }
        .sidebar .nav-link {
          padding: 0.75rem 1rem;
          border-radius: 0.25rem;
          margin: 0 0.5rem;
          transition: all 0.2s;
          color: white;
          border: none;
          background: none;
          width: calc(100% - 1rem);
          justify-content: ${showLabels ? "flex-start" : "center"};
        }
        .sidebar .nav-link .sidebar-label {
          display: ${showLabels ? "inline" : "none"};
          transition: opacity 0.2s;
          opacity: ${showLabels ? 1 : 0};
        }
        .sidebar .nav-link i {
          font-size: 1.25rem;
          margin-right: ${showLabels ? "0.75rem" : "0"};
        }
        .sidebar-toggle-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          background: #343a40;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .sidebar-toggle-btn:hover {
          background: #495057;
        }
        @media (max-width: 767.98px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: ${sidebarOpen ? "0" : "-100%"};
            width: 220px;
            z-index: 1050;
            height: 100vh;
            overflow-y: auto;
            transition: left 0.3s ease;
          }
        }
        .main-content {
          padding-top: 1rem;
          padding-bottom: 2rem;
          transition: margin-left 0.3s;
          margin-left: ${sidebarExpanded ? "220px" : "64px"};
        }
        @media (max-width: 767.98px) {
          .main-content {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="seller-dashboard">
        {/* Mobile Header */}
        <header className="d-md-none bg-dark text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-shop me-2"></i>
              <h1 className="h5 mb-0">Seller Dashboard</h1>
            </div>
            <button className="btn btn-outline-light" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </header>

        {/* Sidebar Overlay for Mobile */}
        <div className="sidebar-overlay" onClick={closeSidebar}></div>

        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Sidebar */}
            <nav
              className="col-md-3 col-lg-2 d-md-block sidebar"
              style={{ width: sidebarWidth }}
            >
              {/* Expand/Collapse Button */}
              <button
                className="sidebar-toggle-btn"
                onClick={() => setSidebarExpanded((prev) => !prev)}
                title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                type="button"
              >
                <i
                  className={`bi ${
                    sidebarExpanded ? "bi-chevron-left" : "bi-chevron-right"
                  }`}
                ></i>
              </button>
              <div className="position-sticky pt-3">
                <div className="sidebar-header d-none d-md-block p-3 text-white">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shop me-2 fs-4"></i>
                    {showLabels && (
                      <h2 className="h5 mb-0">Seller Dashboard</h2>
                    )}
                  </div>
                </div>
                <ul className="nav flex-column nav-pills gap-1">
                  <li className="nav-item">
                    <button
                      className={`nav-link text-start d-flex align-items-center ${
                        activeTab === "dashboard" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("dashboard");
                        setSidebarOpen(false);
                      }}
                      style={{ minHeight: "48px" }}
                    >
                      <i className="bi bi-speedometer2"></i>
                      {showLabels && (
                        <span className="sidebar-label ms-2">Dashboard</span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link text-start d-flex align-items-center ${
                        activeTab === "orders" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("orders")}
                      style={{ minHeight: "48px" }}
                    >
                      <i className="bi bi-cart"></i>
                      {showLabels && (
                        <span className="sidebar-label ms-2">Orders</span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link text-start d-flex align-items-center ${
                        activeTab === "products" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("products")}
                      style={{ minHeight: "48px" }}
                    >
                      <i className="bi bi-box-seam"></i>
                      {showLabels && (
                        <span className="sidebar-label ms-2">Products</span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link text-start d-flex align-items-center ${
                        activeTab === "addProducts" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("addProducts")}
                      style={{ minHeight: "48px" }}
                    >
                      <i className="bi bi-plus-circle"></i>
                      {showLabels && (
                        <span className="sidebar-label ms-2">Add Product</span>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Main Content */}
            <main className="col-md-9 col-lg-10 ms-sm-auto px-md-4 main-content">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="pt-4">
                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-speedometer2 me-2 text-primary fs-3"></i>
                    <h2 className="mb-0">Dashboard Overview</h2>
                  </div>

                  <div className="row mb-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="col-md-6 col-lg-3 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="card-title text-muted">
                                  {stat.title}
                                </h5>
                                <h3 className="card-text">{stat.value}</h3>
                              </div>
                              <i
                                className={`${stat.icon} fs-2 ${stat.color}`}
                              ></i>
                            </div>
                            <div className="d-flex align-items-center">
                              <span
                                className={`badge rounded-pill ${
                                  stat.positive ? "bg-success" : "bg-danger"
                                } me-2`}
                              >
                                {stat.change}
                              </span>
                              <span
                                className="text-muted"
                                style={{ fontSize: "0.875rem" }}
                              >
                                {stat.positive
                                  ? "Compared to last month"
                                  : "Compared to last month"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h3 className="h5">Recent Orders</h3>
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.date}</td>
                              <td>{order.customer}</td>
                              <td>{order.amount}</td>
                              <td>
                                <span
                                  className={`badge rounded-pill ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="pt-4">
                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-cart me-2 text-primary fs-3"></i>
                    <h2 className="mb-0">Manage Orders</h2>
                  </div>

                  <div className="mb-4">
                    <h3 className="h5">Recent Orders</h3>
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.date}</td>
                              <td>{order.customer}</td>
                              <td>{order.amount}</td>
                              <td>
                                <span
                                  className={`badge rounded-pill ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary me-2">
                                  <i className="bi bi-pencil"></i> Edit
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div className="pt-4">
                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-box-seam me-2 text-primary fs-3"></i>
                    <h2 className="mb-0">Manage Products</h2>
                  </div>

                  <div className="mb-4">
                    <h3 className="h5">Your Products</h3>
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => (
                            <tr key={index}>
                              <td>{product.name}</td>
                              <td>{product.sku}</td>
                              <td>{product.category}</td>
                              <td>{product.price}</td>
                              <td>{product.stock}</td>
                              <td>
                                <span
                                  className={`badge rounded-pill ${getStatusBadgeClass(
                                    product.status
                                  )}`}
                                >
                                  {product.status}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary me-2">
                                  <i className="bi bi-pencil"></i> Edit
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Product Tab */}
              {activeTab === "addProducts" && (
                <div className="pt-4">
                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-plus-circle me-2 text-primary fs-3"></i>
                    <h2 className="mb-0">Add New Product</h2>
                  </div>

                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="productName"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        name="sku"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" name="status" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Product Images</label>
                      <div className="d-flex flex-wrap gap-2">
                        {productImages.map((image, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={image.preview}
                              alt={`Product Image ${index + 1}`}
                              className="img-thumbnail"
                              style={{ maxWidth: "150px", maxHeight: "150px" }}
                            />
                            <button
                              type="button"
                              className="btn-close position-absolute top-0 end-0"
                              onClick={() => removeImage(index)}
                              aria-label="Remove image"
                            ></button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={triggerFileInput}
                          disabled={productImages.length >= 10}
                        >
                          <i className="bi bi-plus"></i> Add Image
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
