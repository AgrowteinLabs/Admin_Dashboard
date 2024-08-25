import axios from "axios";

export default async function userDelete(userId) {
  try {
    const response = await axios.delete(`https://agrowteinlabs.onrender.com/api/v1/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
