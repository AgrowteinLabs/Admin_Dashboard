

export default async function data(){
    try{
    const Users = await fetch('/api/v1/users');
    const usersdata = await Users.json();
    const Sensors = await fetch('/api/v1/sensors');
    const sensorsdata = await Sensors.json();
    return { usersdata, sensorsdata };
}
    catch(err){
        return err;
    }
};