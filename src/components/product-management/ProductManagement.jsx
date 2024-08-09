import React, { useState } from 'react';
import {
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdLocalFlorist,
} from 'react-icons/md';
import "./ProductManagement.scss";

const initialProducts = [
  { id: 1, name: "Agventure", description: "Advanced agricultural solutions for modern farming." },
  { id: 2, name: "Hydroponics Automation", description: "Automated hydroponic systems for efficient growth." },
  { id: 3, name: "Mushroom Farm Automation", description: "State-of-the-art automation for mushroom farming." },
  { id: 4, name: "Green House Automation", description: "Control and monitor greenhouse environments efficiently." },
  { id: 5, name: "Aquaponics Automation", description: "Integrated systems for aquaponics farming." },
  { id: 6, name: "Smart Irrigation", description: "Smart systems for efficient water usage in agriculture." },
  { id: 7, name: "Soil Monitoring", description: "Advanced soil monitoring systems for optimized farming." },
  // Add more products as needed
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-management-page">
      <h1>Product Management</h1>

      {!isAddingProduct && !editingProduct && (
        <div className="product-actions">
          <button className="action-button" onClick={() => setIsAddingProduct(true)}>
            <MdAddCircle size={24} />
            Add New Product
          </button>
        </div>
      )}

      {isAddingProduct && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddingProduct(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {!isAddingProduct && !editingProduct && (
        <div className="product-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <span className="product-icon">
                  <MdLocalFlorist size={48} />
                </span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <div className="product-actions">
                <button className="edit-button" onClick={() => setEditingProduct(product)}>
                  <MdEdit size={20} />
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
                  <MdDelete size={20} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAddingProduct && !editingProduct && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const ProductForm = ({ product = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...product, ...formData });
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
        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`page-button ${number === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default ProductManagement;
