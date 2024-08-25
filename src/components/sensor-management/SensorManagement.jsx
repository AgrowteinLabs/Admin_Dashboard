import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete, MdSensors } from 'react-icons/md';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import sensorsListFetch from './sensorsListFetch';
import sensorCreation from './sensorCreation';
import deleteSensor from './deleteSensor';
import Pagination from '../Pagination'; // Ensure the path is correct
import SensorForm from './SensorForm'; // Import the SensorForm
import "./SensorManagement.scss";

const SensorManagement = () => {
  const [sensors, setSensors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage] = useState(6);
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);
  const [open, setOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState(null);

  // Fetch sensors from the API when the component mounts
  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      const fetchedSensors = await sensorsListFetch();
      setSensors(fetchedSensors);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      alert("Failed to fetch sensors. Please try again later.");
    }
  };

  const handleAddSensor = async (newSensor) => {
    try {
      const addedSensor = await sensorCreation(newSensor);
      setSensors((prevSensors) => [...prevSensors, addedSensor]);
      setIsAddingSensor(false);
    } catch (error) {
      console.error("Error creating sensor:", error);
      alert("Failed to create sensor. Please try again.");
    }
  };

  const handleEditSensor = (sensor) => {
    setEditingSensor(sensor);
  };

  const handleUpdateSensor = async (updatedSensor) => {
    try {
      const response = await axios.put(`/api/v1/sensors/${updatedSensor.id}`, updatedSensor);
      setSensors((prevSensors) =>
        prevSensors.map((sensor) =>
          sensor.id === updatedSensor.id ? response.data : sensor
        )
      );
      setEditingSensor(null);
    } catch (error) {
      console.error("Error updating sensor:", error);
      alert("Failed to update sensor. Please try again.");
    }
  };

  const handleDeleteSensor = (sensorId) => {
    setSensorToDelete(sensorId);
    setOpen(true);
  };

  const confirmDeleteSensor = async () => {
    try {
      await deleteSensor(sensorToDelete);
      setSensors((prevSensors) =>
        prevSensors.filter((sensor) => sensor.id !== sensorToDelete)
      );
      setOpen(false);
      setSensorToDelete(null);
    } catch (error) {
      console.error("Error deleting sensor:", error);
      alert("Failed to delete sensor. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSensorToDelete(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastSensor = currentPage * sensorsPerPage;
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage;
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor);
  const totalPages = Math.ceil(sensors.length / sensorsPerPage);

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
          onSubmit={handleUpdateSensor}
          onCancel={() => setEditingSensor(null)}
        />
      )}

      {!isAddingSensor && !editingSensor && (
        <>
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
                  <button className="edit-button" onClick={() => handleEditSensor(sensor)}>
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

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this sensor?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this sensor cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteSensor} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SensorManagement;
