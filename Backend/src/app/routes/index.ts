import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { BookRoutes } from "../module/book/book.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
