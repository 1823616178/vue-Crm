import request from '@/utils/request'

export function fetchListS (query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
