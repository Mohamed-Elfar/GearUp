import React, { useState, useRef } from "react";

export function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productImages, setProductImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // NEW: expanded/collapsed state
  const fileInputRef = useRef(null);

  // Add this state at the top of your component:
  const [productForm, setProductForm] = useState({
    name: "",
    type: "",
    category: "",
    car_make: "",
    car_model: "",
    car_year: "",
    images: "",
    brand: "",
    part_number: "",
    price: "",
    stock: "",
    description: "",
    spec_material: "",
    spec_dimensions: "",
    spec_compatibility: "",
    availability: "",
    warranty: "",
  });

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

  const handleProductInput = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    // Build the object as required
    const productObj = {
      name: productForm.name,
      type: productForm.type,
      category: productForm.category,
      car: [
        {
          make: productForm.car_make,
          model: productForm.car_model,
          year: productForm.car_year
            .split(",")
            .map((y) => parseInt(y.trim()))
            .filter(Boolean),
        },
      ],
      images: productForm.images.split(",").map((img) => img.trim()),
      brand: productForm.brand,
      part_number: productForm.part_number,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      description: productForm.description,
      specifications: {
        material: productForm.spec_material,
        dimensions: productForm.spec_dimensions,
        compatibility: productForm.spec_compatibility,
      },
      availability: productForm.availability,
      warranty: productForm.warranty,
    };
    // For now, just log it (replace with your Supabase call)
    console.log(productObj);
    alert("Product object created! Check console.");
    setProductForm({
      name: "",
      type: "",
      category: "",
      car_make: "",
      car_model: "",
      car_year: "",
      images: "",
      brand: "",
      part_number: "",
      price: "",
      stock: "",
      description: "",
      spec_material: "",
      spec_dimensions: "",
      spec_compatibility: "",
      availability: "",
      warranty: "",
    });
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
  const sidebarWidth = sidebarExpanded ? "250px" : "64px";
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
          nav>div {
          padding: 0}
        .sidebar {
          background-color: #212529;
          transition: all 0.3s;
          min-height: 100vh;
          width: ${sidebarWidth};
          position: relative;
        }
        .sidebar .nav-link {
          padding: 15px;
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
        .sidebar-overlay {
          display: none;
        }
        @media (max-width: 991.98px) {
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
          .sidebar-overlay {
            display: ${sidebarOpen ? "block" : "none"};
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.3);
            z-index: 1040;
          }
        }
        .main-content {
          padding-top: 1rem;
          padding-bottom: 2rem;
          transition: margin-left 0.3s;
          margin-left: ${sidebarExpanded ? "220px" : "64px"};
        }
        @media (max-width: 991.98px) {
          .main-content {
            margin-left: 0;
            width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        /* Enhance form responsiveness */
        @media (max-width: 767.98px) {
          .card .row.g-3 > .col-md-6,
          .card .row.g-3 > .col-md-4,
          .card .row.g-3 > .col-md-3,
          .card .row.g-3 > .col-md-2 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .card .row.g-3 {
            row-gap: 1rem;
          }
          .main-content {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        /* Make image previews wrap nicely on mobile */
        .d-flex.flex-wrap.gap-2 {
          gap: 0.5rem !important;
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
                  <form onSubmit={handleProductSubmit}>
                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Basic Info
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-tag"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={productForm.name}
                                onChange={handleProductInput}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Type</label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-list-ul"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="type"
                                value={productForm.type}
                                onChange={handleProductInput}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Category</label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-grid"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={productForm.category}
                                onChange={handleProductInput}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-car-front me-2 text-primary"></i>
                        Car Compatibility
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label">Car Make</label>
                            <input
                              type="text"
                              className="form-control"
                              name="car_make"
                              value={productForm.car_make}
                              onChange={handleProductInput}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Car Model</label>
                            <input
                              type="text"
                              className="form-control"
                              name="car_model"
                              value={productForm.car_model}
                              onChange={handleProductInput}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">
                              Car Years{" "}
                              <span className="text-muted">
                                (comma separated)
                              </span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="car_year"
                              value={productForm.car_year}
                              onChange={handleProductInput}
                              placeholder="e.g. 2018,2019,2020"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-images me-2 text-primary"></i>
                        Images
                      </div>
                      <div className="card-body">
                        <label className="form-label">
                          Images{" "}
                          <span className="text-muted">
                            (comma separated URLs or upload from device)
                          </span>
                        </label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          name="images"
                          value={productForm.images}
                          onChange={handleProductInput}
                          placeholder="Paste image URLs, separated by commas"
                        />
                        <div className="mb-2">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              files.forEach((file) => {
                                if (productImages.length < 10) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setProductImages((prev) => [
                                      ...prev,
                                      { file, preview: event.target.result },
                                    ]);
                                    // Also update productForm.images with base64 string
                                    setProductForm((prev) => ({
                                      ...prev,
                                      images: prev.images
                                        ? prev.images +
                                          "," +
                                          event.target.result
                                        : event.target.result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              });
                              // Reset input so same file can be uploaded again if needed
                              e.target.value = "";
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={triggerFileInput}
                          >
                            <i className="bi bi-upload me-1"></i>Upload from
                            device
                          </button>
                          <small className="text-muted ms-2">
                            Max 10 images
                          </small>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {/* Show previews for both URLs and uploaded images */}
                          {[
                            ...productForm.images
                              .split(",")
                              .filter(Boolean)
                              .map((img) => img.trim()),
                            ...productImages
                              .filter((imgObj) => imgObj.preview)
                              .map((imgObj) => imgObj.preview),
                          ]
                            .filter(Boolean)
                            .slice(0, 10)
                            .map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="preview"
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  border: "1px solid #eee",
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-box-seam me-2 text-primary"></i>
                        Product Details
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label">Brand</label>
                            <input
                              type="text"
                              className="form-control"
                              name="brand"
                              value={productForm.brand}
                              onChange={handleProductInput}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Part Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="part_number"
                              value={productForm.part_number}
                              onChange={handleProductInput}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Price</label>
                            <input
                              type="number"
                              className="form-control"
                              name="price"
                              value={productForm.price}
                              onChange={handleProductInput}
                              required
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Stock</label>
                            <input
                              type="number"
                              className="form-control"
                              name="stock"
                              value={productForm.stock}
                              onChange={handleProductInput}
                              required
                              min="0"
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              name="description"
                              value={productForm.description}
                              onChange={handleProductInput}
                              rows={2}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-gear me-2 text-primary"></i>
                        Specifications
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label">Material</label>
                            <input
                              type="text"
                              className="form-control"
                              name="spec_material"
                              value={productForm.spec_material}
                              onChange={handleProductInput}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Dimensions</label>
                            <input
                              type="text"
                              className="form-control"
                              name="spec_dimensions"
                              value={productForm.spec_dimensions}
                              onChange={handleProductInput}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Compatibility</label>
                            <input
                              type="text"
                              className="form-control"
                              name="spec_compatibility"
                              value={productForm.spec_compatibility}
                              onChange={handleProductInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light fw-bold">
                        <i className="bi bi-check2-circle me-2 text-primary"></i>
                        Availability & Warranty
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Availability</label>
                            <input
                              type="text"
                              className="form-control"
                              name="availability"
                              value={productForm.availability}
                              onChange={handleProductInput}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Warranty</label>
                            <input
                              type="text"
                              className="form-control"
                              name="warranty"
                              value={productForm.warranty}
                              onChange={handleProductInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-4"
                      >
                        <i className="bi bi-save me-2"></i>Save Product
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
