import axios from "axios";

export default function userDelete(userId){
    try {
    const response = axios.delete(`https://apiv2.agrowtein.com/api/v1/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}