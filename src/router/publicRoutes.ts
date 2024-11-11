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
            // 目标体系 布局模版
            path: '@targetSystem',
            name: '@targetSystem',
            components: {
              default: () => import('@/layout/display0/index.vue'),
              header: () => import('@/layout/display0/header.vue'),
              main: () => import('@/layout/display0/main.vue'),
              aside: () => import('@/layout/display0/aside.vue'),
              footer: () => import('@/layout/display0/footer.vue'),
            },
            meta: {
              title: '@目标体系',
              icon: '@targetSystem',
            },
          },
          {
            // 目标体系 内容填充
            path: 'targetSystem',
            name: 'targetSystem',
            components: {
              default: () => import('@/layout/display0/index.vue'),
              header: () => import('@/components/Header/index.vue'),
              main: () => import('@/components/Tabs/example/BInfoAndImage.vue'),
              aside: () => import('@/components/Tabs/example/SysAndTarget.vue'),
              footer: () => import('@/layout/display0/footer.vue'),
            },
            meta: {
              title: '目标体系',
              icon: 'targetSystem',
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
            path: '@targetValueAnalyse',
            name: '@targetValueAnalyse',
            components: {
              default: () => import('@/layout/display1/index.vue'),
              header: () => import('@/layout/display1/header.vue'),
              main_h: () => import('@/layout/display1/main.vue'),
              main_m: () => import('@/layout/display1/main.vue'),
              main_f: () => import('@/layout/display1/main.vue'),
              aside: () => import('@/layout/display1/aside.vue'),
              footer: () => import('@/layout/display1/footer.vue'),
            },
            meta: {
              title: '页面1',
              icon: 'display1',
            },
          },
          {
            path: 'targetValueAnalyse',
            name: 'targetValueAnalyse',
            components: {
              default: () => import('@/layout/display1/index.vue'),
              header: () => import('@/components/Header/index.vue'),
              main_h: () => import('@/layout/display1/main.vue'),
              main_m: () => import('@/components/Tree/TreeOrg.vue'),
              main_f: () =>
                import('@/components/Table/example/TargetAnalyse.vue'),
              aside: () => import('@/components/Tabs/example/SysAndTarget.vue'),
              footer: () => import('@/layout/display1/footer.vue'),
            },
            meta: {
              title: '页面1',
              icon: 'display1',
            },
          },
        ],
      },
      {
        path: 'display2',
        name: 'display2',
        component: () => import('@/layout/display2/index.vue'),
        meta: {
          title: '页面2',
          icon: 'display2',
        },
      },
    ],
  },
];

export default publicRoutes;
