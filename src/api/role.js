import request from '@/utils/request'

export function getRoutes () {
  return request({
    url: '/routes',
    method: 'get'
  })
}

/*
模拟数据
*/

export function deleteRoleslocalHost (data) {
  return request({
    url: '/RRoute/delerole',
    method: "post",
    data
  })
}

export function getRoutesTest () {
  return request({
    url: '/RRoute/ssTEST',
    method: 'get'
  })
}

export function getEditor () {
  return request({
    url: '/RRoute/editorrouter',
    method: 'get'
  })
}

export function addRolelocalHost (data) {
  return request({
    url: '/RRoute/addRoles',
    method: "post",
    data
  })
}

export function upDataRoleLocalHost (data) {
  return request({
    url: "RRoute/updata",
    method: "post",
    data
  })
}