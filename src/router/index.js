import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/banka",
    name: "AdminBankA",
    component: () => import("../views/AdminBankA"),
  },
  {
    path: "/banka/credit",
    name: "AdminBankACredit",
    component: () => import("../views/AdminBankACredit"),
  },
  {
    path: "/bankb",
    name: "AdminBankB",
    component: () => import("../views/AdminBankB"),
  },
  {
    path: "/bankb/credit",
    name: "AdminBankBCredit",
    component: () => import("../views/AdminBankBCredit"),
  },
  {
    path: "/gov",
    name: "AdminGov",
    component: () => import("../views/AdminGov"),
  },
  {
    path: "/gov/credit",
    name: "AdminGovCredit",
    component: () => import("../views/AdminGovCredit"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
