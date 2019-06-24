import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

/*
模拟数据
*/

export function deleteRoleslocalHost(data) {
  return request({
    url: '/RRoute/delerole',
    method: "post",
    data
  })
}

export function getRoutesTest() {
  return request({
    url: '/login/getRole',
    method: 'get'
  })
}

export function GetRoleRUle(data) {
  data = {
    data
  };
  return request({
    url: '/login/pageRule',
    method: 'post',
    data
  })
}
export function addRole(data) {
  return request({
    url:"/login/addRole",
    method:'post',
    data
  })
}


export function getEditor(roles) {
  const data = {
    user: roles
  }
  return request({
    url: '/login/editorrouter',
    method: 'post',
    data
  })
}

export function addNewRole(data) {
  return request({
    url: '/login/newRole',
    method: "post",
    data
  })
}

export function addRolelocalHost(data) {
  return request({
    url: '/login/newRole',
    method: "post",
    data
  })
}

export function upDataRoleLocalHost(data) {
  return request({
    url: "login/updata",
    method: "post",
    data
  })
}

export function GetUserInfogroup() {
  return request({
    url: "login/getgroupinfo",
    method: "get",
  })
}

export function getUserPeopleInfo(id) {
  const data = {
    data: id
  }
  return request({
    url: 'login/getPeopleInfo',
    method: "post",
    data
  })
}

export function UpUserEditorRole(data) {
  return request({
    url: "login/UpUserEditorRole",
    method: 'post',
    data
  })
}
