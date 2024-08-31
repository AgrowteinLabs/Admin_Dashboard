import React, { useState, useEffect } from 'react';
import { FaUserPlus } from "react-icons/fa";
import "../../components/dashboard/areaCharts/AreaCharts.scss";
import { userCreation } from '../../api/userCreation'; // Adjust the import path as needed

const CreateUser = ({ user = {}, onSubmit = () => {}, onCancel = () => {} }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: user.password || "",
    phoneNumber: user.phoneNumber || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "India", // Default country
    postalCode: user.postalCode || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = mapFormDataToUserData(formData);

    try {
      const result = await userCreation(userData);
      // console.log("User data submitted:", JSON.stringify(userData));
      onSubmit(result); // Pass the result to the onSubmit callback
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const mapFormDataToUserData = (formData) => {
    return {
      address: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode
      },
      fullName: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };
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
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user.id} // Password required only when creating a new user
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
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
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
            <label>Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {user.id ? "Save Changes" : "Create User"}
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
