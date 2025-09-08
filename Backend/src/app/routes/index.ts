import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { BookRoutes } from "../module/book/book.route";
import { CartRoutes } from "../module/cart/cart.route";
import { OrderRoutes } from "../module/order/order.route";
import { GenreRoutes } from "../module/genre/genre.route";

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
    path: "/genre",
    route: GenreRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
