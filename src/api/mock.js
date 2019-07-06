import request from '@/utils/request'

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

export function getSaleOrderList(data) {
  return request({
    url: '/OrderInfo/info',
    method: 'post',
    data
  })
}
export function SearchSaleList(data) {
  return request({
    url: '/OrderInfo/SearchGetOrderInfo',
    method: 'post',
    data
  })
}
export function querySaleOrderDetail(query) {
  return request({
    url: '/OrderInfo/quertDetailInfo',
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
