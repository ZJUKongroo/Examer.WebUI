import type { RouteRecordRaw } from "vue-router";

const Home = () => import("~/views/HomeView.vue");

const ExamCommit = () => import("~/views/Exam/CommitView.vue");
const ExamReview = () => import("~/views/Exam/ReviewView.vue");
const ExamEdit = () => import("~/views/Exam/EditView.vue");
const ExamGroup = () => import("~/views/Exam/GroupView.vue");
const ExamCandidate = () => import("~/views/Exam/CandidateView.vue");

const Dashboard = () => import("~/views/DashboardView.vue");

const ProblemCommit = () => import("~/views/Problem/CommitView.vue");
const ProblemReview = () => import("~/views/Problem/ReviewView.vue");
const ProblemEdit = () => import("~/views/Problem/EditView.vue");
const FooterAbout = () => import("~/views/Footer/AboutView.vue");
const FooterTermOfUse = () => import("~/views/Footer/TermOfUseView.vue");
const FooterLicense = () => import("~/views/Footer/LicenseView.vue");
const UserDetail = () => import("~/views/UserDetailView.vue");

export const coreRoutes: RouteRecordRaw[] = [
  {
    path: "home",
    component: Home,
    meta: { requiresAuth: true, roles: ["User"], title: "主页" },
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
          title: "考试提交",
        },
      },
      {
        path: "review",
        component: ExamReview,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "考试评测",
        },
      },
      {
        path: "edit",
        component: ExamEdit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "考试编辑",
        },
      },
      {
        path:"group",
        component: ExamGroup,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "考试分组",
        },
      },
      {
        path:"candidate",
        component: ExamCandidate,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "考生编辑",
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
      title: "仪表盘",
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
          title: "题目提交",
        },
      },
      {
        path: "review",
        component: ProblemReview,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "题目评测",
        },
      },
      {
        path: "edit",
        props: true,
        component: ProblemEdit,
        meta: {
          requiresAuth: true,
          roles: ["Administrator"],
          title: "题目编辑",
        },
      },
    ],
  },
  {
    path: "user/detail",
    component: UserDetail,
    meta: {
      requiresAuth: true,
      roles: ["Administrator", "User"],
      title: "用户详情",
    },
  },
  {
    path: "about",
    component: FooterAbout,
    meta: {
      requiresAuth: false,
      roles: ["Administrator"],
      title: "关于",
    },
  },
  {
    path: "term-of-use",
    component: FooterTermOfUse,
    meta: {
      requiresAuth: false,
      roles: ["Administrator"],
      title: "使用条款",
    },
  },
  {
    path: "license",
    component: FooterLicense,
    meta: {
      requiresAuth: false,
      title: "许可证与致谢",
    },
  },
];
