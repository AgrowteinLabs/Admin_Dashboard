import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./CreateUser.scss"; // Add a separate SCSS file for advanced styles
import { userCreation, updateUser } from "../../api/userCreation";

const CreateUser = ({ user = {}, onSubmit = () => {}, onCancel = () => {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    role: "user",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    if (user?.id) {
      setIsEditing(true);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Keep the password field empty for editing
        phoneNumber: user.phoneNumber || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "India",
        postalCode: user.address?.postalCode || "",
        role: user.role || "user",
      });
    } else {
      setIsEditing(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = mapFormDataToUserData(formData);

    try {
      if (isEditing) {
        const result = await updateUser(user.id, userData); // Edit user
        onSubmit(result);
      } else {
        const result = await userCreation(userData); // Create user
        onSubmit(result);
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  const mapFormDataToUserData = (formData) => ({
    address: {
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
    },
    fullName: formData.name,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    password: formData.password,  // Include password if provided
    role: formData.role,
  });

  return (
    <div className="create-user-container">
      <div className="card create-user-card">
        <button className="back-button" onClick={onCancel}>
          <FaArrowLeft /> Back
        </button>
        <h4 className="card-title">
          <FaUserPlus />
          {isEditing ? 'Edit User' : 'Add User'}
        </h4>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FaUser className="input-icon" /> Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" /> Email: <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password field */}
            {!isEditing && (
              <div className="form-group password-group">
                <label>
                  <FaLock className="input-icon" /> Password: <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"} // Dynamically change type
                    name="password"
                    placeholder="Enter a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            )}

            {/* If editing, allow password update */}
            {isEditing && (
              <div className="form-group password-group">
                <label>
                  <FaLock className="input-icon" /> New Password:
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password (optional)"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>
                <FaPhone className="input-icon" /> Phone Number: <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="input-icon" /> City:
              </label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {isEditing ? "Save Changes" : "Create User"}
              </button>
              <button type="button" className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
