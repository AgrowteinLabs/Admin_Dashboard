import React, { createContext, useState } from "react";

// Create ProductContext
export const ProductContext = createContext();

// Create ProductProvider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Define functions or states related to products here, for example:
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
