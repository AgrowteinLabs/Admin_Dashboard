import apiClient from "../../api/apiClient";

const sensorCreation = async (sensorData) => {
  try {
    const response = await apiClient.post("/sensors", sensorData);
    return response.data;
  } catch (error) {
    console.error("Error creating sensor:", error);
    throw error;
  }
};

export default sensorCreation;
