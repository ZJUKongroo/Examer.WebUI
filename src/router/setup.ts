import type { Router } from "vue-router";
import { useMainStore } from "../store/mainStore";
import type { UserRole } from "~/types";

export function routerSetup(router: Router) {
    const homepageMap: { [key: UserRole]: string } = {
        Administrator: "/dashboard",
        User: "/home",
    }

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
            if (to.path === "/") 
                next(homepageMap[userRole]);
            else {
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
}