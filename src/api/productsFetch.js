import apiClient from "./apiClient";

export async function productsFetch() {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}

export async function addProduct(newProduct) {
  try {
    const response = await apiClient.post("/products", newProduct);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function updateProduct(updatedProduct) {
  try {
    const response = await apiClient.put(
      `/products/${updatedProduct._id}`,
      updatedProduct
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
