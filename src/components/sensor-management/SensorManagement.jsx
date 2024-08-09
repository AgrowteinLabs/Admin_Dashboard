import React, { useState } from 'react';
import {
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdSensors,
} from 'react-icons/md';
import "./SensorManagement.scss";

const initialSensors = [
  { id: 1, name: "Temperature Sensor", description: "Monitors temperature levels in the environment." },
  { id: 2, name: "Humidity Sensor", description: "Measures the amount of moisture in the air." },
  { id: 3, name: "pH Sensor", description: "Checks the pH level of soil or water." },
  { id: 4, name: "Water Level Sensor", description: "Monitors water levels in tanks or reservoirs." },
  { id: 5, name: "Light Sensor", description: "Measures light intensity in a given area." },
  { id: 6, name: "Pressure Sensor", description: "Detects and measures pressure in various applications." },
  { id: 7, name: "Soil Moisture Sensor", description: "Measures the water content in the soil." },
  // Add more sensors as needed
];

const SensorManagement = () => {
  const [sensors, setSensors] = useState(initialSensors);
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage] = useState(6);
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);

  const indexOfLastSensor = currentPage * sensorsPerPage;
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage;
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor);
  const totalPages = Math.ceil(sensors.length / sensorsPerPage);

  const handleAddSensor = (newSensor) => {
    setSensors([...sensors, { id: sensors.length + 1, ...newSensor }]);
    setIsAddingSensor(false);
  };

  const handleEditSensor = (updatedSensor) => {
    setSensors(sensors.map(sensor => sensor.id === updatedSensor.id ? updatedSensor : sensor));
    setEditingSensor(null);
  };

  const handleDeleteSensor = (sensorId) => {
    setSensors(sensors.filter(sensor => sensor.id !== sensorId));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="sensor-management-page">
      <h1>Sensor Management</h1>

      {!isAddingSensor && !editingSensor && (
        <div className="sensor-actions">
          <button className="action-button" onClick={() => setIsAddingSensor(true)}>
            <MdAddCircle size={24} />
            Add New Sensor
          </button>
        </div>
      )}

      {isAddingSensor && (
        <SensorForm
          onSubmit={handleAddSensor}
          onCancel={() => setIsAddingSensor(false)}
        />
      )}

      {editingSensor && (
        <SensorForm
          sensor={editingSensor}
          onSubmit={handleEditSensor}
          onCancel={() => setEditingSensor(null)}
        />
      )}

      {!isAddingSensor && !editingSensor && (
        <div className="sensor-grid">
          {currentSensors.map((sensor) => (
            <div key={sensor.id} className="sensor-card">
              <div className="sensor-info">
                <span className="sensor-icon">
                  <MdSensors size={48} />
                </span>
                <h2>{sensor.name}</h2>
                <p>{sensor.description}</p>
              </div>
              <div className="sensor-actions">
                <button className="edit-button" onClick={() => setEditingSensor(sensor)}>
                  <MdEdit size={20} />
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteSensor(sensor.id)}>
                  <MdDelete size={20} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAddingSensor && !editingSensor && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const SensorForm = ({ sensor = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sensor.name || "",
    description: sensor.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...sensor, ...formData });
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
        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`page-button ${number === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default SensorManagement;
