import axios from 'axios';

const sensorCreation = async (sensorData) => {
  try {
    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/sensors', sensorData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating sensor:", error);
    throw error;
  }
};

export default sensorCreation;
