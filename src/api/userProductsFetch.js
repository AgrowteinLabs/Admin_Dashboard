import axios from 'axios';



/**
 * Fetch all products for a specific user by userId
 */
export const userProductsFetch = async (userId) => {
    try {
      const response = await axios.get(`https://apiv2.agrowtein.com/api/v1/user/product/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }
  };
  

/**
 * Fetch a single product by its unique UID
 */
export const userProductByUidFetch = async (uid) => {
  try {
    const response = await axios.get(`https://apiv2.agrowtein.com/api/v1/user/product/uid/${uid}`);
    return response.data;  // Return the fetched user product
  } catch (error) {
    console.error("Error fetching user product by UID:", error);
    throw error;
  }
};

/**
 * Create a new user product
 */
export const createUserProduct = async (productData) => {
    try {
      const response = await axios.post('https://apiv2.agrowtein.com/api/v1/user/product', productData);  // Updated API endpoint
      return response.data;
    } catch (error) {
      console.error("Error in creating user product:", error);
      throw error;
    }
  };
  

/**
 * Update an existing user product by UID
 */

export const updateUserProduct = async (uid, updatedData) => {
  try {
    console.log("Sending data to update product with UID:", uid, updatedData);  // Log the request
    const response = await axios.put(
      `https://apiv2.agrowtein.com/api/v1/user/product/${uid}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user product:", error.response || error);  // Log the detailed error
    throw error;
  }
};





/**
 * Delete a user product by productId
 */
export const deleteUserProduct = async (productId) => {
  try {
    const response = await axios.delete(`https://apiv2.agrowtein.com/api/v1/user/product/${productId}`);
    return response.data;  // Return the success message after deletion
  } catch (error) {
    console.error("Error deleting user product:", error);
    throw error;
  }
};
