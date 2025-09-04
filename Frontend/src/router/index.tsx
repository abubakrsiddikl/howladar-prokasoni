import App from "@/App";
import AuthenticationLayout from "@/components/layout/AuthenticationLayout";
import HomePage from "@/pages/Home";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

import { createBrowserRouter } from "react-router";
import Cart from "@/pages/Cart";
import CheckoutPage from "@/pages/User/Checkout";
import OrderSuccessPage from "@/pages/User/OrderSuccess";
import { withAuth } from "@/utils/withAuth";
import MyOrdersPage from "@/pages/User/MyOrders";
import OrderDetails from "@/pages/User/OrderDetails";

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
      // user route
      {
        Component: Cart,
        path: "/cart",
      },
      {
        Component: withAuth(CheckoutPage, "CUSTOMER"),
        path: "/checkout",
      },
      {
        Component: OrderSuccessPage,
        path: "/ordersuccess/:id",
      },
      {
        Component: withAuth(MyOrdersPage, "CUSTOMER"),
        path: "/my-orders",
      },
      {
        Component: OrderDetails,
        path: "/orderdetails/:id",
      },
    ],
  },
]);
