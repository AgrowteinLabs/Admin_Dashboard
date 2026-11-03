import apiClient from "../../../api/apiClient";

export default async function data() {
  try {
    const usersRes = await apiClient.get("/users");
    const sensorsRes = await apiClient.get("/sensors");

    return {
      usersdata: usersRes.data,
      sensorsdata: sensorsRes.data,
    };
  } catch (err) {
    console.error("Error fetching data:", err);
    return { error: err.message || "An error occurred" };
  }
}
