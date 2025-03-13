import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import './CreateSensor.scss'; // Separate SCSS for styling

const CreateSensor = ({ sensor = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sensor.name || '',
    description: sensor.description || '',
    unit: sensor.unit || '',
    errorCode: sensor.errorCode || '',
    _id: sensor._id || '',  // Ensure _id is part of the initial formData, for editing only
  });

  const [isEditing, setIsEditing] = useState(!!sensor._id); // Check if we are editing an existing sensor

  useEffect(() => {
    if (sensor && sensor._id) {
      setFormData({
        name: sensor.name || '',
        description: sensor.description || '',
        unit: sensor.unit || '',
        errorCode: sensor.errorCode || '',
        _id: sensor._id || '',  // Ensure _id is part of formData for editing
      });
    }
  }, [sensor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isEditing && !formData._id) {
      console.error("Sensor ID is missing!");
      alert("Sensor ID is missing. Please try again.");
      return;
    }
  
    const sensorData = mapFormDataToSensorData(formData);
  
    console.log("Submitting sensor data:", sensorData);  // Log the data
  
    try {
      await onSubmit(sensorData);  // This will call addSensor or editSensor
    } catch (error) {
      console.error("Error submitting sensor data:", error);
    }
  };
  
  const mapFormDataToSensorData = (formData) => ({
    name: formData.name,
    description: formData.description,
    unit: formData.unit,
    errorCode: formData.errorCode,
    _id: formData._id,  // Ensure _id is included here, but it will be empty for new sensors
  });

  return (
    <div className="create-sensor-container">
      <div className="card create-sensor-card">
        <button className="back-button" onClick={onCancel}>
          <FaArrowLeft /> Back
        </button>
        <h4 className="card-title">
          <FaSave />
          {isEditing ? 'Edit Sensor' : 'Add Sensor'}
        </h4>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            {/* Sensor Name */}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter sensor name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sensor Description */}
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Enter sensor description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sensor Unit */}
            <div className="form-group">
              <label>Unit:</label>
              <input
                type="text"
                name="unit"
                placeholder="Enter unit of measurement"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sensor Error Code */}
            <div className="form-group">
              <label>Error Code:</label>
              <input
                type="text"
                name="errorCode"
                placeholder="Enter error code"
                value={formData.errorCode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {isEditing ? 'Save Changes' : 'Add Sensor'}
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

export default CreateSensor;
