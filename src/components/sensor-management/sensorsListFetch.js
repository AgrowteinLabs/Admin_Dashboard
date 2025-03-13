import axios from 'axios';

const sensorsListFetch = async () => {
  try {
    const response = await axios.get("https://apiv2.agrowtein.com/api/v1/sensors");
    return response.data;
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
};

export default sensorsListFetch;
