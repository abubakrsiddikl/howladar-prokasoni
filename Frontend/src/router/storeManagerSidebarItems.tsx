import AddBook from "@/pages/StoreManager/AddBook";
import AddBookGenre from "@/pages/StoreManager/AddBookGenre";
import type { ISidebarItem } from "@/types";

export const storeManagerSidebarItems: ISidebarItem[] = [
  {
    title: "Getting Started",
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
    ],
  },
];
