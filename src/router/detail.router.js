import Home from '@/views/layout/Index.vue'

export default [{
    path: '/detail',
    name: '详情',
    isParent: true, // 判断是否为父项
    component: Home,
    meta: { },
    children: [{
        path: 'taskDetails',
        name: '日志详情',
        hidden: false,
        meta: {},
        component: resolve => require(['@/views/TaskDetails.vue'], resolve)
    }]
}]