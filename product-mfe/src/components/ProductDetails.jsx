// product-mfe/src/components/ProductDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import eventBus, { EVENTS } from "../utils/eventBus";

const ProductDetails = ({user}) => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { products } = useProducts();

  const product = products.find((p) => String(p.id) === String(id));

  if (products.length === 0) {
    return <p style={{ padding: "40px" }}>Loading product...</p>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products/list")} style={backBtnStyle}>
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Include userId + token — same as ProductCard
    eventBus.publish(EVENTS.ADD_TO_CART, {
      userId:  user?.userId || "guest",
      token:   user?.token  || "",
      product: { ...product, productId: product.id },
    });
    alert(`${product.title} added to cart!`);
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>

      <div style={{	 	  	      	 	    	    	    	    	 	
        display: "flex", gap: "32px", marginTop: "24px",
        background: "#fff", borderRadius: "12px",
        padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      }}>
        <img src={product.image} alt={product.title} style={{
          width: "240px", height: "300px",
          objectFit: "cover", borderRadius: "10px", flexShrink: 0,
        }} />

        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: "12px", color: "#7B7FD8",
            fontWeight: "700", textTransform: "uppercase",
          }}>
            {product.category}
          </span>
          <h2 style={{ margin: "10px 0 14px" }}>{product.title}</h2>
          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "20px" }}>
            {product.description}
          </p>
          <div style={{ display: "flex", alignItems: "center",
            gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#f5a623" }}>★</span>
            <span style={{ fontWeight: "700" }}>{product.rating.rate}</span>
            <span style={{ color: "#999" }}>({product.rating.count} reviews)</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800",
            color: "#1a1a2e", marginBottom: "24px" }}>
            ${product.price.toFixed(2)}
          </div>
          <button onClick={handleAddToCart} style={{
            background: "#7B7FD8", color: "white",
            border: "none", padding: "14px 36px",
            borderRadius: "10px", fontSize: "16px",
            cursor: "pointer", fontWeight: "700",
          }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const backBtnStyle = {	 	  	      	 	    	    	    	    	 	
  background: "transparent", border: "2px solid #7B7FD8",
  color: "#7B7FD8", padding: "8px 22px", borderRadius: "8px",
  cursor: "pointer", fontWeight: "600", fontSize: "14px",
};

export default ProductDetails;