import apiClient from "./apiClient";

/**
 * Fetch all products for a specific user by userId
 */
export const userProductsFetch = async (userId) => {
  try {
    const response = await apiClient.get(`/user/product/${userId}`);
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
    const response = await apiClient.get(`/user/product/uid/${uid}`);
    return response.data;
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
    const response = await apiClient.post("/user/product", productData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user product:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Update an existing user product by UID
 */
export const updateUserProduct = async (uid, updatedData) => {
  try {
    const response = await apiClient.put(`/user/product/${uid}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user product:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Delete a user product by productId
 */
export const deleteUserProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/user/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user product:", error);
    throw error;
  }
};

/**
 * Update global mode for a product (affects all controls)
 * @param {string} uid - Unique identifier of the product
 * @param {string} mode - "manual" or "automate"
 * @returns {Promise<{uid: string, mode: string, updatedControls: string[], skippedControls: string[]}>}
 */
export const updateProductMode = async (uid, mode) => {
  try {
    const response = await apiClient.post(`/v1/product/${uid}/mode`, { mode });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating product mode:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Update billing status for a device (Admin only)
 * @param {string} uid
 * @param {"ACTIVE" | "PAYMENT_HOLD_RECORDING" | "SUSPENDED_BLOCKED"} billingStatus
 * @param {string} reason
 */
export const updateDeviceBillingStatus = async (
  uid,
  billingStatus,
  reason,
  holdType = "PAYMENT"
) => {
  try {
    const response = await apiClient.patch(
      `/admin/devices/${uid}/billing-status`,
      { billingStatus, reason, holdType }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating device billing status:",
      error.response?.data?.error?.message || error.message
    );
    throw error;
  }
};
