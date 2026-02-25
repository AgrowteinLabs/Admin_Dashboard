const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default async function data() {
  try {
    const Users = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
    });
    const usersdata = await Users.json();

    const Sensors = await fetch(`${API_BASE_URL}/sensors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
    });
    const sensorsdata = await Sensors.json();

    return { usersdata, sensorsdata };
  } catch (err) {
    console.error("Error fetching data:", err);
    return { error: err.message || "An error occurred" };
  }
}
