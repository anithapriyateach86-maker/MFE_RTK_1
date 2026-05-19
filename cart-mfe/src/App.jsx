// cart-mfe/src/App.jsx
import React from "react";
import Cart from "./components/Cart";
import { CartProvider, useCart } from "./cartStore";
import "./index.css";

function SafeCartProvider({ children }) {
  const cart = useCart();
  if (cart) return <>{children}</>;
  return <CartProvider>{children}</CartProvider>;
}

function App({ user }) {        // ← accept user prop from Shell
  return (
    <SafeCartProvider>
      <div>
        <Cart user={user} />    // ← pass to Cart
      </div>
    </SafeCartProvider>
  );
}

export default App;