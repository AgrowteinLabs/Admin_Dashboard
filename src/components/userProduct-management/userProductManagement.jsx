import React, { useState, useEffect } from 'react';
import { MdPerson, MdDelete, MdAddCircle, MdAdd } from 'react-icons/md';
import './userProductManagement.scss';
import AddProduct from './AddProduct';
import { usersFetch } from '../../api/userslistFetch'; 
import { CircularProgress } from '@mui/material';
import userDelete from '../../api/deleteUser';

const UserManagement = () => {
  const [users, setUsers] = useState([]); 
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setIsAddingUser(false);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userDelete(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-management-page">
      <h1>User's Product Management</h1>

      {!isAddingUser && !editingUser && (
        <div className="user-actions">
          <button className="action-button" onClick={() => setIsAddingUser(true)}>
            <MdAddCircle size={24} />
            Add New Product to User
          </button>
        </div>
      )}

      {isAddingUser && (
        <AddProduct
          onSubmit={handleAddUser}
          onCancel={() => setIsAddingUser(false)}
        />
      )}

      {editingUser && (
        <AddProduct
          product={{ userId: editingUser.id }}  // Pass the userId to AddProduct
          onSubmit={handleEditUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {!isAddingUser && !editingUser && (
        <div className="user-grid">
          {isLoading ? (
            <CircularProgress size={40} />
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <span className="user-icon">
                    <MdPerson size={48} />
                  </span>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
                <div className="user-actions">
                  <button className="edit-button" onClick={() => setEditingUser(user)}>
                    <MdAdd size={20} />
                    Add product
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

      {!isLoading && !isAddingUser && !editingUser && users.length > usersPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
            <button 
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className='page-button'
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
