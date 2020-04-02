import axios from 'Axios'
import Vue from 'vue'
import store from '../store/store.js'
import router from '../router/router.js'
import Api from './api.js'
import { baseUrl } from '@/config/env.js'
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 15000

let allApi = [...Api]
// 隐藏提示信息
const hideMessageApi = [],
    // 取消节流
    cancelThrottle = []

// request拦截器，携带token
axios.interceptors.request.use(
    config => {
        if (store.getters.accessToken) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.accessToken = store.getters.accessToken
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// response 拦截器
axios.interceptors.response.use(
    // response => response,
    response => {
        if (response.status === 200 && response.data.code === 3425) {
            // 删除用户相关信息
            store.dispatch('delUserInfo')
            router.push({
                path: '/login'
            })
        } else if (response.data.status === 403) {
            router.push({
                path: '/error/403'
            })
        } else if (response.status === 500) {
            router.push({
                path: '/error/500'
            })
        }
        if (response.status !== 200 || response.data.code !== 2000) {
            // 登录接口弹窗
            if (response.config.url.includes('/login')) {
                Vue.prototype.$alert(
                    response.data.msg ? response.data.msg : response.statusText,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        type: 'error'
                    }
                )
            } else if (!hideMessageApi.some(item => response.config.url.includes(item))) {
                Vue.prototype.$message({
                    type: 'warning',
                    message: response.data.msg ? response.data.msg : response.statusText
                })
            }
        }
        return response
    },
    error => {
        return Promise.reject(error) // 返回接口返回的错误信息
    }
)

//   包含所有请求方法的构造函数
function _Http () { }

// 封装使用
// 封装使用
export default (function () {
    function http (url = allApi) {

        var _httpob = new _Http()

        url.map(item => {
            let name = http.getName(item)

            _httpob[name + 'Status'] = 1
            _httpob[name] = function (val = {}, options = {}) {
                return _httpob.sendMsg(item, val, options, item.method)
            }
        })
        return _httpob
    }

    // axios请求(防止重复请求)
    _Http.prototype.sendMsg = function (item, value, options) {
        let name = http.getName(item),
            method = item.method ? item.method : 'post'
        var status = {
            get: () => {
                return axios.get(item.url, {
                    params: value
                }, options).then(res => {
                    this[name + 'Status'] = 1
                    return res
                }).catch(() => {
                    this[name + 'Status'] = 1
                    Vue.prototype.$message.warning('网络出现问题，请稍后重试')
                })
            },
            post: () => {
                return axios.post(item.url, value, options).then(res => {
                    this[name + 'Status'] = 1
                    return res
                }).catch(() => {
                    this[name + 'Status'] = 1
                    Vue.prototype.$message.warning('网络出现问题，请稍后重试')
                })
            }
        }

        if (this[name + 'Status'] || cancelThrottle.includes(name)) {
            this[name + 'Status'] = 0
            return status[method]()
        }
        return new Promise(reject => {
            reject({
                status: 40001
            })
        })

    }

    // 获取接口名字
    http.getName = function (item) {
        let apiName = ''

        if (item.apiName) {
            apiName = item.apiName
        } else if (item.url) {
            let arr = item.url.split('/')

            apiName = arr[arr.length - 1]
        } else {
            console.error('api对象必须要有url', item)
        }

        return apiName
    }
    return http
})()