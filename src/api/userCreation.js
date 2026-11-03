import apiClient from "./apiClient";

// Function to create a new user
export const userCreation = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to update an existing user
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
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
