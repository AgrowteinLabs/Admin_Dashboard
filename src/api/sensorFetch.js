import apiClient from "./apiClient";

export async function Sensors() {
  try {
    const response = await apiClient.get("/sensors");
    return response.data;
  } catch (err) {
    console.error("Error fetching sensors:", err);
    throw err;
  }
}

export async function addSensor(newSensor) {
  try {
    const response = await apiClient.post("/sensors", newSensor);
    return response.data;
  } catch (err) {
    console.error("Error adding sensor:", err);
    throw err;
  }
}

export async function deleteSensor(sensorId) {
  try {
    const response = await apiClient.delete(`/sensors/${sensorId}`);
    return response.status === 200 || response.status === 204;
  } catch (err) {
    console.error("Error deleting sensor:", err);
    throw err;
  }
}

export async function updateSensor(updatedSensor) {
  try {
    const response = await apiClient.put(
      `/sensors/${updatedSensor._id}`,
      updatedSensor
    );
    return response.data;
  } catch (err) {
    console.error("Error updating sensor:", err);
    throw err;
  }
}
