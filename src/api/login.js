import request from '@/utils/request'

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}


export function logout () {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/*
模拟数据
*/


export function loginByusernameLocalHost (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/locallogin',
    method: 'post',
    data
  })
}

export function getUserInfoLocalHostdev (token) {
  const data = {
    token:token
  }
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}

// export function getUserInfoLocalHost (token) {
//   const data = {
//     token
//   }
//   return request({
//     url: '/user/info',
//     method: "post",
//     data
//   })
// }

export function LoginOutLocalHost () {
  return request({
    url: "/login/loginout",
    method: "get"
  })
}
