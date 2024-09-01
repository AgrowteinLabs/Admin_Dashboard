import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete, MdSensors } from 'react-icons/md';
import "./SensorManagement.scss";
import { Sensors, addSensor, deleteSensor, updateSensor } from '../../api/sensorFetch';

const SensorManagement = () => {
  const [sensors, setSensors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage] = useState(6);
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const fetchedSensors = await Sensors();
        setSensors(fetchedSensors);
      } catch (error) {
        console.error("Error fetching sensors:", error);
      }
    };

    fetchSensors();
  }, []);

  const indexOfLastSensor = currentPage * sensorsPerPage;
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage;
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor);
  const totalPages = Math.ceil(sensors.length / sensorsPerPage);

  const handleAddSensor = (newSensor) => {
    setSensors([...sensors, { _id: sensors.length + 1, ...newSensor }]);
    addSensor(newSensor);
    setIsAddingSensor(false);
  };

  const handleEditSensor = (updatedSensor) => {
    setSensors(sensors.map(sensor => sensor._id === updatedSensor._id ? updatedSensor : sensor));
    updateSensor(updatedSensor);
    setEditingSensor(null);
  };

  const handleDeleteSensor = (sensorId) => {
    setSensors(sensors.filter(sensor => sensor._id !== sensorId));
    deleteSensor(sensorId);
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
            <div key={sensor._id} className="sensor-card">
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
                <button className="delete-button" onClick={() => handleDeleteSensor(sensor._id)}>
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
    unit: sensor.unit || "",
    error_code: sensor.error_code || ""
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
      <h2>{sensor._id ? "Edit Sensor" : "Add New Sensor"}</h2>
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
          <label>Measuring Unit:</label>
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Error Code:</label>
          <input
            name="error_code"
            value={formData.error_code}
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
