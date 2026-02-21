import axios from 'axios';

async function fetchSensors() {
    try {
        const response = await axios.get("https://apiv2.agrowtein.com/api/v1/sensors");
        console.log("Status:", response.status);
        if (Array.isArray(response.data)) {
            console.log("Sensors found:", response.data.length);
            if (response.data.length > 0) {
                console.log("First sensor structure:", JSON.stringify(response.data[0], null, 2));
                const first5 = response.data.slice(0, 5);
                console.log("First 5 Sensor IDs:", first5.map(s => s._id));
                console.log("Data types of IDs:", first5.map(s => typeof s._id));
            }
        } else {
            console.log("Response data is not an array:", typeof response.data);
            console.log(response.data);
        }
    } catch (error) {
        console.error("Error fetching sensors:", error.message);
        if (error.response) {
            console.log("Response data:", error.response.data);
        }
    }
}

fetchSensors();
