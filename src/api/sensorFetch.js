
export async function Sensors() {
    try {
        const Sensors = await fetch(
        "https://agrowteinlabs.onrender.com/api/v1/sensors"
        );
        const sensorsdata = await Sensors.json();
        return sensorsdata;
    } catch (err) {
        return err;
    }
    }

export async function addSensor(newSensor) {
    return fetch("https://agrowteinlabs.onrender.com/api/v1/sensors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newSensor),
    });
}

export async function deleteSensor(sensorId) {
    return fetch(`https://agrowteinlabs.onrender.com/api/v1/sensors/${sensorId}`, {
        method: "DELETE",
    });
}

export async function updateSensor(updatedSensor) {
    return fetch(`https://agrowteinlabs.onrender.com/api/v1/sensors/${updatedSensor._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSensor),
    });
}