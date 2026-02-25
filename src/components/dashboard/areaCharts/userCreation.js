// userCreation.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userCreation = async (userData) => {
  try {
    const dataFinal = JSON.stringify(userData);
    const response = await axios.post(`${API_BASE_URL}/users`, dataFinal, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("User creation successful:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating user:", error.response.data); // Log the error response
    } else {
      console.error("Error creating user:", error.message);
    }
    throw error; // Propagate error for handling in the calling function
  }
};
