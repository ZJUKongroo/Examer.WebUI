import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

// Core components, load previously.
import Main from "~/views/MainView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import { routerSetup } from "./setup";
import { coreRoutes } from "./corePath";
const Login = () => import("~/views/LoginView.vue");

const routes:readonly RouteRecordRaw[] = [
  {
    path: "/",
    component: Main,
    meta: { requiresAuth: true, title: "Main",roles: ["Administrator", "User"] },
    children: coreRoutes
  },
  {
    path: "/login",
    component: Login,
    meta: { requiresAuth: false, title: "Login" },
  },
  {
    path: "/unauthorized",
    component: UnauthorizedView,
    meta: { requiresAuth: false, title: "Unauthorized" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
    meta: { requiresAuth: false, title: "404 Not Found" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

routerSetup(router);

export default router;
