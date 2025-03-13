export async function productsFetch() {
  try {
    const list = await fetch("https://apiv2.agrowtein.com/api/v1/products");
    const productslist = await list.json();
    return productslist;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}

export async function addProduct(newProduct) {
  try {
    const response = await fetch("https://apiv2.agrowtein.com/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const addedProduct = await response.json();
    return response.json(); // Return the added product (with _id)
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Rethrow error for further handling in the component
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await fetch(`https://apiv2.agrowtein.com/api/v1/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    const data = await response.json(); // Optional: Get response data if required
    return data; // Return the response data or confirmation message
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}


export async function updateProduct(updatedProduct) {
  try {
    const response = await fetch(
      `https://apiv2.agrowtein.com/api/v1/products/${updatedProduct._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json(); // Return the updated product
  } catch (error) {
    console.error("Error updating product:", error);
    throw error; // Rethrow error to be caught in the calling component
  }
}


