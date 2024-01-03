import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    dark: false,
    compact: true,
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '数据报表',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '计数器',
      path: '/count',
      component: './Count',
    },
    {
      name: '自定义热区',
      path: '/hotpost',
      component: './HotPost',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
});

