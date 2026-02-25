import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to create a new user
export const userCreation = async (userData) => {
  const token = localStorage.getItem("token"); // Get token from localStorage or other storage

  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to update an existing user
export const updateUser = async (userId, userData) => {
  const token = localStorage.getItem("token"); // Get token from localStorage or other storage

  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Handle errors consistently
const handleError = (error) => {
  console.error("Error:", error);
  if (error.response) {
    throw new Error(error.response.data.message || "Request failed");
  } else if (error.request) {
    throw new Error("No response from server");
  } else {
    throw new Error("Error making request");
  }
};
