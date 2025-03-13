<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete, MdSensors } from 'react-icons/md';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import sensorsListFetch from './sensorsListFetch';
import sensorCreation from './sensorCreation';
import deleteSensor from './deleteSensor';
import Pagination from '../Pagination'; // Ensure the path is correct
import SensorForm from './SensorForm'; // Import the SensorForm
=======
import React, { useState, useEffect } from "react";
import { MdAddCircle, MdEdit, MdDelete, MdSensors } from "react-icons/md";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { Sensors, addSensor, deleteSensor, updateSensor } from "../../api/sensorFetch";
import CreateSensor from "./CreateSensor"; // Import the CreateSensor form component
>>>>>>> d499f1d (Initial commit)
import "./SensorManagement.scss";

const SensorManagement = () => {
  const [sensors, setSensors] = useState([]);
<<<<<<< HEAD
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
=======
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage] = useState(6); // Limit to 6 sensors per page
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null); // State to hold editing sensor
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch sensors from API
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const fetchedSensors = await Sensors();
        setSensors(fetchedSensors);
        setFilteredSensors(fetchedSensors);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sensors:", error);
        setIsLoading(false);
      }
    };

    fetchSensors();
  }, []);

  // Log the editingSensor state to check if _id is being passed correctly
  useEffect(() => {
    console.log("Editing Sensor:", editingSensor); // Log editingSensor to check _id
  }, [editingSensor]); // This will run every time editingSensor state changes

  // Handle adding a new sensor
  const handleAddSensor = async (newSensor) => {
    // Remove _id if it's present in the new sensor (it shouldn't be when adding)
    const { _id, ...sensorData } = newSensor; // This removes the _id field
    try {
      const createdSensor = await addSensor(sensorData); // Add the sensor without _id
      setSensors([...sensors, createdSensor]);
      setFilteredSensors([...filteredSensors, createdSensor]);
      setIsAddingSensor(false);
      setSuccessMessage("Sensor created successfully!");
      setTimeout(() => setSuccessMessage(''), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error adding sensor:", error);
      alert("Failed to add sensor. Please try again.");
    }
  };
  
  

  // Handle editing a sensor
  const handleEditSensor = async (sensorData) => {
    console.log("Submitting edited sensor data:", sensorData);

    if (!sensorData._id) {
      console.error("Sensor ID is missing in the data passed to onSubmit!");
      alert("Sensor ID is missing. Please try again.");
      return;
    }

    try {
      const updatedSensor = await updateSensor(sensorData);  // API call to update the sensor
      console.log("Updated sensor:", updatedSensor);

      // After the update, update the local state to reflect the changes
      setSensors((prevSensors) =>
        prevSensors.map((sensor) =>
          sensor._id === updatedSensor._id ? updatedSensor : sensor
        )
      );
      setFilteredSensors((prevFilteredSensors) =>
        prevFilteredSensors.map((sensor) =>
          sensor._id === updatedSensor._id ? updatedSensor : sensor
        )
      );

      // Show success message and close form
      setSuccessMessage("Sensor updated successfully!");
      setTimeout(() => {
        setSuccessMessage('');
        setEditingSensor(null);  // Close the form after success
      }, 3000);  // Hide success message after 3 seconds
>>>>>>> d499f1d (Initial commit)
    } catch (error) {
      console.error("Error updating sensor:", error);
      alert("Failed to update sensor. Please try again.");
    }
  };

<<<<<<< HEAD
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
=======
  // Handle deleting a sensor
  const handleDeleteSensor = async (sensorId) => {
    Swal.fire({
      title: `Delete sensor?`,
      text: 'Are you sure you want to delete this sensor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSensor(sensorId);
          setSensors(sensors.filter((sensor) => sensor._id !== sensorId));
          setFilteredSensors(filteredSensors.filter((sensor) => sensor._id !== sensorId));
          setSuccessMessage("Sensor deleted successfully!");
          setTimeout(() => setSuccessMessage(''), 3000); // Hide success message after 3 seconds
          Swal.fire("Deleted!", "The sensor has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting sensor:", error);
        }
      }
    });
  };

  // Pagination Logic
  const indexOfLastSensor = currentPage * sensorsPerPage;
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage;
  const currentSensors = filteredSensors.slice(indexOfFirstSensor, indexOfLastSensor);
  const totalPages = Math.ceil(filteredSensors.length / sensorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
>>>>>>> d499f1d (Initial commit)

  return (
    <div className="sensor-management-page">
      <h1>Sensor Management</h1>

<<<<<<< HEAD
=======
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search sensors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>

>>>>>>> d499f1d (Initial commit)
      {!isAddingSensor && !editingSensor && (
        <div className="sensor-actions">
          <button className="action-button" onClick={() => setIsAddingSensor(true)}>
            <MdAddCircle size={24} />
            Add New Sensor
          </button>
        </div>
      )}

      {isAddingSensor && (
<<<<<<< HEAD
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
=======
        <CreateSensor onSubmit={handleAddSensor} onCancel={() => setIsAddingSensor(false)} />
      )}

      {editingSensor && (
        <CreateSensor
          sensor={editingSensor}  // Pass the full sensor object with _id
          onSubmit={handleEditSensor}  // Pass handleEditSensor to update sensor
          onCancel={() => setEditingSensor(null)}  // Close the form when canceling
>>>>>>> d499f1d (Initial commit)
        />
      )}

      {!isAddingSensor && !editingSensor && (
        <>
          <div className="sensor-grid">
<<<<<<< HEAD
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
=======
            {isLoading ? (
              <CircularProgress size={40} />
            ) : (
              currentSensors.map((sensor) => (
                <div key={sensor._id} className="sensor-card">
                  <div className="sensor-info">
                    <span className="sensor-icon">
                      <MdSensors size={48} />
                    </span>
                    <h2>{sensor.name}</h2>
                    <p>{sensor.description}</p>
                  </div>
                  <div className="sensor-actions">
                    <button
                      className="edit-button"
                      onClick={() => setEditingSensor(sensor)}  // Open the form when editing
                    >
                      <MdEdit size={20} />
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSensor(sensor._id)}
                    >
                      <MdDelete size={20} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
>>>>>>> d499f1d (Initial commit)
    </div>
  );
};

export default SensorManagement;
