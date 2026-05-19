import React from "react";
import Offers from "./components/Offers";
import "./styles/offers.css";

const App = () => {
  return (
    <div>
      <div className="offers-header">
        <h1>FashionHub Offers</h1>
      </div>
      <Offers />
    </div>
  );
};

export default App;