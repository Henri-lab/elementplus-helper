import { type RouteRecordRaw } from 'vue-router';
const testRoutes: RouteRecordRaw[] = [
  {
    path: '/testComponents',
    name: 'testComponent',
    component: () => import('@/views/test/index.vue'),
    children: [
      {
        path: 'Tree',
        name: 'Tree',
        component: () => import('@/components/Tree/index.vue'),
      },
      {
        path: 'Table',
        name: 'Table',
        component: () => import('@/components/Table/test.vue'),
      },
    ],
  },
];

export default testRoutes;
