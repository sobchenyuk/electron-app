import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "@/components/ui/toast";
import App from "./App";
import { Toaster } from "./components/Toaster";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toaster />
    </ToastProvider>
  </React.StrictMode>,
);
