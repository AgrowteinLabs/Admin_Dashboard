import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete, MdLocalFlorist, MdArrowBack } from 'react-icons/md';
import Swal from 'sweetalert2'; // Import SweetAlert2
import ProductForm from './ProductForm';
import './ProductManagement.scss';
import { productsFetch, addProduct, deleteProduct, updateProduct } from '../../api/productsFetch';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productsFetch(); // Fetch products
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts); // Initialize with all products
        } else {
          console.error('Fetched products is not an array', fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddProduct = async (newProduct) => {
    try {
      // Optimistically update the UI
      setProducts([...products, newProduct]);
      setSuccessMessage('Product added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide the message after 3 seconds

      const addedProduct = await addProduct(newProduct); // Add product to backend
      setProducts((prevProducts) => prevProducts.map((product) =>
        product._id === newProduct._id ? addedProduct : product
      ));
      setIsAddingProduct(false); // Close the form
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      // Optimistically update the UI
      setProducts(products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      ));
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide the message after 3 seconds

      const updatedProductResponse = await updateProduct(updatedProduct); // Update product in backend
      setProducts(products.map((product) =>
        product._id === updatedProductResponse._id ? updatedProductResponse : product
      ));
      setEditingProduct(null); // Clear editing state
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId); // Delete product from backend
        setProducts(products.filter(product => product._id !== productId));
        setSuccessMessage('Product deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Hide the message after 3 seconds
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  return (
    <div className="product-management-page">
      <h1>Product Management</h1>

      {/* Search Bar */}
      {!isAddingProduct && !editingProduct && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}

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
          onCancel={handleCancel}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct} 
          onSubmit={handleEditProduct}
          onCancel={handleCancel}
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

// Pagination component definition
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={number === currentPage ? 'active' : ''}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default ProductManagement;
