import axios from 'axios';

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`https://agrowteinlabs.onrender.com/api/v1/products/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export default deleteProduct;
