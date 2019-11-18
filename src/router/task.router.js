import Home from '@/views/layout/Index.vue'

export default [{
    path: '/',
    name: 'home',
    isParent: true, // 判断是否为父项
    isOnce: true, // 判断是否为单项
    component: Home,
    meta: {
        icon: 'el-icon-s-home'
    },
    children: [{
        path: 'task',
        name: '日志',
        isParent: true,
        isOnceList: true, //路由鉴定（配合分配角色）
        hidden: false,
        meta: {},
        component: resolve => require(['@/views/Task.vue'], resolve)
    }]
}]