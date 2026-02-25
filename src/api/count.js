const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default async function data() {
  try {
    const Users = await fetch(`${API_BASE_URL}/users`);
    const usersdata = await Users.json();
    const Sensors = await fetch(`${API_BASE_URL}/sensors`);
    const sensorsdata = await Sensors.json();
    const usersno = usersdata.length;
    const sensorsno = sensorsdata.length;
    return { usersno, sensorsno };
  } catch (err) {
    return err;
  }
}
