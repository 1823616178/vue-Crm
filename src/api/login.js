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

export function getUserInfoLocalHost (token) {
  return request({
    url: '/user/info',
    method: "get",
    params: { token }
  })
}

export function LoginOutLocalHost () {
  return request({
    url: "/user/loginout",
    method: "get"
  })
}
