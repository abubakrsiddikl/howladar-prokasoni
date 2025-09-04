import MyOrdersPage from "@/pages/User/MyOrders";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Profile",
    items: [
      {
        title: "Orders",
        url: "/user/my-orders",
        component: MyOrdersPage,
      },
    ],
  },
];
