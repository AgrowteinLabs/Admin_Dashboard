const userid = localStorage.getItem("userId");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = async () => {
  if (!userid) {
    return { error: "User ID not found, try logging in again" };
  }

  try {
    const API_URL = `${API_BASE_URL}/users/${userid}`;

    // Add credentials: 'include' to send cookies with the request
    const response = await fetch(API_URL, {
      method: "GET",
      credentials: "include", // Ensures cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Error fetching user" };
  }
};
