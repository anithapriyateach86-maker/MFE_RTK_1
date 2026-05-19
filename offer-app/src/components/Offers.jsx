// offers-mfe/src/components/Offers.jsx
import React, { useState } from "react";
import eventBus, { EVENTS } from "../utils/eventBus";

const offersData = [
  { id: 1, title: "FLASH SALE",    discount: "50% OFF",   description: "All men's clothing today only.", code: "FLASH50", expiry: "Ends midnight" },
  { id: 2, title: "NEW ARRIVALS",  discount: "20% OFF",   description: "First purchase on new season women's collection.", code: "NEW20",   expiry: "Valid 7 days" },
  { id: 3, title: "BUNDLE DEAL",   discount: "BUY 2 GET 1", description: "Mix and match any 3 items.", code: "BUNDLE3", expiry: "This weekend only" },
  { id: 4, title: "LOYALTY REWARD",discount: "30% OFF",   description: "Exclusive discount for returning customers.", code: "LOYAL30", expiry: "Ongoing" },
];

// Valid coupons — must match cartStore.js
const VALID_COUPONS = { SAVE10: 10, FLASH50: 50 };

const Offers = () => {
  const [copied, setCopied]         = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg]   = useState(null);  // {type, text}

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const applyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (!code) {
      setCouponMsg({ type: "error", text: "Please enter a coupon code." });
      return;
    }

    if (VALID_COUPONS[code] !== undefined) {
      // Fire event → Shell listens → Shell bridges to CartProvider
      eventBus.publish(EVENTS.COUPON_APPLIED, {
        code,
        discount: VALID_COUPONS[code],
      });
      setCouponMsg({	 	  	      	 	    	    	    	    	 	
        type: "success",
        text: `✅ Coupon ${code} applied! ${VALID_COUPONS[code]}% discount added to cart.`,
      });
      setCouponInput("");
    } else {
      setCouponMsg({
        type: "error",
        text: `❌ Invalid coupon "${code}". Try SAVE10 or FLASH50.`,
      });
    }
  };

  return (
    <div>
      <div className="offers-banner">
        🔥 EXCLUSIVE OFFERS — LIMITED TIME ONLY 🔥
      </div>

      <div className="offers-container">

        {/* ── Coupon input section ── */}
        <p className="section-title">Apply Coupon to Cart</p>
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "20px 24px", marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          <p style={{ color: "#555", marginBottom: "12px", fontSize: "14px" }}>
            Valid codes: <strong>SAVE10</strong> (10% off) ·{" "}
            <strong>FLASH50</strong> (50% off)
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Enter coupon code..."
              value={couponInput}	 	  	      	 	    	    	    	    	 	
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              style={{
                padding: "10px 16px", borderRadius: "8px",
                border: "2px solid #e0e0e0", fontSize: "15px",
                flex: "1", minWidth: "180px", outline: "none",
                textTransform: "uppercase",
              }}
            />
            <button
              onClick={applyCoupon}
              style={{
                background: "#7B7FD8", color: "white",
                border: "none", padding: "10px 24px",
                borderRadius: "8px", fontSize: "15px",
                cursor: "pointer", fontWeight: "700",
              }}
            >
              Apply
            </button>
          </div>

          {couponMsg && (
            <div style={{
              marginTop: "12px", padding: "10px 14px",
              borderRadius: "8px", fontSize: "14px", fontWeight: "600",
              background: couponMsg.type === "success" ? "#d4edda" : "#f8d7da",
              color:      couponMsg.type === "success" ? "#155724" : "#721c24",
            }}>
              {couponMsg.text}
            </div>
          )}
        </div>

        {/* ── Offer cards ── */}
        <p className="section-title">Today's Promotions</p>
        <div className="offer-grid">
          {offersData.map((offer) => (
            <div key={offer.id} className="offer-card">
              <h3>{offer.title}</h3>
              <div className="discount">{offer.discount}</div>
              <p>{offer.description}</p>
              <p className="expiry">{offer.expiry}</p>
              <button onClick={() => copyCode(offer.code)}>
                {copied === offer.code ? "✓ COPIED!" : `USE CODE: ${offer.code}`}	 	  	      	 	    	    	    	    	 	
              </button>
            </div>
          ))}
        </div>

        <p className="section-title">Promotional Banners</p>
        {[
          { icon: "🚚", text: "FREE SHIPPING on orders over $50" },
          { icon: "👥", text: "REFER A FRIEND — earn $10 credit" },
          { icon: "🎓", text: "STUDENT DISCOUNT — 15% off with valid ID" },
        ].map((b, i) => (
          <div key={i} className="banner-strip">
            <span style={{ fontSize: "1.4rem" }}>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;