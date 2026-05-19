// src/context/ProductContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsData } from '../data/data';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate async loading with setTimeout
      setTimeout(() => {
        setProducts(productsData);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  // Load all products ONCE on mount
  useEffect(() => {	 	  	      	 	    	    	    	    	 	
    loadProducts();
  }, [loadProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        sortBy,
        isLoading,
        error,
        loadProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};