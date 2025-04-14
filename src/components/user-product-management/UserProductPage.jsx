import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userProductsFetch, deleteUserProduct } from "../../api/userProductsFetch";
import "./UserProductPage.scss";
import AddProduct from "./AddProduct"; // Import AddProduct component
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2 for confirmation dialogs

const UserProductsPage = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Track the product being edited

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const products = await userProductsFetch(userId);
        setUserProducts(products);
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    };
    fetchUserProducts();
  }, [userId]);

  const handleEditProduct = (product) => {
    setEditingProduct(product); // Set the product to edit
  };

  const handleDeleteProduct = async (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUserProduct(productId); // Call the API to delete the product
          setUserProducts(userProducts.filter((product) => product._id !== productId)); // Update the state
          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error!", "An error occurred while deleting the product.", "error");
        }
      }
    });
  };

  return (
    <div className="user-products-page">
      <h1>User Products</h1>

      {/* Render Edit Form if there's a product to edit */}
      {editingProduct ? (
        <AddProduct
          product={editingProduct}
          onCancel={() => setEditingProduct(null)} // Close the form without saving
          onSubmit={(updatedProduct) => {
            // Handle the submit for updated product data
            const updatedProducts = userProducts.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            );
            setUserProducts(updatedProducts);
            setEditingProduct(null); // Close the edit form
          }}
        />
      ) : (
        <div className="product-list">
          {userProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-header">
                <h3 className="product-name">{product.alias || "No Alias"}</h3> {/* Display alias name */}
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
              <p className="product-description">{product.productId.description}</p>
              <p>
                <strong>Location:</strong> {product.location}
              </p>
              <p>
                <strong>Installation Date:</strong>{" "}
                {new Date(product.installationDate).toLocaleDateString()}
              </p>

              {/* Sensors Section */}
              <div className="sensors-section">
                <h4>Sensors</h4>
                {product.sensors.length > 0 ? (
                  <ul>
                    {product.sensors.map((sensor, index) => (
                      <li key={index} className="sensor-item">
                        <p>
                          <strong>Sensor:</strong>{" "}
                          {sensor.sensorId ? sensor.sensorId.name : "Unknown"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No sensors available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProductsPage;
