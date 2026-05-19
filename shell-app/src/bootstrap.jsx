import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { loadRemote } from "./utils/loadRemote";

async function init() {
  // Step 1: Fetch runtime config
  const res = await fetch("/remotes.config.json");
  const config = await res.json();

  // Step 2: Load all remotes dynamically
  await Promise.all([
    loadRemote("productApp", config.productApp),
    loadRemote("cartApp", config.cartApp),
  ]);

  // Step 3: Now render the app — remotes are ready
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

init().catch(console.error);