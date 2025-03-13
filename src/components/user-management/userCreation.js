import axios from 'axios';

export const userCreation = async (userData) => {
  try {
    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/users', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('User creation successful:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error creating user:', error.response.data);
    } else {
      console.error('Error creating user:', error.message);
    }
    throw error;
  }
};
