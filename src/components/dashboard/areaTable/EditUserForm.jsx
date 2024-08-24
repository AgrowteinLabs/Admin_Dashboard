import React, { useState } from "react";
import "./AreaTable.scss"

const EditUserForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-user-form">
      <h4>Edit User</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => onSave(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
