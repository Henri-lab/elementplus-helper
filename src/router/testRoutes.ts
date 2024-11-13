import { type RouteRecordRaw } from 'vue-router';
const testRoutes: RouteRecordRaw[] = [
  {
    path: '/testComponents',
    name: 'testComponent',
    component: () => import('@/views/test/index.vue'),
    children: [
      {
        path: 'Tree',
        name: 'Tree(basic)',
        component: () => import('@/components/Tree/index.vue'),
      },
      {
        path: 'TreeApply',
        name: 'Tree(basic+)',
        component: () => import('@/components/Tree/test/testBasic.vue'),
      },
      {
        path: 'TreeDialog',
        name: 'Tree(Dialog)',
        component: () => import('@/components/Tree/test/WithDialog.vue'),
      },
      {
        path: 'TreeCtx',
        name: 'Tree(Ctx)',
        component: () => import('@/components/Tree/WithCtxmenu.vue'),
      },
      {
        path: 'TreeOrg',
        name: 'TreeOrg',
        component: () => import('@/components/TreeOrg/TreeOrg.vue'),
      },
      {
        path: 'Table',
        name: 'Table',
        component: () => import('@/components/Table/test.vue'),
      },
      {
        path: 'Dialog',
        name: 'Dialog',
        component: () => import('@/components/EditDialog/test.vue'),
      },
      {
        path: 'Form',
        name: 'Form',
        component: () => import('@/components/Form/index.vue'),
      },
      {
        path: 'EnhancdForm',
        name: 'EnhancdForm',
        component: () => import('@/components/EnhancedForm/test.vue'),
      },
      {
        path: 'DraggableDemo1',
        name: 'DraggableDemo1',
        component: () => import('@/components/Draggable/demo1.vue'),
      },
      {
        path: 'DraggableDemo2',
        name: 'DraggableDemo2',
        component: () => import('@/components/Draggable/demo2.vue'),
      },
      {
        path: 'DraggableDemo3',
        name: 'DraggableDemo3',
        component: () => import('@/components/Draggable/demo3.vue'),
      },
      {
        path: 'Tabs',
        name: 'Tabs',
        component: () => import('@/components/Tabs/test.vue'),
      },
    ],
  },
];

export default testRoutes;
