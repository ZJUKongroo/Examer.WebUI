import type { Router } from "vue-router";
import { useMainStore } from "../store/mainStore";
import type { UserRole } from "~/types";

export function routerSetup(router: Router) {
  const homepageMap: Record<UserRole, string> = {
    SuperAdministrator: "/dashboard",
    Administrator: "/dashboard",
    User: "/home",
  };

  router.beforeEach((to, _, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const store = useMainStore();
      const isLoggedIn = store.isLoggedIn;
      const userRole = store.userRole;
      if (isLoggedIn && userRole) {
        if (to.path === "/") {
          next(homepageMap[userRole]);
        } else if (
          to.matched.some(
            (record) =>
              userRole != "SuperAdministrator" &&
              !record.meta.roles?.includes(userRole)
          )
        ) {
          next("/unauthorized");
        } else {
          next();
        }
      } else next("/login");
    } else next();
  });

  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string;
    }
  });
}
