import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import disableDevtool from "disable-devtool";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "./components/ui/sonner";
if (import.meta.env.PROD) {
  disableDevtool({
    clearLog: true,
  });
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors />
  </StrictMode>
);
