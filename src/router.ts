import { createRouter, createWebHistory } from 'vue-router';
import Home from "../src/views/Home.vue";
import Game from "../src/views/Game.vue";
import Ranking from "../src/views/Ranking.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/game",
    name: "game",
    component: Game
  },
  {
    path: "/ranking",
    name: "ranking",
    component: Ranking
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
