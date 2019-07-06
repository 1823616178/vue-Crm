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
    url: "/login/addRole",
    method: 'post',
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

export function addRolelocalHost(data1, role) {
  const val = {
    data1, role
  };
  return request({
    url: '/login/addRolelocalHost',
    method: "post",
    data: val
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

export function GetDepartData(da1, da2) {
  const val = {
    section: da1,
    sedata: da2
  }
  return request({
    url: '/role/GetDepartData',
    method: "post",
    data: val
  })
}

export function GetSectionChildren(data) {
  return request({
    url: "/role/GetSectionChildren",
    method: "post",
    data
  })
}

export function DeleteSectionData(data) {
  return request({
    url: "/role/DeleteSectionData",
    method: "post",
    data: data
  })
}

export function addNewPeople(da1, da2) {
  const val = {
    section: da1,
    other: da2
  };
  return request({
    url: "/role/addNewPeople",
    method: "post",
    data: val
  })
}

export function UpGroupPeople(data) {
  return request({
    url: '/role/updateGroupData',
    method: "post",
    data
  })
}

export function AddRoleLocalTrue(data1, data2) {
  var da = {
    data1,
    data2
  };
  return request({
    url: '/login/AddRoleLocalTrue',
    method: "post",
    data:da
  })
}

