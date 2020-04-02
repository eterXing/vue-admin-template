/*
 * @Date: 2020-04-02 09:51:35
 * @LastEditTime: 2020-04-02 10:50:00
 * @Description: 入口
 */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/router.js'
import store from './store/store'

// 引入elementui
import ElementUI from 'element-ui'
import '@/assets/css/common.scss'
import '@/assets/css/reset.scss'
import '@/assets/css/theme/element-variables.scss'
Vue.use(ElementUI)

// 开发报错处理
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

// 请求
import http from '@/api/http.js'
Vue.prototype.$axios = http()

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')