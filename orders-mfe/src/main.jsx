import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import OrdersApp from "./OrdersApp";

// This BrowserRouter is ONLY for standalone dev mode (port 4204)
// When loaded inside Shell, Shell's BrowserRouter is used instead
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <OrdersApp />
  </BrowserRouter>
);