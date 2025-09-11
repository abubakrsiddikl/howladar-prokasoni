import Logout from "@/pages/Authentication/Logout";
import AddBanner from "@/pages/StoreManager/AddBanner";
import AddBook from "@/pages/StoreManager/AddBook";
import AddBookGenre from "@/pages/StoreManager/AddBookGenre";
import AllOrders from "@/pages/StoreManager/AllOrders";
import type { ISidebarItem } from "@/types";

export const storeManagerSidebarItems: ISidebarItem[] = [
  {
    title: "Store Manger",
    items: [
      {
        title: "Add New Book",
        url: "/store-manager/book/create",
        component: AddBook,
      },
      {
        title: "Add Book Category",
        url: "/store-manager/book/genre",
        component: AddBookGenre,
      },
      {
        title: "All Orders",
        url: "/store-manager/book/all-orders",
        component: AllOrders,
      },
      {
        title: "Add Banner",
        url: "/store-manager/banner/add",
        component: AddBanner,
      },
      {
        title: "Logout",
        url: "/store/logout",
        component: Logout,
      },
    ],
  },
];
