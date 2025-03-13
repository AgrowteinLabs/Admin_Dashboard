import React, { useState, useEffect } from "react";
import { MdPerson, MdEdit, MdDelete, MdAddCircle } from "react-icons/md";
import Swal from "sweetalert2"; // Import SweetAlert2
import CreateUser from "./CreateUser";
import "./UserManagement.scss";
import { usersFetch } from "../../api/userslistfetch";
import { CircularProgress } from "@mui/material";
import userDelete from "../../api/deleteUser";
import { updateUser } from "../../api/userCreation";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const UserManagement = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // Limit to 6 users per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await usersFetch();
        const simplifiedData = fetchedData.map((user) => ({
          id: user._id,
          username: user.email.split("@")[0],
          name: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
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
    // Add a guard check to ensure that `searchTerm`, `user.name`, and `user.email` are valid before calling .toLowerCase()
    const filtered = users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleAddUser = async (newUser) => {
    setIsLoading(true);
    try {
      setUsers([...users, newUser]); // Optimistic update
      setIsAddingUser(false);
      setSuccessMessage("User created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Call the API to add user
      await userCreation(newUser);
      
      // Re-fetch users if needed
      fetchData(); // Re-fetch the data after adding the user
      
      setIsLoading(false);
      navigate('/user-management'); // Redirect after success
    } catch (error) {
      console.error("Error adding user:", error);
      setIsLoading(false);
    }
  };
  
  
  const handleEditUser = async (updatedUser) => {
    setIsLoading(true);
    try {
      // Optimistically update the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      setEditingUser(null);
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
  
      // Now call the API to update the user
      const result = await updateUser(updatedUser);
      // Replace the updated user with the actual user from the API response
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? result : user))
      );
  
      setIsLoading(false);
      navigate('/user-management'); // Redirect after success
    } catch (error) {
      console.error("Error updating user:", error);
      setIsLoading(false);
    }
  };
  

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find((user) => user.id === userId);

    Swal.fire({
      title: `Delete ${userToDelete.name}?`,
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.id !== userId));
        userDelete(userId);
        setSuccessMessage("User deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsLoading(false);
        // Redirect back to user management page after success
        navigate('/user-management');
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      }
    });
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-management-page">
      <h1>User Management</h1>

      {/* Search Bar */}
      {!isAddingUser && !editingUser && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}

      {!isAddingUser && !editingUser && (
        <div className="user-actions">
          <button className="action-button" onClick={() => setIsAddingUser(true)}>
            <MdAddCircle size={24} />
            Add New User
          </button>
        </div>
      )}

      {isAddingUser && (
        <CreateUser onSubmit={handleAddUser} onCancel={() => setIsAddingUser(false)} />
      )}

      {editingUser && (
        <CreateUser
          user={editingUser}
          onSubmit={handleEditUser}
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
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
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

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
