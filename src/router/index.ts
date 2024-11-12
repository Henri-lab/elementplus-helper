import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';
import testRoutes from './testRoutes';
import openUITestRoutes from './openUITestRoutes';

const myRoutes = publicRoutes.concat(testRoutes).concat(openUITestRoutes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: myRoutes,
});

export default router;
