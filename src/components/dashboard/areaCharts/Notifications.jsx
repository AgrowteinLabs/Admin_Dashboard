import React from 'react';
import { FaBell } from "react-icons/fa";
import "./AreaCharts.scss";

const Notifications = () => {
  const notifications = [
    { id: 1, message: "New user registered", date: "Aug 08, 2024" },
    { id: 2, message: "System maintenance scheduled", date: "Aug 07, 2024" },
    { id: 3, message: "New enquiry received", date: "Aug 06, 2024" },
  ];

  return (
    <div className="card">
      <h4 className="card-title">
        <FaBell />
        Notifications
      </h4>
      <div className="card-content">
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} - {notification.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
