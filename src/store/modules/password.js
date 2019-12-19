// 记住密码
const userAbout = {
    state: {
        userAbout:{}
    },
    mutations: {
        GETUSERABOUT(state) {
            if (localStorage.getItem('userAbout')) {
                state.userAbout = JSON.parse(localStorage.getItem('userAbout'))
            }
            return state.userAbout
        },
        SETUSERABOUT(state, data) {
            state.userAbout = data
            localStorage.setItem('userAbout', JSON.stringify(data))
        },
        DELUSERABOUT(state){
            state.userAbout = {}
            localStorage.removeItem('userAbout')
        }
    },
    actions: {
        getUserAbout(context) {
            context.commit('GETUSERABOUT')
        },
        setUserAbout(context, data) {
            context.commit('SETUSERABOUT', data)
        },
        delUserAbout(context){
            context.commit('DELUSERABOUT')
        }
    }
}

export default userAbout