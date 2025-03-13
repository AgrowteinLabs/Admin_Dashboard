// userCreation.js
import axios from 'axios';

export const userCreation = async (userData) => {
  try {
    const dataFinal = JSON.stringify(userData);
    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/users', dataFinal, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('User creation successful:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error creating user:', error.response.data); // Log the error response
    } else {
      console.error('Error creating user:', error.message);
    }
    throw error; // Propagate error for handling in the calling function
  }
};
