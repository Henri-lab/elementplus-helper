import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';

const myRoutes = publicRoutes;
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: myRoutes,
});

export default router;
