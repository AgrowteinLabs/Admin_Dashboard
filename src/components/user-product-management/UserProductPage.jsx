import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  userProductsFetch,
  deleteUserProduct,
  updateDeviceBillingStatus,
} from "../../api/userProductsFetch";
import "./UserProductPage.scss";
import AddProduct from "./AddProduct";
import { FaEdit, FaTrash, FaShieldAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const UserProductsPage = () => {
  const { userId } = useParams();
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState(null); // For undo

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const products = await userProductsFetch(userId);
      setUserProducts(products);
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

  return (
    <div className="user-products-page">
      <h1>User Products</h1>

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
          {userProducts.length === 0 ? (
            <p className="no-sensors">No products assigned to this user.</p>
          ) : (
            userProducts.map((product) => {
              const status = product.billingStatus || "ACTIVE";
              return (
                <div key={product._id} className="product-card">
                  <div className="product-header">
                    <div>
                      <h3 className="product-name">
                        {product.alias || "Unnamed Product"}
                      </h3>
                      <span className="uid-chip">UID: {product.uid}</span>
                    </div>
                    <div className="product-actions">
                      <button
                        onClick={() => handleManageBilling(product)}
                        className="billing-button"
                        title="Manage Data Display & Billing Access"
                      >
                        <FaShieldAlt /> Access
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="edit-button"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="delete-button"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="billing-status-row">
                    <strong>Access Status: </strong>
                    {status === "ACTIVE" && (
                      <span className="status-badge badge-active">
                        🟢 Active (Display & Save)
                      </span>
                    )}
                    {status === "PAYMENT_HOLD_RECORDING" && (
                      <span
                        className="status-badge badge-hold"
                        title={product.statusReason || "Payment pending"}
                      >
                        🟡 Payment Hold (Hide Display, Save DB)
                      </span>
                    )}
                    {status === "SUSPENDED_BLOCKED" && (
                      <span
                        className="status-badge badge-suspended"
                        title={product.statusReason || "Suspended"}
                      >
                        🔴 Suspended (Cut Off & Dropped)
                      </span>
                    )}
                    {product.statusReason && (
                      <p className="status-reason-text">
                        <em>Note: {product.statusReason}</em>
                      </p>
                    )}
                  </div>

                  <p className="product-description">
                    {product.productId?.description || "No description"}
                  </p>
                  <p>
                    <strong>Location:</strong> {product.location || "Unknown"}
                  </p>
                  <p>
                    <strong>Installation Date:</strong>{" "}
                    {new Date(product.installationDate).toLocaleDateString()}
                  </p>

                  <div className="sensors-section">
                    <h4>Sensors</h4>
                    {product.sensors?.length > 0 ? (
                      <ul>
                        {product.sensors.map((sensor, index) => (
                          <li key={index} className="sensor-item">
                            <p>
                              <strong>Sensor:</strong>{" "}
                              {sensor.sensorId?.name || "Unknown Sensor"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-sensors">No sensors available.</p>
                    )}
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
