import apiClient from "./apiClient";

export const fetchUser = async () => {
  const userid = localStorage.getItem("userId");

  if (!userid) {
    return { error: "User ID not found, try logging in again" };
  }

  try {
    const response = await apiClient.get(`/users/${userid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Error fetching user" };
  }
};
