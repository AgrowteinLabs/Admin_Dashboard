import React, { useState } from 'react';
import {
  MdPerson,
  MdEdit,
  MdDelete,
  MdAddCircle,
} from 'react-icons/md';
import CreateUser from './CreateUser'; // Import the CreateUser component
import "./UserManagement.scss";

const initialUsers = [
  { id: 1, username: "john.doe", name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: 2, username: "jane.smith", name: "Jane Smith", email: "jane.smith@example.com", role: "User" },
  { id: 3, username: "alice.johnson", name: "Alice Johnson", email: "alice.johnson@example.com", role: "User" },
  { id: 4, username: "bob.brown", name: "Bob Brown", email: "bob.brown@example.com", role: "Moderator" },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
          {users.map((user) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
