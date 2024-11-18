import { type RouteRecordRaw } from 'vue-router';
const publicRoutes: RouteRecordRaw[] = [
  //@ts-ignore
  {
    path: '/',
    name: 'Home',
    redirect: '/layout',
    meta: {
      title: '首页',
      icon: 'home',
    },
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '布局',
      icon: 'layout',
    },
    children: [
      {
        path: 'display0',
        name: 'display0',
        component: () => import('@/layout/display0/index.vue'),
        meta: {
          title: '页面0',
          icon: 'display0',
        },
        children: [
          {
            // 目标体系 内容填充
            path: 'targetSystem',
            name: 'targetSystem',
            components: {
              header: () => import('@/components/Header/index.vue'),
              main: () => import('@/views/TargetSystem/main.vue'),
              aside: () => import('@/components/Tabs/example/Sys&Target.ts'),
              footer: () => import('@/layout/display0/footer.vue'),
            },
            meta: {
              title: '目标体系',
              icon: 'targetSystem',
            },
          },
          {
            path: 'dataMaintain',
            name: 'dataMaintain',
            components: {
              header: () => import('@/components/Header/index.vue'),
              main: () => import('@/components/Tabs/example/MatainA&B&C.ts'),
              aside: () => import('@/components/Tabs/example/Sys&Target.ts'),
            },
            meta: {
              title: '数据维护',
              icon: 'dataMaitain',
            },
          },
        ],
      },
      {
        //目标价值分析 布局模版
        path: 'display1',
        name: 'display1',
        component: () => import('@/layout/display1/index.vue'),
        meta: {
          title: '页面1',
          icon: 'display1',
        },
        children: [
          {
            path: 'targetValueAnalyse',
            name: 'targetValueAnalyse',
            components: {
              header: () => import('@/components/Header/index.vue'),
              main_m: () => import('@/components/TreeOrg/TreeOrg.vue'),
              main_f: () =>
                import('@/components/Table/example/TargetAnalyse.ts'),
              aside: () => import('@/components/Tabs/example/Sys&Target.ts'),
            },
            meta: {
              title: '页面1',
              icon: 'display1',
            },
          },
        ],
      },
    ],
  },
];

export default publicRoutes;
