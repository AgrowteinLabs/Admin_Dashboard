
export async function Sensors() {
    try {
      const response = await fetch("https://apiv2.agrowtein.com/api/v1/sensors");
      if (!response.ok) {
        throw new Error(`Failed to fetch sensors. Status: ${response.status}`);
      }
      const sensorsdata = await response.json();
      return sensorsdata;
    } catch (err) {
      console.error("Error fetching sensors:", err);
      throw err;  // Propagate the error
    }
  }
  

  export async function addSensor(newSensor) {
    try {
      const response = await fetch("https://apiv2.agrowtein.com/api/v1/sensors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSensor),  // This should NOT include the _id when adding
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add sensor. Status: ${response.status}`);
      }
  
      const addedSensor = await response.json();
      return addedSensor;  // Return the newly added sensor data
    } catch (err) {
      console.error("Error adding sensor:", err);
      throw err;  // Propagate the error
    }
  }
  
  
  

  export async function deleteSensor(sensorId) {
    try {
      const response = await fetch(`https://apiv2.agrowtein.com/api/v1/sensors/${sensorId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete sensor. Status: ${response.status}`);
      }
  
      return response.ok;  // Return a boolean indicating success or failure
    } catch (err) {
      console.error("Error deleting sensor:", err);
      throw err;  // Propagate the error
    }
  }
  

  export async function updateSensor(updatedSensor) {
    try {
      const response = await fetch(`https://apiv2.agrowtein.com/api/v1/sensors/${updatedSensor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSensor),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update sensor. Status: ${response.status}`);
      }
  
      const updatedSensorData = await response.json();  // Return the updated data after PUT request
      return updatedSensorData;
    } catch (err) {
      console.error("Error updating sensor:", err);
      throw err;  // Propagate the error
    }
  }
  