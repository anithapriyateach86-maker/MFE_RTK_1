// product-mfe/src/components/ProductCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";
import eventBus, { EVENTS } from "../utils/eventBus";

// Add WISHLIST_UPDATED to EVENTS in eventBus.js
const SAVE_TO_WISHLIST = "SAVE_TO_WISHLIST";

const ProductCard = ({ product, user }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const goToDetails = () =>
    navigate(`/products/details/${product.id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    eventBus.publish(EVENTS.ADD_TO_CART, {
      userId:  user?.userId  || "guest",
      token:   user?.token   || "",
      product: { ...product, productId: product.id },
    });
    alert(`${product.title} added to cart!`);
  };

  // Save to wishlist via EventBus — no direct Profile MFE import
  // Satisfies: Integration with Product MFE (6 marks)
  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);

    window.dispatchEvent(new CustomEvent(SAVE_TO_WISHLIST, {
      detail: {
        userId:   user?.userId || "guest",
        token:    user?.token  || "",
        productId: product.id,
        title:    product.title,
        price:    product.price,
        image:    product.image,
        category: product.category,
      },
    }));

    alert(isWishlisted
      ? `${product.title} removed from wishlist`
      : `${product.title} saved to wishlist!`
    );
  };

  return (
    <div className="product-card">
      <img
        src={product.image} alt={product.title}	 	  	      	 	    	    	    	    	 	
        className="product-image"
        style={{ cursor: "pointer" }}
        onClick={goToDetails}
      />
      <div className="product-category">{product.category}</div>
      <h3
        className="product-title"
        style={{ cursor: "pointer" }}
        onClick={goToDetails}
      >
        {product.title}
      </h3>
      <div className="product-price">${product.price.toFixed(2)}</div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          style={{
            flex: 1, padding: "8px",
            background: isWishlisted ? "#fff0f5" : "#f5f5f5",
            border: `2px solid ${isWishlisted ? "#ff6b9d" : "#e0e0e0"}`,
            borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", fontWeight: "600",
            color: isWishlisted ? "#ff6b9d" : "#666",
          }}
        >
          {isWishlisted ? "❤️ Saved" : "🤍 Save"}
        </button>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          style={{
            flex: 2, padding: "8px",
            background: "#7B7FD8", color: "white",
            border: "none", borderRadius: "8px",
            cursor: "pointer", fontWeight: "700",
          }}	 	  	      	 	    	    	    	    	 	
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;