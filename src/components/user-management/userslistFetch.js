import axios from "axios";

export const usersFetch = async () => {
    try {
        const response = await axios.get("https://agrowteinlabs.onrender.com/api/v1/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
    };