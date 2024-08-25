import React, { useState } from "react";
import "./AreaTable.scss";

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    password: user.password || "", // You might want to handle passwords differently
    phoneNumber: user.phoneNumber || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    country: user.address?.country || "India",
    postalCode: user.address?.postalCode || "",
    role: user.role || "user",
    termsAgreement: user.termsAgreement || false,
    privacyPolicyAgreement: user.privacyPolicyAgreement || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-user-form card">
      <h4>Edit User</h4>
      <form onSubmit={handleSubmit} className="scrollable-form">
        <div className="form-group">
          <label>Name:</label>
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
            />
            Agree to Terms of Service
          </label>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="privacyPolicyAgreement"
              checked={formData.privacyPolicyAgreement}
              onChange={handleChange}
            />
            Agree to Privacy Policy
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
