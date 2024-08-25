import axios from 'axios';

const productsListFetch = async () => {
  try {
    const response = await axios.get("https://agrowteinlabs.onrender.com/api/v1/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default productsListFetch;
