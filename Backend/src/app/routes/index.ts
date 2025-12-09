import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { BookRoutes } from "../module/book/book.route";
import { CartRoutes } from "../module/cart/cart.route";
import { OrderRoutes } from "../module/order/order.route";
import { GenreRoutes } from "../module/genre/genre.route";
import { BannerRoutes } from "../module/banner/banner.route";
import { StatsRoutes } from "../module/stats/stats.route";
import { SitemapRoutes } from "../module/sitemap/sitempa.route";
import { PaymentRoutes } from "../module/payment/payment.route";
import { AuthorRoutes } from "../module/author/author.route";

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
    path: "/author",
    route: AuthorRoutes,
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
  {
    path: "/banner",
    route: BannerRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/sitemap.xml",
    route: SitemapRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
