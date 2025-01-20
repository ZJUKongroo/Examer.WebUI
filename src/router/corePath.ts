import type { RouteRecordRaw } from "vue-router";

const Home = () => import("~/views/HomeView.vue");
const ExamCommit = () => import("~/views/Exam/CommitView.vue");
const ExamReview = () => import("~/views/Exam/ReviewView.vue");
const Dashboard = () => import("~/views/DashboardView.vue");
const ProblemCommit = () => import("~/views/Problem/CommitView.vue");
const ProblemReview = () => import("~/views/Problem/ReviewView.vue");

export const coreRoutes: RouteRecordRaw[] = [
  {
    path: "home",
    component: Home,
    meta: { requiresAuth: true, roles: ["User"], title: "Home" },
  },
  {
    path: "exam",
    meta: {
      requiresAuth: true,
      roles: ["Administrator", "User"],
      title: "Exam",
    },
    children: [
      {
        path: "status",
        component: ExamCommit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator", "User"],
          title: "Exam Status",
        },
      },
      {
        path: "review",
        component: ExamReview,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "Exam Review",
        },
      },
    ],
  },
  {
    path: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: ["Administrator"],
      title: "Dashboard",
    },
  },
  {
    path: "problem",
    meta: {
      requiresAuth: true,
      roles: ["Administrator", "User"],
      title: "Problem",
    },
    children: [
      {
        path: "status",
        component: ProblemCommit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator", "User"],
          title: "Exam Status",
        },
      },
      {
        path: "review",
        component: ProblemReview,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "Exam Review",
        },
      },
    ],
  },
];
