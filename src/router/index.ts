import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// Core components, load previously.
import Main from "~/views/MainView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import { routerSetup } from "./setup";
import { coreRoutes } from "./corePath";
const Login = () => import("~/views/LoginView.vue");
const LoginComplete = () => import("~/views/LoginCompleteView.vue");
const ResetPassword = () => import("~/views/ResetPasswordView.vue");

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
    meta: { requiresAuth: false, title: "登录" },
  },
  {
    path: "/login/complete",
    component: LoginComplete,
    meta: { requiresAuth: false, title: "完善注册信息" },
  },
  {
    path: "/login/reset",
    component: ResetPassword,
    meta: { requiresAuth: false, title: "重置密码" },
  },
  {
    path: "/unauthorized",
    component: UnauthorizedView,
    meta: { requiresAuth: false, title: "未授权访问" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
    meta: { requiresAuth: false, title: "404 Not Found" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

routerSetup(router);

export default router;
