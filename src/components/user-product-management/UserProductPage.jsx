import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  userProductsFetch,
  deleteUserProduct,
  updateDeviceBillingStatus,
} from "../../api/userProductsFetch";
import "./UserProductPage.scss";
import AddProduct from "./AddProduct";
import { FaEdit, FaTrash, FaShieldAlt } from "react-icons/fa";
import {
  MdArrowBack,
  MdLocationOn,
  MdCalendarToday,
  MdSensors,
  MdSearch,
  MdMemory,
  MdFilterList,
} from "react-icons/md";
import Swal from "sweetalert2";

const formatLocation = (loc) => {
  if (!loc) return "Location not set";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    return loc.name || (loc.lat != null && loc.lon != null ? `${loc.lat}, ${loc.lon}` : "Location not set");
  }
  return String(loc);
};

const UserProductsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState(null); // For undo
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const products = await userProductsFetch(userId);
      setUserProducts(products || []);
    } catch (error) {
      console.error("Error fetching user products:", error);
      Swal.fire("Error", "Failed to load products", "error");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleManageBilling = async (product) => {
    const currentStatus = product.billingStatus || "ACTIVE";
    const currentReason = product.statusReason || "";

    const { value: formValues } = await Swal.fire({
      title: `Access & Billing: ${product.alias}`,
      html: `
        <div style="text-align: left; font-size: 14px; font-family: inherit;">
          <p style="margin-bottom: 12px; color: #555;">
            <strong>UID:</strong> <code>${product.uid}</code>
          </p>
          <label style="display:block; margin-bottom: 6px; font-weight: 600; color: #333;">Data Display & Storage Status:</label>
          <select id="swal-billing-status" class="swal2-input" style="width: 100%; margin: 0 0 16px 0; height: 42px; font-size: 14px;">
            <option value="ACTIVE" ${currentStatus === "ACTIVE" ? "selected" : ""}>
              🟢 Active (Show Dashboard & Save to DB)
            </option>
            <option value="PAYMENT_HOLD_RECORDING" ${currentStatus === "PAYMENT_HOLD_RECORDING" ? "selected" : ""}>
              🟡 Payment Hold (Hide Dashboard, KEEP Saving to DB)
            </option>
            <option value="SUSPENDED_BLOCKED" ${currentStatus === "SUSPENDED_BLOCKED" ? "selected" : ""}>
              🔴 Hard Suspension (Hide Dashboard, STOP Saving to DB)
            </option>
          </select>
          <label style="display:block; margin-bottom: 6px; font-weight: 600; color: #333;">Reason / Admin Note:</label>
          <input id="swal-billing-reason" class="swal2-input" style="width: 100%; margin: 0; font-size: 14px;" placeholder="e.g. Overdue payment for Invoice #1024" value="${currentReason}" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Apply Status",
      confirmButtonColor: "#03856d",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          status: document.getElementById("swal-billing-status").value,
          reason: document.getElementById("swal-billing-reason").value,
        };
      },
    });

    if (formValues) {
      try {
        await updateDeviceBillingStatus(
          product.uid,
          formValues.status,
          formValues.reason
        );
        setUserProducts((prev) =>
          prev.map((p) =>
            p.uid === product.uid
              ? {
                  ...p,
                  billingStatus: formValues.status,
                  statusReason: formValues.reason,
                }
              : p
          )
        );
        Swal.fire(
          "Updated!",
          `Device ${product.uid} status set to ${formValues.status}`,
          "success"
        );
      } catch (err) {
        Swal.fire(
          "Update Failed",
          err.response?.data?.error?.message || "Failed to update billing status",
          "error"
        );
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const productToDelete = userProducts.find((p) => p._id === productId);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteUserProduct(productId);
        setDeletedProduct(productToDelete); // store deleted
        setUserProducts(userProducts.filter((p) => p._id !== productId));

        const undo = await Swal.fire({
          icon: "info",
          title: "Deleted",
          text: "You can undo this action for 10 seconds.",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Undo",
          timer: 10000,
          timerProgressBar: true,
        });

        if (undo.isConfirmed && deletedProduct) {
          await fetchProducts();
          setDeletedProduct(null);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error", "Failed to delete the product", "error");
      }
    }
  };

  const filteredProducts = userProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const locString = formatLocation(product.location).toLowerCase();
    const matchesSearch =
      !query ||
      (product.alias && product.alias.toLowerCase().includes(query)) ||
      (product.uid && product.uid.toLowerCase().includes(query)) ||
      locString.includes(query);

    const status = product.billingStatus || "ACTIVE";
    const matchesStatus =
      statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="user-products-page">
      {/* Top Header Bar */}
      <div className="user-products-header-bar">
        <div className="header-left">
          <button
            onClick={() => navigate("/user-product-management")}
            className="back-btn"
            title="Return to User Management"
          >
            <MdArrowBack /> <span>Back to Users</span>
          </button>
          <div className="page-title-box">
            <h1>User Products</h1>
            <span className="badge-device-count">
              {userProducts.length} {userProducts.length === 1 ? "Device" : "Devices"}
            </span>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by alias, UID, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <MdFilterList className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">🟢 Active</option>
              <option value="PAYMENT_HOLD_RECORDING">🟡 Payment Hold</option>
              <option value="SUSPENDED_BLOCKED">🔴 Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {editingProduct ? (
        <AddProduct
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSubmit={(updatedProduct) => {
            const updatedList = userProducts.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            );
            setUserProducts(updatedList);
            setEditingProduct(null);
            Swal.fire("Updated", "Product updated successfully", "success");
          }}
        />
      ) : (
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="no-products-empty-state">
              <p className="empty-title">
                {userProducts.length === 0
                  ? "No products assigned to this user."
                  : "No products match your search or filter."}
              </p>
              {searchQuery && (
                <button
                  className="reset-search-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => {
              const status = product.billingStatus || "ACTIVE";
              return (
                <div key={product._id} className="product-card">
                  {/* Card Header: Title & Monospace UID, + Status Badge */}
                  <div className="product-card-header">
                    <div className="title-section">
                      <h3 className="product-name" title={product.alias || "Unnamed Product"}>
                        {product.alias || "Unnamed Product"}
                      </h3>
                      <span className="uid-chip">
                        <MdMemory className="chip-icon" />
                        <code>{product.uid}</code>
                      </span>
                    </div>

                    <div className="status-badge-container">
                      {status === "ACTIVE" && (
                        <span className="status-badge badge-active" title="Displaying & Logging Data">
                          <span className="status-indicator"></span> Active
                        </span>
                      )}
                      {status === "PAYMENT_HOLD_RECORDING" && (
                        <span
                          className="status-badge badge-hold"
                          title={product.statusReason || "Payment pending - Data hidden from user"}
                        >
                          <span className="status-indicator"></span> Payment Hold
                        </span>
                      )}
                      {status === "SUSPENDED_BLOCKED" && (
                        <span
                          className="status-badge badge-suspended"
                          title={product.statusReason || "Hardware blocked"}
                        >
                          <span className="status-indicator"></span> Suspended
                        </span>
                      )}
                    </div>
                  </div>

                  {product.statusReason && (
                    <div className="status-reason-banner">
                      <span>Notice: {product.statusReason}</span>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="product-card-body">
                    <p className="product-description">
                      {typeof product.productId?.description === "string"
                        ? product.productId.description
                        : "Automation for Fungiculture."}
                    </p>

                    <div className="product-metadata-grid">
                      <div className="meta-item">
                        <MdLocationOn className="meta-icon" />
                        <span className="meta-text">{formatLocation(product.location)}</span>
                      </div>
                      <div className="meta-item">
                        <MdCalendarToday className="meta-icon" />
                        <span className="meta-text">
                          Installed: {product.installationDate ? new Date(product.installationDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Sensors Chips Section */}
                    <div className="sensors-section">
                      <div className="sensors-header">
                        <h4>Sensors</h4>
                        <span className="sensors-pill-count">
                          {product.sensors?.length || 0}
                        </span>
                      </div>

                      {product.sensors?.length > 0 ? (
                        <div className="sensors-tags-wrapper">
                          {product.sensors.map((sensor, index) => {
                            const sensorName =
                              sensor.sensorId?.name ||
                              (typeof sensor.name === "string" ? sensor.name : "Sensor");
                            return (
                              <div key={index} className="sensor-tag">
                                <MdSensors className="sensor-tag-icon" />
                                <span className="sensor-name">
                                  {sensorName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="no-sensors">No sensors attached</p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Action Bar */}
                  <div className="product-card-footer">
                    <button
                      onClick={() => handleManageBilling(product)}
                      className="card-action-btn billing-action"
                      title="Manage Data Display & Billing Access"
                    >
                      <FaShieldAlt /> Access
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="card-action-btn edit-action"
                      title="Edit Product"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="card-action-btn delete-action"
                      title="Delete Product"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UserProductsPage;
