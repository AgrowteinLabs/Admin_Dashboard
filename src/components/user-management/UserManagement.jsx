import React, { useState, useEffect } from 'react';
import {
  MdPerson,
  MdEdit,
  MdDelete,
  MdAddCircle,
} from 'react-icons/md';
import CreateUser from './CreateUser';
import "./UserManagement.scss";
import { usersFetch } from './userslistFetch'; 
import { CircularProgress } from '@mui/material';
import userDelete from './deleteUser';


const UserManagement = () => {
  const [users, setUsers] = useState([]); 
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await usersFetch(); // Await the data fetching
        const simplifiedData = fetchedData.map(user => ({
          id: user._id, // Unique identifier from the fetched data
          username: user.email.split('@')[0], // giving username as email before @
          name: user.fullName,
          email: user.email,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1) // just adding capitalization for first letter
        }));
        setUsers(simplifiedData); // Update state with fetched and mapped data
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error); // Handle any errors
        setIsLoading(false); // Set isLoading to false in case of error
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array to run once on mount

  const handleAddUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setIsAddingUser(false);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    userDelete(userId); // Call the delete function

  };

  return (
    <div className="user-management-page">
      <h1>User Management</h1>

      {!isAddingUser && !editingUser && (
        <div className="user-actions">
          <button className="action-button" onClick={() => setIsAddingUser(true)}>
            <MdAddCircle size={24} />
            Add New User
          </button>
        </div>
      )}

      {isAddingUser && (
        <CreateUser
          onSubmit={handleAddUser}
          onCancel={() => setIsAddingUser(false)}
        />
      )}

      {editingUser && (
        <CreateUser
          user={editingUser}
          onSubmit={handleEditUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {!isAddingUser && !editingUser && (
        <div className="user-grid">
          {isLoading ? ( // Render CircularProgress if isLoading is true
            <CircularProgress size={40} />
          ) : (
            users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <span className="user-icon">
                    <MdPerson size={48} />
                  </span>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
                <div className="user-actions">
                  <button className="edit-button" onClick={() => setEditingUser(user)}>
                    <MdEdit size={20} />
                    Edit
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
    </div>
  );
};

export default UserManagement;
