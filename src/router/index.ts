import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';
import testRoutes from './testRoutes';

const myRoutes = publicRoutes.concat(testRoutes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: myRoutes,
});

export default router;
