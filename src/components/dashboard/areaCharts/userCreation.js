import apiClient from "../../../api/apiClient";

export const userCreation = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
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
