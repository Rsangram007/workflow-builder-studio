import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startTransition } from "react";

// Enable React Router future flags to eliminate warnings
startTransition(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
