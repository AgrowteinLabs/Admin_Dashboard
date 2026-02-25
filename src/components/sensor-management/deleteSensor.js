import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const deleteSensor = async (sensorId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sensors/${sensorId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor:", error);
    throw error;
  }
};

export default deleteSensor;
