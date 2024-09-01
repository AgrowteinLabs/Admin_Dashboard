export default async function data(){
    try{
    const Users = await fetch('https://agrowteinlabs.onrender.com/api/v1/users');
    const usersdata = await Users.json();
    const Sensors = await fetch('https://agrowteinlabs.onrender.com/api/v1/sensors');
    const sensorsdata = await Sensors.json();
    const usersno = usersdata.length;
    const sensorsno = sensorsdata.length;
    return { usersno, sensorsno };
}
    catch(err){
        return err;
    }
};
