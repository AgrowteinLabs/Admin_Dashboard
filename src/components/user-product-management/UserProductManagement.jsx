import { useState, useEffect } from "react";
import { MdPerson, MdDelete, MdAddCircle, MdVisibility } from "react-icons/md";
import Swal from "sweetalert2";
import AddProduct from './AddProduct';
import { usersFetch } from '../../api/userslistfetch';
import { CircularProgress } from '@mui/material';
import userDelete from '../../api/deleteUser';
import { userProductsFetch, deleteUserProduct } from '../../api/userProductsFetch';
import { useNavigate } from 'react-router-dom';
import './UserProductManagement.scss';

const UserProductManagement = () => {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadCount, setLoadCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await usersFetch();
        const data = fetched
          .filter(user => user.role.toLowerCase() === 'user')
          .map(user => ({
            id: user._id,
            username: user.email.split('@')[0],
            name: user.fullName,
            email: user.email,
          }));
        setUsers(data);
        setVisibleUsers(data.slice(0, loadCount));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [loadCount]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setVisibleUsers(filtered.slice(0, loadCount));
  };

  const handleLoadMore = () => {
    const nextCount = loadCount + 6;
    setLoadCount(nextCount);
    const newVisible = users
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, nextCount);
    setVisibleUsers(newVisible);
  };

  const handleViewProducts = async (userId) => {
    try {
      await userProductsFetch(userId);
      navigate(`/user-products/${userId}`);
    } catch (error) {
      console.error("User product fetch failed:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(user => user.id === userId);

    const confirm = await Swal.fire({
      title: `Delete ${userToDelete?.name}?`,
      text: "This action is permanent unless undone in 10 seconds.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setVisibleUsers(prev => prev.filter(u => u.id !== userId));

      const toast = await Swal.fire({
        icon: 'info',
        title: `${userToDelete?.name} deleted.`,
        text: "Click undo to restore.",
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Undo',
        timer: 10000,
        timerProgressBar: true,
        toast: true,
        position: 'bottom-end',
      });

      if (toast.isConfirmed) {
        setUsers(prev => [...prev, userToDelete]);
        handleSearch(searchTerm);
      } else {
        try {
          await userDelete(userId);
          await deleteUserProduct(userId);
          Swal.fire('Deleted', 'User has been permanently deleted.', 'success');
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire('Error', 'Something went wrong during deletion.', 'error');
        }
      }
    }
  };

  return (
    <div className="user-product-management-page">
      <h1>User&#39;s Product Management</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="search-button" onClick={() => handleSearch(searchTerm)}>Search</button>
      </div>

      {!isAddingUser && (
        <div className="user-product-actions">
          <button className="action-button" onClick={() => setIsAddingUser(true)}>
            <MdAddCircle size={24} /> Add New Product to User
          </button>
        </div>
      )}

      {isAddingUser && (
        <AddProduct
          onSubmit={() => setIsAddingUser(false)}
          onCancel={() => setIsAddingUser(false)}
        />
      )}

      {!isAddingUser && (
        <div className="user-product-grid">
          {isLoading ? (
            <CircularProgress size={40} />
          ) : (
            visibleUsers.map(user => (
              <div key={user.id} className="user-product-card">
                <div className="user-product-info">
                  <span className="user-product-icon">
                    <MdPerson size={48} />
                  </span>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
                <div className="user-product-actions">
                  <button onClick={() => handleViewProducts(user.id)} className="view-products-button">
                    <MdVisibility size={20} /> View Products
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                    <MdDelete size={20} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && visibleUsers.length < users.length && (
        <div className="pagination">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default UserProductManagement;
