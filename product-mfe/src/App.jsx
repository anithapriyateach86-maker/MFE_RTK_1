// product-mfe/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider, useCart } from "cartApp/CartStore";
import ProductList    from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import "./index.css";

function SafeCartProvider({ children }) {
  const cart = useCart();
  if (cart) return <>{children}</>;
  return <CartProvider>{children}</CartProvider>;
}

// App receives user prop from Shell
function App({ user }) {
  return (
    <SafeCartProvider>
      <ProductProvider>
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list"
              element={<ProductList user={user} />}      // ← pass user
            />
            <Route path="details/:id"
              element={<ProductDetails user={user} />}   // ← pass user
            />
          </Routes>
        </div>
      </ProductProvider>
    </SafeCartProvider>
  );
}

export default App;	 	  	      	 	    	    	    	    	 	
