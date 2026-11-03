import apiClient from "./apiClient";

export default async function data() {
  try {
    const usersRes = await apiClient.get("/users");
    const sensorsRes = await apiClient.get("/sensors");

    const usersdata = usersRes.data;
    const sensorsdata = sensorsRes.data;

    const usersno = Array.isArray(usersdata) ? usersdata.length : 0;
    const sensorsno = Array.isArray(sensorsdata) ? sensorsdata.length : 0;
    return { usersno, sensorsno };
  } catch (err) {
    return err;
  }
}
