import axios from 'axios';

// Function to create a new user
export const userCreation = async (userData) => {
  const token = localStorage.getItem('token'); // Get token from localStorage or other storage

  try {
    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/users', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token here
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to update an existing user
export const updateUser = async (userId, userData) => {
  const token = localStorage.getItem('token'); // Get token from localStorage or other storage

  try {
    const response = await axios.put(`https://apiv2.agrowtein.com/api/v1/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token here
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Handle errors consistently
const handleError = (error) => {
  console.error('Error:', error);
  if (error.response) {
    throw new Error(error.response.data.message || 'Request failed');
  } else if (error.request) {
    throw new Error('No response from server');
  } else {
    throw new Error('Error making request');
  }
};
