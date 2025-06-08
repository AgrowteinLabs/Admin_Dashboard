import { useState, useEffect } from "react";
import {
  MdAddCircle, MdEdit, MdDelete, MdLocalFlorist,
} from "react-icons/md";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import "./ProductManagement.scss";
import {
  productsFetch, addProduct, deleteProduct, updateProduct,
} from "../../api/productsFetch";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;


  const fetchAllProducts = async () => {
    try {
      const data = await productsFetch();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

 const handleAddProduct = async (newProduct) => {
  try {
    await addProduct(newProduct); // ✅ no need to do .json() here
    setIsAddingProduct(false);
    fetchAllProducts();
    toast("success", "Product added successfully");
  } catch (error) {
    console.error("Add failed:", error);
    toast("error", error.message || "Failed to add product.");
  }
};



  const handleEditProduct = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct);
      setEditingProduct(null);
      fetchAllProducts();
      toast("success", "Product updated successfully");
    } catch (error) {
      console.error("Edit failed:", error);
      toast("error", "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p._id === productId);

    const confirm = await Swal.fire({
      title: `Delete "${product.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      let undo = false;
      const undoToast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: true,
        confirmButtonText: 'Undo',
        showCancelButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      const toastInstance = await undoToast.fire({
        icon: 'info',
        title: `"${product.name}" deleted.`,
        text: "Undo within 5 seconds.",
      });

      if (toastInstance.isConfirmed) {
        undo = true;
        toast("info", "Deletion undone");
      }

      if (!undo) {
        await deleteProduct(productId);
        fetchAllProducts();
        toast("success", "Product deleted");
      }
    }
  };

  const handleBulkDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete selected products?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
    });

    if (confirm.isConfirmed) {
      await Promise.all(selectedIds.map(id => deleteProduct(id)));
      setSelectedIds([]);
      fetchAllProducts();
      toast("success", "Selected products deleted");
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const getFilteredSortedProducts = () => {
  let list = [...products];

  if (searchTerm) {
    list = list.filter((p) =>
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortOrder === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOrder === "created-desc") {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const start = (currentPage - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
};


  return (
    <div className="product-management-page">
      <h1>Product Management</h1>

      {!isAddingProduct && !editingProduct && (
        <>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select onChange={handleSortChange} value={sortOrder}>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="created-desc">Newest</option>
            </select>
            <button onClick={() => setIsAddingProduct(true)}>
              <MdAddCircle size={20} /> Add Product
            </button>
            {selectedIds.length > 0 && (
              <button className="delete-button" onClick={handleBulkDelete}>
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="product-grid">
            {getFilteredSortedProducts().map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-header">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={() => handleCheckboxChange(product._id)}
                  />
                </div>
                <div className="product-info">
                  <MdLocalFlorist size={40} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className="product-actions">
                  <button onClick={() => setEditingProduct(product)}>
                    <MdEdit /> Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
  {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
    <button
      key={i}
      className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
</div>

        </>
      )}

      {isAddingProduct && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddingProduct(false)}
          product={{}}
          allProducts={products}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
          allProducts={products}
        />
      )}
    </div>

    
  );
};

export default ProductManagement;
