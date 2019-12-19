import Home from '@/views/layout/Index.vue'

export default [{
    path: '/system',
    name: '系统管理',
    component: Home,
    isParent: true,
    meta: {
        icon: 'el-icon-view'
    },
    children: [{
        path: 'resourceManagement',
        name: '资源管理',
        hidden: false,
        meta: {
            icon: 'icon'
        },
        component: resolve => require(['@/views/system/resourceManagement/Index.vue'], resolve)
    }]
}]