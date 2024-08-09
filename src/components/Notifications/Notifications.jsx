import React, { useContext } from "react";
import { MdNotifications, MdCheckCircle, MdError, MdPersonAdd } from "react-icons/md";
import { UserContext } from '../../context/UserContext';
import "./Notifications.scss";

const getIcon = (type) => {
  switch (type) {
    case "sensor-fault":
      return <MdError />;
    case "new-user":
      return <MdPersonAdd />;
    case "success":
    default:
      return <MdCheckCircle />;
  }
};

const Notifications = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with sensor faults and user management events.</p>
      </div>
      <div className="notifications-list">
        {user.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${notification.read ? "read" : "unread"}`}
          >
            <div className="notification-icon">{getIcon(notification.type)}</div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <p className="notification-time">{notification.time}</p>
            </div>
            {!notification.read && <div className="notification-badge">New</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
