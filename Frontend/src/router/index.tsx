import App from "@/App";
import AuthenticationLayout from "@/components/layout/AuthenticationLayout";
import HomePage from "@/pages/Home";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

import { createBrowserRouter, Navigate } from "react-router";
import Cart from "@/pages/Cart";
import CheckoutPage from "@/pages/User/Checkout";
import OrderSuccessPage from "@/pages/User/OrderSuccess";
import { withAuth } from "@/utils/withAuth";
import OrderDetails from "@/pages/User/OrderDetails";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { storeManagerSidebarItems } from "./storeManagerSidebarItems";

// export const router = createBrowserRouter([
//   {
//     Component: App,
//     path: "/",
//     children: [
//       {
//         Component: HomePage,
//         index: true,
//       },
//       // auth layout
//       {
//         Component: AuthenticationLayout,
//         path: "/auth",
//         children: [
//           {
//             Component: Login,
//             path: "login",
//           },
//           {
//             Component: Register,
//             path: "register",
//           },
//         ],
//       },
//       // user route
//       {
//         Component: Cart,
//         path: "/cart",
//       },
//       {
//         Component: withAuth(CheckoutPage, role.customer as TRole),
//         path: "/checkout",
//       },
//       {
//         Component: OrderSuccessPage,
//         path: "/ordersuccess/:id",
//       },
//       {
//         Component: OrderDetails,
//         path: "/orderdetails/:id",
//       },
//     ],
//   },
//   // user route
//   {
//     Component: withAuth(DashboardLayout, role.customer as TRole),
//     path: "/user",
//     children: [
//       { index: true, element: <Navigate to="/user/my-orders"></Navigate> },
//       ...generateRoutes(userSidebarItems),
//     ],
//   },
//   // admin route
//   {
//     Component: withAuth(DashboardLayout, role.admin as TRole),
//     path: "/admin",
//     children: [
//       { index: true, element: <Navigate to="/admin/analytics"></Navigate> },
//       ...generateRoutes(adminSidebarItems),
//     ],
//   },
//   // store manager dashboard
//       {
//         Component: withAuth(
//           DashboardLayout,
//           (role.admin as TRole) || (role.storeManager as TRole)
//         ),
//         children: [
//           {
//             index: true,
//             element: <Navigate to="/store-manager/book/create" />,
//           },
//           ...generateRoutes(storeManagerSidebarItems),
//         ],
//       },
// ]);

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
        path: "auth",
        children: [
          { Component: Login, path: "login" },
          { Component: Register, path: "register" },
        ],
      },
      // সাধারণ route
      { Component: Cart, path: "cart" },
      { Component: withAuth(CheckoutPage, "CUSTOMER"), path: "checkout" },
      { Component: OrderSuccessPage, path: "ordersuccess/:id" },
      { Component: OrderDetails, path: "orderdetails/:id" },

      // user dashboard
      {
        Component: withAuth(DashboardLayout, role.customer as TRole),
        path: "user",
        children: [
          { index: true, element: <Navigate to="/user/my-orders" /> },
          ...generateRoutes(userSidebarItems),
        ],
      },

      // admin dashboard
      {
        Component: withAuth(DashboardLayout, role.admin as TRole),
        path: "admin",
        children: [
          { index: true, element: <Navigate to="/admin/analytics" /> },
          ...generateRoutes(adminSidebarItems),
        ],
      },
      // store manager dashboard
      {
        Component: withAuth(
          DashboardLayout,
          (role.admin as TRole) || (role.storeManager as TRole)
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/store-manager/book/create" />,
          },
          ...generateRoutes(storeManagerSidebarItems),
        ],
      },
    ],
  },
]);
