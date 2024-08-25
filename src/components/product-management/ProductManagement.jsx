import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete, MdLocalFlorist } from 'react-icons/md';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import productsListFetch from './productsListFetch';
import deleteProduct from './deleteProduct';
import productCreation from './productCreation'; // Correct import statement
import ProductForm from './ProductForm';
import "./ProductManagement.scss";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await productsListFetch();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again later.");
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const addedProduct = await productCreation(newProduct);
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setIsAddingProduct(false);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`/api/v1/products/${updatedProduct.id}`, updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDelete)
      );
      setOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

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
          onSubmit={handleUpdateProduct}
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
                <button className="edit-button" onClick={() => handleEditProduct(product)}>
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this product?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this product cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
