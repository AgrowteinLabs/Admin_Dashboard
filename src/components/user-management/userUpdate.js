// userUpdate.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const userUpdate = async (userId, userData) => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export default userUpdate;
