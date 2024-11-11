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
        component: () => import('@/components/Tree/test.vue'),
      },
      {
        path: 'Tree2',
        name: 'Tree2',
        component: () => import('@/components/Tree/testDialog.vue'),
      },
      {
        path: 'TreeOrg',
        name: 'TreeOrg',
        component: () => import('@/components/Tree/TreeOrg.vue'),
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
