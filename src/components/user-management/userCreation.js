import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userCreation = async (userData) => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });
    console.log("User creation successful:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating user:", error.response.data);
    } else {
      console.error("Error creating user:", error.message);
    }
    throw error;
  }
};
