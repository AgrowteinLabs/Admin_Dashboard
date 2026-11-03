import apiClient from "../../api/apiClient";

const sensorsListFetch = async () => {
  try {
    const response = await apiClient.get("/sensors");
    return response.data;
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
};

export default sensorsListFetch;
