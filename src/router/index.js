import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),

    children: [
      {
        path: "products",
        name: "products",
        component: () => import("../views/ProductsView.vue"),
      },
      {
        path: "orders",
        name: "orders",
        component: () => import("../views/OrdersView.vue"),
      },
      {
        path: "coupons",
        name: "coupons",
        component: () => import("../views/CouponsView.vue"),
      },
      {
        path: "posts",
        name: "posts",
        component: () => import("../views/PostsView.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/UserboardView.vue"),

    children: [
      {
        path: "cart",
        name: "cart",
        component: () => import("../views/UserCart.vue"),
      },
      {
        path: "product/:productId",
        name: "productId",
        component: () => import("../views/UserProduct.vue"),
      },
      {
        path: "checkout/:orderId",
        name: "checkout",
        component: () => import("../views/UserCheckout.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
});

export default router;
