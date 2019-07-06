import requests from '@/utils/mockRequest.js'

export function GetOrderListData(page, size) {

  return requests({
    url: "/buy/order_list_data",
    method: 'get',
    params: {
      page: page,
      size: size
    }
  })
}

export function GetQueryIdOrder(data) {
  return requests({
    url: "/buy/order_detail_list_data",
    method: "post",
    params: {
      order_id: data
    }
  })
}

export function saveOrder(data) {
  return requests({
    url: "/buy/queryInventoryList",
    method: 'post',
    data
  })
}

export function queryInventoryList() {
  return requests({
    url: "/buy/queryInventoryList",
    method: 'post',
  })
}

export function TableAffirm(id,person) {
  return requests({
    url: "/buy/audit_order",
    method: 'get',
    params:{
      order_id:id,
      audit_person:person
    }
  })
}

export function AOGAffirm(data) {
  return requests({
    url: "/buy/in_confirm",
    method: 'post',
    data
  })
}

export function GetPurchaseList() {

}

