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
      {
        path: 'TableTargetBasicInfo',
        name: 'targetBasicInfo',
        component: () => import('@/components/Table/TargetBasicInfo.vue'),
      },
      {
        path: 'TableSubTargetMaintain',
        name: 'subTargetMaintain',
        component: () => import('@/components/Table/SubTargetMaintain.vue'),
      },
      {
        path: 'Pagination',
        name: 'Pagination',
        component: () => import('@/components/Pagination/test.vue'),
      },
      {
        path: 'ContextMenu',
        name: 'ContextMenu',
        component: () => import('@/components/ContextMenu/index.vue'),
      },
    ],
  },
];

export default testRoutes;
