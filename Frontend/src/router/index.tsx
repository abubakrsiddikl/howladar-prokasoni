import App from "@/App";
import AuthenticationLayout from "@/components/layout/AuthenticationLayout";
import HomePage from "@/pages/Home";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: HomePage,
        index: true,
      },
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
            path: "register",
          },
        ],
      },
    ],
  },
]);
