// userCreation.js
import axios from 'axios';

export const userCreation = async (userData) => {
  try {
    const dataFinal = JSON.stringify(userData);
    const response = await axios.post('https://agrowteinlabs.onrender.com/api/v1/users', dataFinal, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Propagate error for handling in the calling function
  }
};
