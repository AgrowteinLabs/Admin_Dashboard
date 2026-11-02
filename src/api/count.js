const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default async function data() {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const Users = await fetch(`${API_BASE_URL}/users`, {
      headers,
      credentials: "include",
    });
    const usersdata = await Users.json();

    const Sensors = await fetch(`${API_BASE_URL}/sensors`, {
      headers,
      credentials: "include",
    });
    const sensorsdata = await Sensors.json();

    const usersno = Array.isArray(usersdata) ? usersdata.length : 0;
    const sensorsno = Array.isArray(sensorsdata) ? sensorsdata.length : 0;
    return { usersno, sensorsno };
  } catch (err) {
    return err;
  }
}
