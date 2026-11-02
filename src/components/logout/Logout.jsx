import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdExitToApp } from 'react-icons/md';
import "./Logout.scss";

const Logout = () => {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      navigate('/login');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="logout-page">
      {!confirmed ? (
        <div className="confirmation-dialog">
          <div className="dialog-icon">
            <MdExitToApp size={64} />
          </div>
          <h1>Are you sure you want to log out?</h1>
          <div className="dialog-buttons">
            <button onClick={handleConfirm} className="confirm-button">Yes</button>
            <button onClick={handleCancel} className="cancel-button">No</button>
          </div>
        </div>
      ) : (
        <div className="logout-message">
          <h1>You have been logged out</h1>
          <p>Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
};

export default Logout;
