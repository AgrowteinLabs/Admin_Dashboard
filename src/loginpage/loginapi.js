import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to handle the login API call
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }, // Ensures cookies are sent with the request
    );

    if (response.status === 200) {
      const userId = response.data.user._id;

      // Store only the userId (if needed)
      localStorage.setItem("userId", userId); // Don't store the token, it's in the cookie

      return {
        success: true,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Login failed. Please check your email and password.",
    };
  }
};
