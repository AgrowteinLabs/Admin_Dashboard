import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaProductHunt } from 'react-icons/fa'; // Importing back icon
import './CreateProduct.scss'; // Reusing the same SCSS file for consistency

const ProductForm = ({ onSubmit, onCancel, product = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelNumber: "",
  });

  const isEditing = !!product._id; // If the product has an _id, it means we are editing

  // Using useEffect to update formData when the product prop changes (i.e., when editing a product)
  useEffect(() => {
    if (product?._id) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        modelNumber: product.modelNumber || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the _id exists before submitting
    if (!formData.name || !formData.description || !formData.modelNumber) {
      alert("Please fill in all fields.");
      return;
    }

    if (!product._id) {
      alert("Product ID is missing. Please try again.");
      return;
    }

    const updatedProduct = {
      _id: product._id, // Make sure the _id is included
      name: formData.name,
      description: formData.description,
      modelNumber: formData.modelNumber,
    };

    onSubmit(updatedProduct); // Pass the updated product to the onSubmit function
  };

  return (
    <div className="create-product-container">
      <div className="card create-product-card">
        <button className="back-button" onClick={onCancel}>
          <FaArrowLeft /> Back
        </button>
        <h4 className="card-title">
          <FaProductHunt />
          {isEditing ? 'Edit Product' : 'Add Product'}
        </h4>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Model Number:</label>
              <input
                type="text"
                name="modelNumber"
                placeholder="Enter model number"
                value={formData.modelNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {isEditing ? 'Save Changes' : 'Add Product'}
              </button>
              <button type="button" className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
