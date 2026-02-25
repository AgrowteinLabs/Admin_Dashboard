import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const usersFetch = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
