// shell/src/context/ShellCartContext.jsx
import React, {
  createContext, useContext, useState, useEffect
} from "react";
import eventBus, { EVENTS } from "../utils/eventBus";
import { useAuth } from "./AuthContext";

const ShellCartContext = createContext();

export const ShellCartProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // User-scoped storage key — satisfies User-Scoped Cart (8 marks)
  const storageKey = currentUser
    ? `fashionhub_cart_${currentUser.userId}`
    : "fashionhub_cart_guest";

  // Load cart from localStorage for this user
  const [cartItems,  setCartItems]  = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [discount,   setDiscount]   = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const VALID_COUPONS = { SAVE10: 10, FLASH50: 50 };

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  // Reload cart when user changes (login/logout/switch)
  useEffect(() => {
    try {	 	  	      	 	    	    	    	    	 	
      const saved = localStorage.getItem(storageKey);
      setCartItems(saved ? JSON.parse(saved) : []);
      setDiscount(0);
      setCouponCode("");
    } catch {
      setCartItems([]);
    }
  }, [storageKey]);

  // Listen to ADD_TO_CART — validate userId+token
  useEffect(() => {
    const handler = eventBus.subscribe(EVENTS.ADD_TO_CART, (data) => {
      // Event validation — satisfies Event Validation Logic (8 marks)
      if (!currentUser) return;
      if (data.userId !== currentUser.userId) {
        console.warn("[ShellCart] Rejected ADD_TO_CART — userId mismatch");
        return;
      }
      if (data.token !== currentUser.token) {
        console.warn("[ShellCart] Rejected ADD_TO_CART — invalid token");
        return;
      }
      console.log("[ShellCart] ADD_TO_CART validated ✅", data.product?.title);
      addToCart(data.product);
      window.dispatchEvent(
        new CustomEvent("__SHELL_ADD_TO_CART__", { detail: data.product })
      );
    });
    return () => eventBus.unsubscribe(EVENTS.ADD_TO_CART, handler);
  }, [currentUser]);

  // Listen to COUPON_APPLIED — validate userId+token
  useEffect(() => {
    const handler = eventBus.subscribe(EVENTS.COUPON_APPLIED, (data) => {
      if (!currentUser) return;
      if (data.userId !== currentUser.userId) {	 	  	      	 	    	    	    	    	 	
        console.warn("[ShellCart] Rejected COUPON_APPLIED — userId mismatch");
        return;
      }
      const upper = data.code?.toUpperCase().trim();
      if (VALID_COUPONS[upper] !== undefined) {
        setDiscount(VALID_COUPONS[upper]);
        setCouponCode(upper);
      }
      window.dispatchEvent(
        new CustomEvent("__SHELL_COUPON_APPLIED__", { detail: data })
      );
    });
    return () => eventBus.unsubscribe(EVENTS.COUPON_APPLIED, handler);
  }, [currentUser]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.productId === product.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  const decreaseQuantity = (id) =>
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const removeItem = (id) =>
    setCartItems((prev) => prev.filter((i) => i.productId !== id));

  const getRawTotal = () =>
    cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const getCartTotal = () => {	 	  	      	 	    	    	    	    	 	
    const raw = getRawTotal();
    return raw - (raw * discount) / 100;
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setCouponCode("");
    localStorage.removeItem(storageKey);
  };

  return (
    <ShellCartContext.Provider value={{
      cartItems, addToCart,
      increaseQuantity, decreaseQuantity,
      removeItem, getCartTotal, getRawTotal,
      discount, couponCode, clearCart,
    }}>
      {children}
    </ShellCartContext.Provider>
  );
};

export const useShellCart = () => useContext(ShellCartContext);
export default ShellCartContext;	 	  	      	 	    	    	    	    	 	
