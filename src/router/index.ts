import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "../store/mainStore";
import Login from "~/views/LoginView.vue";
import Main from "~/views/MainView.vue";
import Home from "~/views/HomeView.vue";
import Exam from "~/views/ExamView.vue";
import Dashboard from "~/views/DashboardView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import ProblemView from "~/views/ProblemView.vue";

const routes = [
  {
    path: "/",
    component: Main,
    meta: { requiresAuth: true, title: "Main" },
    children: [
      {
        path: "home",
        component: Home,
        meta: { requiresAuth: true, roles: ["User"], title: "Home" },
      },
      {
        path: "exam",
        component: Exam,
        meta: {
          requiresAuth: true,
          roles: ["Administartor", "User"],
          title: "Exam",
        },
      },
      {
        path: "dashboard",
        component: Dashboard,
        meta: {
          requiresAuth: true,
          roles: ["Administartor"],
          title: "Dashboard",
        },
      },
      {
        path: "/problem",
        component: ProblemView,
        meta: {
          requiresAuth: true,
          roles: ["Administartor", "User"],
          title: "Problem",
        },
      },
    ],
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

router.beforeEach((to, _, next) => {
  const store = useMainStore();
  const isLoggedIn = store.isLoggedIn;
  const userRole = store.userRole;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next("/login");
    } else if (
      to.matched.some(
        (record) => record.meta.roles && !record.meta.roles.includes(userRole)
      )
    ) {
      next("/unauthorized");
    } else {
      if (to.path === "/") {
        if (userRole === "Administrator") {
          next("/dashboard");
        } else if (userRole === "User") {
          next("/home");
        } else {
          next("/unauthorized");
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
