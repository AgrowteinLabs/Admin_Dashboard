import React, { useState, useEffect } from "react";
import { MdAddCircle, MdEdit, MdDelete, MdSensors } from "react-icons/md";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { Sensors, addSensor, deleteSensor, updateSensor } from "../../api/sensorFetch";
import CreateSensor from "./CreateSensor"; // Import the CreateSensor form component
import "./SensorManagement.scss";

const SensorManagement = () => {
  const [sensors, setSensors] = useState([]);
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
    } catch (error) {
      console.error("Error updating sensor:", error);
      alert("Failed to update sensor. Please try again.");
    }
  };

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

  return (
    <div className="sensor-management-page">
      <h1>Sensor Management</h1>

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

      {!isAddingSensor && !editingSensor && (
        <div className="sensor-actions">
          <button className="action-button" onClick={() => setIsAddingSensor(true)}>
            <MdAddCircle size={24} />
            Add New Sensor
          </button>
        </div>
      )}

      {isAddingSensor && (
        <CreateSensor onSubmit={handleAddSensor} onCancel={() => setIsAddingSensor(false)} />
      )}

      {editingSensor && (
        <CreateSensor
          sensor={editingSensor}  // Pass the full sensor object with _id
          onSubmit={handleEditSensor}  // Pass handleEditSensor to update sensor
          onCancel={() => setEditingSensor(null)}  // Close the form when canceling
        />
      )}

      {!isAddingSensor && !editingSensor && (
        <>
          <div className="sensor-grid">
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
    </div>
  );
};

export default SensorManagement;
