import axios from 'axios';

const API_BASE_URL = 'https://apiv2.agrowtein.com/api/v1/products';

/**
 * Fetch all products
 */
export const productsFetch = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error('Failed to fetch products.');
  }
};

/**
 * Add a new product
 */
export const addProduct = async (productData) => {
  try {
    const sanitized = {
      name: productData.name?.trim(),
      description: productData.description?.trim(),
      modelNumber: productData.modelNumber?.trim(),
    };

    const response = await axios.post('https://apiv2.agrowtein.com/api/v1/products', sanitized, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error) {
    const { status, data } = error.response || {};
    console.error('Add product error:', data || error.message);

    if (status === 409) {
      throw new Error('A product with this model number already exists.');
    }

    throw new Error(data?.message || 'Failed to add product.');
  }
};


/**
 * Update an existing product
 */
export const updateProduct = async (productData) => {
  try {
    const { _id, ...rest } = productData;
    if (!_id) throw new Error('Missing product ID.');

    const sanitized = {
      name: rest.name?.trim(),
      description: rest.description?.trim(),
      modelNumber: rest.modelNumber?.trim(),
    };

    const response = await axios.put(`${API_BASE_URL}/${_id}`, sanitized, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message);
    throw new Error('Failed to update product.');
  }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response?.data || error.message);
    throw new Error('Failed to delete product.');
  }
};
