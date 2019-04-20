import request from '@/utils/mockRequest'

export function getFormulaList() {
  return request({
    url: '/getFormulaList',
    method: 'post'
  })
}
export function getOneFormula(query) {
  return request({
    url: '/getOneFormula',
    method: 'post',
    data: query
  })
}

export function getSaleOrderList() {
  return request({
    url: '/getSaleOrderList',
    method: 'post'
  })
}

export function querySaleOrderDetail(query) {
  return request({
    url: '/querySaleOrderDetail',
    method: 'post',
    data: query,
  })
}

export function querySaleOrder(query) {
  return request({
    url: '/querySaleOrder',
    method: 'post',
    data: query,
  })
}

export function deleteSaleOrder(query) {
  return request({
    url: '/deleteSaleOrder',
    method: 'post',
    data: query,
  })
}

export function updateFormula(query) {
  return request({
    url: '/updateFormula',
    method: 'post',
    data: query,
  })
}