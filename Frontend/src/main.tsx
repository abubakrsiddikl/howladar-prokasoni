import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import { Provider as ReactProvider } from "react-redux";
import { router } from "./router";
import { store } from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactProvider store={store}>
      <RouterProvider router={router} />
    </ReactProvider>
  </StrictMode>
);
