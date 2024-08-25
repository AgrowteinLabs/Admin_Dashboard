import React, { useState } from 'react';

const ProductForm = ({ product = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    serialNumber: product.serialNumber || "",
    productType: product.productType || "",
    location: product.location || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="product-form">
      <h2>{product.id ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Serial Number:</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Type:</label>
          <input
            type="text"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
