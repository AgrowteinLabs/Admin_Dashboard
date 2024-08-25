import React, { useState } from 'react';

const SensorForm = ({ sensor = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sensor.name || "",
    description: sensor.description || "",
    unit: sensor.unit || "", // Include unit field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="sensor-form">
      <h2>{sensor.id ? "Edit Sensor" : "Add New Sensor"}</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Unit:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SensorForm;
