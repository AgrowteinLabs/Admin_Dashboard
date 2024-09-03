import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";
import "./Logout.scss";
import axios from "axios";

const Logout = () => {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(async () => {
      await axios
        .post("/api/v1/auth/logout", null, { withCredentials: true })
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    }, 2000); // Adjust the timeout as needed
    localStorage.clear();
  };

  const handleCancel = () => {
    navigate("/");
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
            <button onClick={handleConfirm} className="confirm-button">
              Yes
            </button>
            <button onClick={handleCancel} className="cancel-button">
              No
            </button>
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
