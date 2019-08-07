import {asyncRoutes, constantRoutes} from '@/router'
import {getRoutesTest, getEditor} from '@/api/role.js'
import role from '../../mock/role';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  let arr = [];
  for (let i in roles) {
    arr.push(roles[i])
  }
  // if (route.meta && route.meta.roles) {
  //   return arr.some(role => route.meta.roles.includes(role))
  //   // return true
  // } else {
  //   return true
  // }
  return true;
}

const data = {}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // routes.forEach(route => {
  //   const tmp = {...route}
  //   if (hasPermission(roles, tmp)) {
  //     if (tmp.children) {
  //       tmp.children = filterAsyncRoutes(tmp.children, roles)
  //     }
  //     res.push(tmp)
  //   }
  for (let i in routes) {
    const tmp = {...routes[i]}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  }
  return res
}

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
          const {roles} = data;
          var accessedRoutes;
          if (roles.includes('admin')) {
            accessedRoutes = asyncRoutes;
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes)
          } else {
            getEditor(roles).then((res) => {
                if (res) {
                  var Routers = res.data;
                  accessedRoutes = filterAsyncRoutes(Routers, roles);
                  for (let i in asyncRoutes) {
                    for (let j in accessedRoutes) {
                      if (accessedRoutes[j].path === asyncRoutes[i].path) {
                        accessedRoutes[j] = asyncRoutes[i];
                        // accessedRoutes[j].children = asyncRoutes[i].children
                        // for (let o in asyncRoutes[i].children) {
                        //   for (let u in accessedRoutes[j].children) {
                        //     if (accessedRoutes[j].children[u].path === asyncRoutes[i].children[o].path) {
                        //       accessedRoutes[j].children[u].component = asyncRoutes[i].children[o].component
                        //     }
                        //   }
                        // }
                      }
                    }
                  }
                  // var arr = []
                  // for (let i in res.data) {
                  //   arr.push(res.data[i])
                  // }
                  // let Routers = arr
                  // accessedRoutes = filterAsyncRoutes(Routers, roles)
                  commit('SET_ROUTES', accessedRoutes);
                  resolve(accessedRoutes)
                }
              }
            )
            // commit('SET_ROUTES', accessedRoutes)
            // resolve(accessedRoutes)
          }
        }
      )
    }
  }
}

export default permission
