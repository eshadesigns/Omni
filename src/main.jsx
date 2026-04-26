import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

console.log("BOOT: React starting");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);