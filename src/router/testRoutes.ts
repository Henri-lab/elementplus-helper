import { type RouteRecordRaw } from 'vue-router';
const testRoutes: RouteRecordRaw[] = [
  {
    path: '/testComponent',
    name: 'testComponent',
    component: () => import('@/views/test/index.vue'),
  },
];


export default testRoutes;