import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all products for a specific user by userId
 */
export const userProductsFetch = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/product/${userId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
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
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/user/product/uid/${uid}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    return response.data; // Return the fetched user product
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
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/user/product`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user product:",
      error.response?.data?.message || error.message,
    );
    throw error;
  }
};

/**
 * Update an existing user product by UID
 */

export const updateUserProduct = async (uid, updatedData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_BASE_URL}/user/product/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating user product:",
      error.response?.data?.message || error.message,
    );
    throw error;
  }
};

/**
 * Delete a user product by productId
 */
export const deleteUserProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/user/product/${productId}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    return response.data; // Return the success message after deletion
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
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/v1/product/${uid}/mode`,
      { mode },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating product mode:",
      error.response?.data?.message || error.message,
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
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/devices/${uid}/billing-status`,
      { billingStatus, reason, holdType },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
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
