import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sensorsListFetch = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
};

export default sensorsListFetch;
