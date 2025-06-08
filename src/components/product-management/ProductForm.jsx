import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaProductHunt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './CreateProduct.scss';

const ProductForm = ({ onSubmit, onCancel, product = {}, allProducts = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    modelNumber: '',
  });

  const isEditing = Boolean(product._id);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        modelNumber: product.modelNumber || '',
      });
    }
  }, [isEditing, product]);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, modelNumber } = formData;

    if (!name.trim() || !description.trim()) {
      toast('error', 'Please fill all required fields.');
      return;
    }

    let finalModelNumber = modelNumber.trim();
    if (!finalModelNumber) {
      finalModelNumber = `AUTO-${Date.now().toString(36)}`;
    }

    const modelExists = !isEditing && allProducts.some(
      (p) => p.modelNumber === finalModelNumber
    );

    if (modelExists) {
      toast('error', 'Model number already exists.');
      return;
    }

    const submittedProduct = {
      name: name.trim(),
      description: description.trim(),
      modelNumber: finalModelNumber,
      ...(isEditing && { _id: product._id }),
    };

    toast('success', isEditing ? 'Product updated' : 'Product submitted');
    onSubmit(submittedProduct);
  };

  return (
    <div className="create-product-container">
      <div className="card create-product-card">
        <button className="back-button" onClick={onCancel} type="button">
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
                placeholder="Leave blank to auto-generate"
                value={formData.modelNumber}
                onChange={handleChange}
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

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  product: PropTypes.object,
  allProducts: PropTypes.array,
};

export default ProductForm;
