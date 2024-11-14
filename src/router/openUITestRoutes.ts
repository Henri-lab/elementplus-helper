import { type RouteRecordRaw } from 'vue-router';
const testRoutes: RouteRecordRaw[] = [
  {
    path: '/openUIComp',
    name: 'openUIComp',
    component: () => import('@/views/test/openUITest.vue'),
    children: [
      {
        path: 'Tree(tsx)',
        name: 'Tree(tsx)',
        //@ts-ignore
        component: () => import('@openUI/OpenTree/index.tsx'),
      },
      {
        path: 'Tree(ts)',
        name: 'Tree(ts)',
        //@ts-ignore
        component: () => import('@openUI/OpenTree/index.ts'),
      },
      {
        path: 'Tabs',
        name: 'Tabs',
        //@ts-ignore
        component: () => import('@openUI/OpenTabs/test/test1.ts'),
      },
      {
        path: 'Table',
        name: 'Table',
        //@ts-ignore
        component: () => import('@openUI/OpenTable/test/test1.ts'),
      },
    ],
  },
];

export default testRoutes;
