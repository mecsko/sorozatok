import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AccountView from "./views/AccountView.vue";
import GridSeriesView from "./views/GridSeriesView.vue";
import StartPageView from "./views/StartPageView.vue";
import AboutView from "./views/About.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "startpage",
    component: StartPageView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
  },
  {
    path: "/grid",
    name: "grid-series",
    component: GridSeriesView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((_to, _from, next) => {
  next();
});
export default router;
