import React, { useState, useEffect } from 'react';
import {
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdLocalFlorist,
} from 'react-icons/md';
import "./ProductManagement.scss";
import {Products, addProduct, deleteProduct, updateProduct} from '../../api/productsFetch'; // Assuming Products is a function that fetches product data

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Fetch the product data asynchronously when the component mounts
    const fetchProducts = async () => {
      const fetchedProducts = await Products(); // Assuming Products returns a promise with the data
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setIsAddingProduct(false);
    addProduct(newProduct); // Assuming addProduct is a function that sends a POST request to the API
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(product => product._id === updatedProduct._id ? updatedProduct : product));
    setEditingProduct(null);
    updateProduct(updatedProduct); // Assuming updateProduct is a function that sends a PUT request to the API
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product._id !== productId));
    deleteProduct(productId); // Assuming deleteProduct is a function that sends a DELETE request to the API
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
            <div key={product._id} className="product-card">
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
                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>
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
    userId: "66d32e8f5bc4567c833a0ba8",
    modelNumber: product.modelNumber || "",
    productType: product.productType || "",
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
      <h2>{product._id ? "Edit Product" : "Add New Product"}</h2>
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
            name="modelNumber"
            value={formData.modelNumber }
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Type:</label>
          <input
            name="productType"
            value={formData.productType }
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
