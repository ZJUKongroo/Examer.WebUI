import type { Router } from "vue-router";
import { useMainStore } from "../store/mainStore";
import { UserRole } from "../enums/";

export function routerSetup(router: Router) {
  const homepageMap: Record<UserRole, string> = {
    [UserRole.SuperAdministrator]: "/dashboard",
    [UserRole.Administrator]: "/dashboard",
    [UserRole.User]: "/home",
  };

  router.beforeEach((to, _, next) => {
    if (to.matched.every((record) => record.meta.requiresAuth)) {
      const store = useMainStore();
      const isLoggedIn = store.isLoggedIn;
      const userRole = store.userRole;
      if (isLoggedIn && userRole!=null) {
        if (to.path === "/") {
          next(homepageMap[userRole]);
        } else if (
          to.matched.some(
            (record) =>
              userRole &&
              !record.meta.roles?.filter((role) => UserRole[role as keyof typeof UserRole] === userRole).length
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
