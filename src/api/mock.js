import request from '@/utils/mockRequest'

export function getFormulaList() {
  return request({
    url: '/formulaList',
    method: 'get'
  })
}

export function getOrderList() {
  return request({
    url: '/orderList',
    method: 'get'
  })
}

export function queryFormulaList(query) {
  return request({
    url: '/queryFormulaList',
    method: 'get',
    params: query
  })
}

export function querySaleOrder(query) {
  return request({
    url: '/querySaleOrder',
    method: 'get',
    params: query
  })
}
