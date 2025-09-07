import AddBook from "@/pages/StoreManager/AddBook";
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
    ],
  },
];
