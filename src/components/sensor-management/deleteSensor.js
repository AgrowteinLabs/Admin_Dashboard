import apiClient from "../../api/apiClient";

const deleteSensor = async (sensorId) => {
  try {
    const response = await apiClient.delete(`/sensors/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor:", error);
    throw error;
  }
};

export default deleteSensor;
