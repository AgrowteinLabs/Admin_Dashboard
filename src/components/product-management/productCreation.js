import axios from 'axios';

const productCreation = async (productData) => {
  try {
    console.log('Sending product data:', productData); // Debugging line
    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/products', productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Product creation successful:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error creating product:', error.response.data); // Log server error response
    } else {
      console.error('Error creating product:', error.message);
    }
    throw error; // Rethrow error for handling in the calling function
  }
};

export default productCreation;
