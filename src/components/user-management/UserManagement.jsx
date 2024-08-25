import React, { useState, useEffect } from 'react';
import {
  MdPerson,
  MdEdit,
  MdDelete,
  MdAddCircle,
} from 'react-icons/md';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar } from '@mui/material';
import CreateUser from './CreateUser';
import { usersFetch } from './userslistFetch';
import { CircularProgress } from '@mui/material';
import userDelete from './deleteUser';
import Pagination from '../Pagination';
import "./UserManagement.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await usersFetch();
      const simplifiedData = fetchedData.map(user => ({
        id: user._id,
        username: user.email.split('@')[0],
        name: user.fullName,
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        address: user.address,
        phoneNumber: user.phoneNumber
      }));
      setUsers(simplifiedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsAddingUser(false);
    setSnackbarMessage("User created successfully!");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    setSnackbarMessage("User updated successfully!");
    setSnackbarOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await userDelete(userToDelete);
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userToDelete));
      setOpen(false);
      setUserToDelete(null);
      setSnackbarMessage("User deleted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      alert("Failed to delete the user. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setUserToDelete(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
          onSubmit={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {!isAddingUser && !editingUser && (
        <>
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
                    <p><strong>Role:</strong> {user.role}</p>
                  </div>
                  <div className="user-actions">
                    <button className="edit-button" onClick={() => handleEditUser(user)}>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this user cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteUser} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </div>
  );
};

export default UserManagement;
