// userUpdate.js
import axios from 'axios';

const userUpdate = async (userId, userData) => {
  try {
    const response = await axios.put(`https://apiv2.agrowtein.com/api/v1/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default userUpdate;
