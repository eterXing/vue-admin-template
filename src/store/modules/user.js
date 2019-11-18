import {
    copy,
    myflat
} from '@/commonFunction/index.js'
import Home from '@/views/layout/Index.vue'

/**
 * 递归获取权限
 * @param {后台返回权限map数据} item
 * @param {前端获取的路由列表} routerList
 * @return {该角色的权限路由接口}
 */
function getNowRouter(item, routerList) {
    if (item.children && item.children.length > 0) {
        if (item.children[0].type) {
            let data = copy(item.children)

            item.children = []
            item.meta = data
        } else {
            item.children = item.children.filter(list => getNowRouter(list, routerList))
        }
    }
    for (let i = 0; i < routerList.length; i++) {
        if (routerList[i].isOnceList) {
            // 侧边栏为单项处理
            if (routerList[i].path === item.route.split('/')[1]) {
                // 利用对象指向特性
                let data = copy(item)

                item.path = '/'
                item.name = 'home'
                item.isParent = true
                item.isOnce = true
                item.route = '/'
                item.component = Home
                item.children = [{
                    path: routerList[i].path,
                    isOnce: routerList[i].isOnce,
                    component: routerList[i].component,
                    hidden: routerList[i].hidden,
                    name: data.resourceName,
                    route: data.route
                }]
                return item
            }
            // 侧边栏为多项处理
        } else if (routerList[i].isParent) {
            if (routerList[i].path.split('/')[routerList[i].path.split('/').length - 1] === item.route.split('/')[item.route.split('/').length - 1]) {
                item.path = routerList[i].path
                item.isOnce = routerList[i].isOnce
                item.name = item.resourceName
                item.component = routerList[i].component
                item.hidden = routerList[i].hidden
                return item
            }
            // 侧边栏为子项处理
        } else if (item.route.split('/')[item.route.split('/').length - 1] === routerList[i].path) {
            item.path = routerList[i].path
            item.name = item.resourceName
            item.component = routerList[i].component
            item.hidden = routerList[i].hidden
            return item
        }
    }
}

/**
 * 展开router深层数组
 * @param {前端路由map数据} item
 * @return {router展开数据}
 */
function openRouters(item) {
    if (item.children && item.children[0]) {
        let fatherRouter = {
            path: item.path,
            isOnce: item.isOnce,
            isOnceList: item.isOnceList,
            isParent: item.isParent,
            component: item.component,
            name: item.name,
            hidden: item.hidden
        }

        return [fatherRouter, ...item.children.map(item2 => openRouters(item2))]
    }
    return {
        path: item.path,
        isOnce: item.isOnce,
        isOnceList: item.isOnceList,
        isParent: item.isParent,
        component: item.component,
        name: item.name,
        hidden: item.hidden
    }
}

// 删除忽略路由
function delectNavRouter(data) {
    let arr = Array.from(data)

    arr.map(item => {
        if (item.hidden) {
            data.remove(item)
            return
        }
        if (item.children && item.children.length > 0) {
            delectNavRouter(item.children)
        }
    })
}

const user = {
    state: {
        userInfo: {}, // 信息
        accessToken: '',
        isCompare: false, // 有无进行权限获取
        resourceList: [], // 后台返回角色路由权限
        routerList: [], // 路由
        userRoutes: [] // 角色侧边栏
    },
    mutations: {
        // 获取用户相关信息
        GET_USERINFO(state) {
            if (localStorage.getItem('resourceList')) {
                state.resourceList = JSON.parse(localStorage.getItem('resourceList'))
            }
            if (localStorage.getItem('userInfo')) {
                state.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            }
            if (localStorage.getItem('accessToken')) {
                state.accessToken = localStorage.getItem('accessToken')
            }
            if (localStorage.getItem('isCompare')) {
                state.accessToken = JSON.parse(localStorage.getItem('isCompare'))
            }
        },
        // 保存用户相关信息
        SET_USERINFO(state, data) {
            state.resourceList = data.resourceList
            state.userInfo = data.userInfo
            state.accessToken = data.accessToken
            localStorage.setItem('resourceList', JSON.stringify(state.resourceList))
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
            localStorage.setItem('accessToken', state.accessToken)
        },
        // 删除用户相关信息
        DEL_USERINFO(state) {
            state.resourceList = []
            state.userInfo = {}
            state.accessToken = ''
            state.isCompare = false
            state.routerList = []
            state.userRoutes = []
            localStorage.removeItem('resourceList')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('isCompare')
        },
        // 保存路由信息
        SET_ROUTERS(state, data) {
            state.routerList = data
        },
        // 判断有无进行权限判断
        SET_ISCOMPARE(state) {
            state.isCompare = true
            localStorage.setItem('isCompare', 'true')
        },
        // 保存侧边栏信息(过滤hidden)
        SET_USERROUTES(state, data) {
            let navRouter = copy(data)

            delectNavRouter(navRouter)
            state.userRoutes = navRouter
        }
    },
    actions: {
        getUserInfo(context) {
            context.commit('GET_USERINFO')
        },
        setUserInfo(context, data) {
            context.commit('SET_USERINFO', data)
        },
        delUserInfo(context) {
            context.commit('DEL_USERINFO')
        },
        // 获取router列表
        getRouterList(context, asyncRouterMap) {
            let resourceList = context.state.resourceList,
                accessedRouters = []

            if (resourceList.length && asyncRouterMap.length) {
                // 展开数组
                let routerList = asyncRouterMap.map(item => openRouters(item))

                routerList = myflat(routerList)
                // eslint-disable-next-line one-var
                accessedRouters = resourceList.filter(item =>
                    getNowRouter(item, routerList)
                )
            }

            context.commit('SET_ROUTERS', accessedRouters)
            context.commit('SET_USERROUTES', accessedRouters)
            context.commit('SET_ISCOMPARE')
            return accessedRouters
        }
    }
}

export default user