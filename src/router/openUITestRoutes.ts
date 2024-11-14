import { type RouteRecordRaw } from 'vue-router';
const testRoutes: RouteRecordRaw[] = [
  {
    path: '/openUIComp',
    name: 'openUIComp',
    component: () => import('@/views/test/openUITest.vue'),
    children: [
      {
        path: 'TreeWithCtxmenu',
        name: 'TreeWithCtxmenu',
        //@ts-ignore 
        component: () => import('@openUI/OpenTree/index.tsx'),
      },
    ],
  },
];

export default testRoutes;
