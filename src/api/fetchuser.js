const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = async () => {
  const userid = localStorage.getItem("userId");
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  if (!userid) {
    return { error: "User ID not found, try logging in again" };
  }

  try {
    const API_URL = `${API_BASE_URL}/users/${userid}`;

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include", // Ensures cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Error fetching user" };
  }
};
