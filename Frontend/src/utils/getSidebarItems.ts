import { role } from "@/constants/role";
import { adminSidebarItems } from "@/router/adminSidebarItems";
import { storeManagerSidebarItems } from "@/router/storeManagerSidebarItems";
import { userSidebarItems } from "@/router/userSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.admin:
      return [...adminSidebarItems, ...storeManagerSidebarItems];
    case role.storeManager:
      return [...storeManagerSidebarItems];
    case role.customer:
      return [...userSidebarItems];
    default:
      return [];
  }
};
