import {getUserInfoLocalHostdev, loginByusernameLocalHost, LoginOutLocalHost} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'

const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: '',
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                loginByusernameLocalHost(username, userInfo.password).then(response => {
                    if (response.data.code == 1001) {
                        alert("账号密码错误")
                        reject()
                    } else {
                        const data = response.data.jwt
                        console.log(data)
                        commit('SET_TOKEN', data)
                        setToken(response.data)
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },


        // actions: {
        //   // 用户名登录
        //   LoginByUsername ({ commit }, userInfo) {
        //     const username = userInfo.username.trim()
        //     return new Promise((resolve, reject) => {
        //       loginByUsername(username, userInfo.password).then(response => {
        //         window.console.log(response.data)
        //         if (response.data.code == 0) {
        //           const data = response.data
        //           commit('SET_TOKEN', data.token)
        //           setToken(response.data.token)
        //           resolve()
        //         } else {
        //           console.log("账号密码错误")
        //         }
        //         // window.console.log(response.data)
        //       }).catch(error => {
        //         reject(error)
        //       })
        //     })
        //   },


        // 获取用户信息
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfoLocalHostdev(state.token).then(response => {
                    if (!response.data) {
                        reject('密码错误')
                    }
                    const data = response.data
                    if (data.roles !== undefined) { // 验证返回的roles是否是一个非空
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('error:联系工作人员')
                    }
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 第三方验证登录
        // LoginByThirdparty({ commit, state }, code) {
        //   return new Promise((resolve, reject) => {
        //     commit('SET_CODE', code)
        //     loginByThirdparty(state.status, state.email, state.code).then(response => {
        //       commit('SET_TOKEN', response.data.token)
        //       setToken(response.data.token)
        //       resolve()
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                LoginOutLocalHost(state.token).then((res) => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', '')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles({commit, dispatch}, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                getUserInfoLocalHost(role).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.roles)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
                    resolve()
                })
            })
        }
    }
}

export default user
