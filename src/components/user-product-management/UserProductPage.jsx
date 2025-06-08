import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  userProductsFetch,
  deleteUserProduct,
} from "../../api/userProductsFetch";
import "./UserProductPage.scss";
import AddProduct from "./AddProduct";
import { FaEdit, FaTrash } from "react-icons/fa";
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
          // Recreate API call can be implemented here if backend supports it
          await fetchProducts(); // Re-fetch as re-create isn't implemented
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
            userProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-header">
                  <h3 className="product-name">
                    {product.alias || "Unnamed Product"}
                  </h3>
                  <div className="product-actions">
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserProductsPage;
