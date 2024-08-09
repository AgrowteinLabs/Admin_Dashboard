import React, { useState, useEffect } from 'react';
import { FaUserPlus } from "react-icons/fa";
import "./AreaCharts.scss";

const CreateUser = ({ user = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username || "",
    password: user.password || "",
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    addressLine1: user.addressLine1 || "",
    addressLine2: user.addressLine2 || "",
    landmark: user.landmark || "",
    pincode: user.pincode || "",
    state: user.state || "",
    district: user.district || "",
    productType: user.productType || "",
    sensorsUsed: user.sensorsUsed || "",
    deviceId: user.deviceId || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...user, ...formData });
  };

  return (
    <div className="card create-user-card">
      <h4 className="card-title">
        <FaUserPlus />
        {user.id ? "Edit User" : "Create User"}
      </h4>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="scrollable-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user.id} // Password is required only when creating a new user
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 1:</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 2:</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Landmark:</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>District:</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Type of Product:</label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sensors Used:</label>
            <input
              type="text"
              name="sensorsUsed"
              value={formData.sensorsUsed}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Device ID:</label>
            <input
              type="text"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {user.id ? "Save Changes" : "Create User"}
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
