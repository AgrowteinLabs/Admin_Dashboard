import React, { useState, useEffect } from "react";
import { MdPerson, MdDelete, MdAddCircle, MdVisibility } from "react-icons/md";
import Swal from "sweetalert2"; // Import SweetAlert2
import AddProduct from './AddProduct';
import { usersFetch } from '../../api/userslistfetch';
import { CircularProgress } from '@mui/material';
import userDelete from '../../api/deleteUser';
import { userProductsFetch, deleteUserProduct } from '../../api/userProductsFetch';
import { useNavigate } from 'react-router-dom';
import './UserProductManagement.scss';

const UserProductManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await usersFetch();
        const simplifiedData = fetchedData
          .filter(user => user.role.toLowerCase() === 'user')
          .map(user => ({
            id: user._id,
            username: user.email.split('@')[0],
            name: user.fullName,
            email: user.email,
          }));
        setUsers(simplifiedData);
        setFilteredUsers(simplifiedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleViewProducts = async (userId) => {
    try {
      const products = await userProductsFetch(userId);
      console.log("User Products:", products);
      // Set the products in the state to display them
      navigate(`/user-products/${userId}`);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await userDelete(userId);
          await deleteUserProduct(userId); // Delete user products as well
          setUsers(users.filter(user => user.id !== userId));
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire('Error!', 'An error occurred while deleting the user.', 'error');
        }
      }
    });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-product-management-page">
      <h1>User's Product Management</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>

      {!isAddingUser && !editingUser && (
        <div className="user-product-actions">
          <button className="action-button" onClick={() => setIsAddingUser(true)}>
            <MdAddCircle size={24} />
            Add New Product to User
          </button>
        </div>
      )}

      {isAddingUser && (
        <AddProduct
          onSubmit={() => setIsAddingUser(false)}
          onCancel={() => setIsAddingUser(false)}
        />
      )}

      {!isAddingUser && !editingUser && (
        <div className="user-product-grid">
          {isLoading ? (
            <CircularProgress size={40} />
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="user-product-card">
                <div className="user-product-info">
                  <span className="user-product-icon">
                    <MdPerson size={48} />
                  </span>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
                <div className="user-product-actions">
                  <button className="view-products-button" onClick={() => handleViewProducts(user.id)}>
                    <MdVisibility size={20} />
                    View Products
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                    <MdDelete size={20} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && !isAddingUser && !editingUser && filteredUsers.length > usersPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      )}
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
      {pageNumbers.map((number) => (
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

export default UserProductManagement;
