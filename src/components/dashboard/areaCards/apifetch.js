export default async function data() {
  try {
    const Users = await fetch(
      "https://apiv2.agrowtein.com/api/v1/users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        withCredentials: true,
      }
    );
    const usersdata = await Users.json();

    const Sensors = await fetch(
      "https://apiv2.agrowtein.com/api/v1/sensors",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        withCredentials: true,
      }
    );
    const sensorsdata = await Sensors.json();

    return { usersdata, sensorsdata };
  } catch (err) {
    console.error("Error fetching data:", err);
    return { error: err.message || "An error occurred" };
  }
}
