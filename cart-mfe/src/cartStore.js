// cart-mfe/src/cartStore.js
import React, {
  createContext, useContext, useState, useEffect
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems,   setCartItems]   = useState([]);
  const [discount,    setDiscount]    = useState(0);   // percentage 0–100
  const [couponCode,  setCouponCode]  = useState("");

  // Valid coupons — must match Offers MFE
  const VALID_COUPONS = {
    SAVE10:  10,
    FLASH50: 50,
  };

  // ── Listen to Shell's ADD_TO_CART bridge event ──────────────────────────
  // Shell catches ADD_TO_CART from Product MFE and re-fires as
  // __SHELL_ADD_TO_CART__ so CartProvider can update its own state
  useEffect(() => {
    const handler = (e) => {
      addToCart(e.detail);
    };
    window.addEventListener("__SHELL_ADD_TO_CART__", handler);
    return () => window.removeEventListener("__SHELL_ADD_TO_CART__", handler);
  }, []); // ← empty array is correct — handler uses functional updater inside addToCart

  // ── Listen to Shell's COUPON_APPLIED bridge event ───────────────────────
  useEffect(() => {
    const handler = (e) => {
      const { code } = e.detail;
      const upper = code.toUpperCase().trim();
      if (VALID_COUPONS[upper] !== undefined) {
        setDiscount(VALID_COUPONS[upper]);
        setCouponCode(upper);
        console.log(`[CartStore] Coupon ${upper} applied: ${VALID_COUPONS[upper]}% off`);
      } else {	 	  	      	 	    	    	    	    	 	
        console.warn("[CartStore] Invalid coupon:", code);
      }
    };
    window.addEventListener("__SHELL_COUPON_APPLIED__", handler);
    return () => window.removeEventListener("__SHELL_COUPON_APPLIED__", handler);
  }, []);

  // ── Cart actions ─────────────────────────────────────────────────────────

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.productId === product.productId);
      if (existing) {
        // Product already in cart → increase quantity
        return prev.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      // New product → add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {	 	  	      	 	    	    	    	    	 	
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // remove if quantity reaches 0
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.productId !== id)
    );
  };

  // Raw total BEFORE discount
  const getRawTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  // Final total AFTER discount applied
  const getCartTotal = () => {
    const raw = getRawTotal();
    return raw - (raw * discount) / 100;
  };

  // Called on checkout — resets everything
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setCouponCode("");
  };

  return (
    <CartContext.Provider
      value={{	 	  	      	 	    	    	    	    	 	
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        getCartTotal,   // ← after discount
        getRawTotal,    // ← before discount
        discount,       // ← percentage number
        couponCode,     // ← applied code string
        clearCart,      // ← used by checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);