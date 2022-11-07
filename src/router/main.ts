export default [
  {
    path: '/index', // 首页
    name: 'index',
    meta: { title: 'index' },
    component: () => import('@/views/Home/index.vue')
  }
]
