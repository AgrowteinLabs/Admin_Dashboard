import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function userDelete(userId) {
  try {
    const response = axios.delete(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
