import axios from 'axios';

const deleteSensor = async (sensorId) => {
  try {
    const response = await axios.delete(`https://apiv2.agrowtein.com/api/v1/sensors/${sensorId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor:", error);
    throw error;
  }
};

export default deleteSensor;
