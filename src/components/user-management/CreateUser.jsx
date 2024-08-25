import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import "./UserManagement.scss";
import { userCreation } from './userCreation';
import userUpdate from './userUpdate';

const CreateUser = ({ user = {}, onSubmit = () => {}, onCancel = () => {} }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || user.name || "",
    email: user.email || "",
    password: "",
    phoneNumber: user.phoneNumber || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    country: user.address?.country || "India",
    postalCode: user.address?.postalCode || user.address?.postal_code || "",
    role: user.role || "user",
    termsAgreement: user.termsAgreement || false,
    privacyPolicyAgreement: user.privacyPolicyAgreement || false,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setFormData({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        password: "",
        phoneNumber: user.phoneNumber || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "India",
        postalCode: user.address?.postalCode || user.address?.postal_code || "",
        role: user.role || "user",
        termsAgreement: user.termsAgreement || false,
        privacyPolicyAgreement: user.privacyPolicyAgreement || false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = mapFormDataToUserData(formData);

    try {
      let result;
      if (user.id) {
        result = await userUpdate(user.id, userData);
        console.log('User updated successfully:', result);
      } else {
        result = await userCreation(userData);
        console.log('User created successfully:', result);
      }
      onSubmit(result);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert('A user with this email already exists. Please use a different email.');
        } else if (error.response.status === 400) {
          alert('There was an issue with the provided data. Please check and try again.');
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error creating/updating user:', error.message);
        alert('An error occurred while creating/updating the user. Please try again.');
      }
    }
  };

  const mapFormDataToUserData = (formData) => {
    return {
      address: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postalCode,
      },
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role,
      termsAgreement: formData.termsAgreement,
      privacyPolicyAgreement: formData.privacyPolicyAgreement,
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
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
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
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!user.id}
              />
              <span className="password-toggle-icon" onClick={handlePasswordToggle}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
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
          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="termsAgreement"
                checked={formData.termsAgreement}
                onChange={handleChange}
                required
              />
              I agree to the terms of service
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="privacyPolicyAgreement"
                checked={formData.privacyPolicyAgreement}
                onChange={handleChange}
                required
              />
              I agree to the privacy policy
            </label>
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
