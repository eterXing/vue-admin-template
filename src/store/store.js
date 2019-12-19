import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import theme from './modules/theme.js'
import user from './modules/user.js'
import password from './modules/password.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        theme,
        user,
        password
    },
    getters
})