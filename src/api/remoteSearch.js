import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function LimitPageSellOrderData(data) {
  return request({
    url: '/Dynamic/LimitPageSellOrderData',
    method: 'post',
    data
  })
}
