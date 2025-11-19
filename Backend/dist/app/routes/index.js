"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const book_route_1 = require("../module/book/book.route");
const cart_route_1 = require("../module/cart/cart.route");
const order_route_1 = require("../module/order/order.route");
const genre_route_1 = require("../module/genre/genre.route");
const banner_route_1 = require("../module/banner/banner.route");
const stats_route_1 = require("../module/stats/stats.route");
const sitempa_route_1 = require("../module/sitemap/sitempa.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/genre",
        route: genre_route_1.GenreRoutes,
    },
    {
        path: "/book",
        route: book_route_1.BookRoutes,
    },
    {
        path: "/cart",
        route: cart_route_1.CartRoutes,
    },
    {
        path: "/order",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/banner",
        route: banner_route_1.BannerRoutes,
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes,
    },
    {
        path: "/sitemap.xml",
        route: sitempa_route_1.SitemapRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
