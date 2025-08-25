import App from "@/App";
import AuthenticationLayout from "@/components/layout/AuthenticationLayout";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: AuthenticationLayout,
        path: "/auth",
        children: [
          {
            Component: Login,
            path: "login",
          },
          {
            Component: Register,
            path: "register"
          }
        ],
      },
    ],
  },
]);
