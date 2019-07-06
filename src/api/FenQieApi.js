import request from '@/utils/request'

export function GetFenQieList(data) {
  return request({
    url: "/product/getFenQieListData",
    method: "post",
    data
  })
}

export function FenQieListFormData(data) {
  return request({
    url: "/product/FenQieListFormData",
    method: "post",
    data
  })
}

export function isCompleteSync(data) {
  return request({
    url: '/product/isCompleteSync',
    method: 'post',
    data
  })
}
