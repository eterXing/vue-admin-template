const getters = {
    // 权限资源树
    resourceList: state => state.user.resourceList,
    // 用户信息
    userInfo: state => state.user.userInfo,
    // 用户侧边栏
    userRoutes: state => state.user.userRoutes,
    // 用户路由
    routerList: state => state.user.routerList,
    // 有无进行鉴权
    isCompare: state => state.user.isCompare,
    // token
    accessToken: state => state.user.accessToken
}

export default getters