import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sensorCreation = async (sensorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sensors`, sensorData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating sensor:", error);
    throw error;
  }
};

export default sensorCreation;
