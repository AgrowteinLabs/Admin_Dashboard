export async function Products() {
  try {
    const list = await fetch(
      "https://agrowteinlabs.onrender.com/api/v1/products"
    );
    const productslist = await list.json();
    return productslist;
  } catch (err) {
    return err;
  }
}

export async function addProduct(newProduct) {
  return fetch("https://agrowteinlabs.onrender.com/api/v1/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  });
}

export async function deleteProduct(productId) {
    return fetch(`https://agrowteinlabs.onrender.com/api/v1/products/${productId}`, {
        method: "DELETE",
    });
    }

export async function updateProduct(updatedProduct) {
    return fetch(`https://agrowteinlabs.onrender.com/api/v1/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
    });
    }