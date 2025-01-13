import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "../store/mainStore";
import Login from "@/views/LoginView.vue";
import Home from "@/views/HomeView.vue";
import Exam from "@/views/ExamView.vue";

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      { path: "exam", component: Exam }
    ]
  },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const store = useMainStore();
  if (to.path !== "/login" && !store.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
