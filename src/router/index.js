import { createRouter, createWebHistory } from "vue-router"

import {
  NotFoundView,
  NetworkErrorView,
  ServerErrorView,
} from "@/components/errors"
import { ClientMainView, WordsView, ClientDefault, SpeedTrainingView, SpellingTrainerView } from "@/components/client"

import { LoginView } from "@/components/auth"
import store from "@/store"


const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  { path: "", name: "root", redirect: "/dictionaries" },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dictionaries",
    name: "client-main",
    component: ClientMainView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: ClientDefault,
        name: "default",
      },
      {
        path: ':id',
        component: WordsView,
        name: "words",
      },
    ]
  },
  {
    path: "/speed/:id",
    name: "speed",
    component: SpeedTrainingView,
    meta: { requiresAuth: false },
  },
  {
    path: "/spelling/:id",
    name: "spelling",
    component: SpellingTrainerView,
    meta: { requiresAuth: false },
  },
  {
    path: "/network-error",
    name: "network-error",
    component: NetworkErrorView,
    meta: { requiresAuth: false },
  },
  {
    path: "/server-error",
    name: "server-error",
    component: ServerErrorView,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }

  const user = store.getters["auth/getUser"]
  if (user) {
    const isStaff = user.is_staff
    if (to.meta.requiresStaff && !isStaff) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      }
    }
  }
})

export default router
