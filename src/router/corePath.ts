import type { RouteRecordRaw } from "vue-router";

const Home = () => import("~/views/HomeView.vue");
const ExamCommit = () => import("~/views/Exam/CommitView.vue");
const ExamReview = () => import("~/views/Exam/ReviewView.vue");
const ExamEdit = () => import("~/views/Exam/EditView.vue");
const Dashboard = () => import("~/views/DashboardView.vue");
const ProblemCommit = () => import("~/views/Problem/CommitView.vue");
const ProblemReview = () => import("~/views/Problem/ReviewView.vue");
const ProblemEdit = () => import("~/views/Problem/EditView.vue");

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
        path: "commit",
        component: ExamCommit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator", "User"],
          title: "Exam Commit",
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
      {
        path: "edit",
        component: ExamEdit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "Exam Edit",
        },
      }
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
        path: "commit",
        component: ProblemCommit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator", "User"],
          title: "Problem Commit",
        },
      },
      {
        path: "review",
        component: ProblemReview,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "Problem Review",
        },
      },
      {
        path: "edit",
        component: ProblemEdit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "Problem Edit",
        },
      },
    ],
  },
];
