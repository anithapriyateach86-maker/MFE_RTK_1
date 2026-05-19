import React from "react";
import Offers from "./components/Offers";
// Task 5 — Import scoped CSS instead of global CSS
import "./styles/offers-scoped.css";

function OffersApp() {
  // Task 5 — wrapper div with offers-mfe-root class isolates all styles
  return (
    <div className="offers-mfe-root">
      <div className="offers-header">
        <span>🔥</span>
        <h1>FashionHub Offers</h1>
      </div>
      <Offers />
    </div>
  );
}

export default OffersApp;