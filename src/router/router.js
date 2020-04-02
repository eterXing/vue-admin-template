/*
 * @Date: 2020-04-02 09:51:35
 * @LastEditTime: 2020-04-02 10:40:59
 * @Description: 总路由+路由拦截
 */
import VueRouter from 'vue-router'
import store from '@/store/store.js'
import Home from '@/views/layout/Index.vue'

// 异步加载路由(权限)
let asyncRouterMap = []
const context = require.context('../router', false, /\.router.js$/)

context.keys().forEach(key => {
    asyncRouterMap = asyncRouterMap.concat(context(key).default)
})

const constantRouterMap = [{
    path: '/login',
    name: 'login',
    component: resolve => require(['@/views/Login.vue'], resolve)
}, {
    path: '/flowTemplate',
    name: 'flowTemplate',
    component: resolve => require(['@/views/flowTemplate/Index.vue'], resolve)
}, {
    path: '/',
    name: 'home',
    component: Home,
    children: [{
        path: 'index',
        name: '首页',
        hidden: false,
        meta: {
            icon: 'el-icon-s-home'
        },
        component: resolve => require(['@/views/Index.vue'], resolve)
    }]
}],

    router = new VueRouter({
        mode: 'hash',
        scrollBehavior: () => ({
            y: 0
        }), //这是路由跳转y轴到顶部
        routes: constantRouterMap
    })

// 路由守卫
router.beforeEach((to, from, next) => {
    // 获取路由权限
    store.dispatch('getUserInfo')
    // 判断有没有登录（没有就强制跳转）
    if (store.getters.userInfo.userName) {
        // 判断是否处理过用户路由权限
        if (!store.getters.isCompare) {
            // 调用方法获取
            store.dispatch('getRouterList', asyncRouterMap).then(res => {
                if (!store.getters.routerList.length) {
                    Vue.prototype.$alert('抱歉,您没有访问此系统的权限', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: () => {
                            store.dispatch('delUserInfo')
                            next({ path: '/login' })
                        }
                    })
                    return
                }
                router.addRoutes(res)
                next({
                    ...to,
                    replace: true
                }) //确保addroutes已完成
            })
        } else {
            next()
        }
    } else if (['login'].includes(to.name)) {
        if (to.meta.title) {
            document.title = to.meta.title
        }
        next()
    } else {
        next({
            path: '/login'
        })
    }
})

export default router