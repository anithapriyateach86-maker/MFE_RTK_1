// cart-mfe/src/components/Cart.jsx
import React from "react";
import "../styles/Cart.css";
import { useCart } from "../cartStore";
import eventBus, { EVENTS } from "../utils/eventBus";

const Cart = ({ user }) => {
  // useCart() — when inside Shell, this reads from Shell's CartProvider
  // because Shell's CartProvider wraps everything and singleton sharing
  // means cart-mfe uses the SAME CartContext instance
  const cartContext = useCart();

  // Safety check — if somehow context is undefined
  if (!cartContext) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getRawTotal,
    discount,
    couponCode,
    clearCart,
  } = cartContext;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }	 	  	      	 	    	    	    	    	 	

    const orderData = {
      userId: user?.userId || "guest",
      token:  user?.token  || "",
      items: cartItems.map((i) => ({
        name:  i.title,
        price: i.price * i.quantity,
      })),
      total: getCartTotal(),
    };

    eventBus.publish(EVENTS.ORDER_PLACED, orderData);
    clearCart();
    alert("✅ Order placed! Check Orders tab.");
  };

  const rawTotal    = getRawTotal();
  const finalTotal  = getCartTotal();
  const savedAmount = rawTotal - finalTotal;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div className="cart-content">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          {user && (
            <p style={{ color: "#7B7FD8", fontSize: "13px", margin: "4px 0 0" }}>
              👤 {user.name}'s cart
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.image}	 	  	      	 	    	    	    	    	 	
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(item.productId)}
                    >-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => increaseQuantity(item.productId)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}

            {discount > 0 && (
              <div style={{
                background: "#d4edda", borderRadius: "8px",
                padding: "12px 16px", marginTop: "16px",
                border: "1px solid #c3e6cb",
              }}>
                <div style={{ color: "#155724", fontWeight: "700" }}>
                  🎉 Coupon <strong>{couponCode}</strong> applied!
                  You save {discount}% (${savedAmount.toFixed(2)})
                </div>
              </div>
            )}

            <div className="cart-total" style={{ marginTop: "16px" }}>
              {discount > 0 && (
                <div style={{	 	  	      	 	    	    	    	    	 	
                  color: "#999", textDecoration: "line-through",
                  fontSize: "14px", marginBottom: "4px",
                }}>
                  Original: ${rawTotal.toFixed(2)}
                </div>
              )}
              <div className="total-amount">
                Total: ${finalTotal.toFixed(2)}
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;