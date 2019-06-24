import request from '@/utils/request'
import production from '../router/modules/production'


export function fetchListS(data) {
  return request({
    url: '/role/personRole',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: {id}
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: {pv}
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function getIndexData() {
  return request({
    url: '/article/indexData',
    method: 'get'
    // params: { model }
  })
}

export function getIndexpiedata() {
  return request({
    url: '/article/piedata',
    method: 'get'
  })
}

export function defalutList() {
  return request({
    url: '/article/defalutList',
    method: 'get'
  })
}

export function contts() {
  return request({
    url: '/article/contts',
    method: 'get'
  })
}

export function IndexArr() {
  return request({
    url: '/article/arrfuse',
    method: 'get'
  })
}

export function gaveContent(data) {
  return request({
    url: '/content/getcontent',
    method: 'post',
    data
  })
}

export function productionList(data) {
  return request({
    url: '/production/getListData',
    method: 'post',
    data
  })
}

export function fetPeopleList(data) {
  return request({
    url: '/role/personRole',
    method: 'post',
    data
  })
}

export function ProductClass() {
  return request({
    url: "/product/ProductClass",
    method: 'get',
  })
}

export function QueyProduct(data) {
  return request({
    url: "/product/QueyProduct",
    method: 'post',
    data
  })
}

export function getRecipeDetail(data) {
  return request({
    url: "/product/getRecipeDetail",
    method: "post",
    data
  })
}

export function DynamicOrder(data) {
  return request({
    url: "/Dynamic/SellOrder",
    method: "post",
    data
  })
}

export function QueryRepicList(data) {
  return request({
    url: "/product/QueryRepicList",
    method: 'post',
    data: data
  })
}

export function upRepicList(product, data, isDelete) {
  var query = {
    product,
    data,
    isDelete
  }
  return request({
    url: "/product/upRepicList",
    method: "post",
    data: query
  })
}

export function delateClick(data) {
  return request({
    url: "/product/delateClick",
    method: "post",
    data
  })
}

export function DeleteDetails(data) {
  return request({
    url: "/product/DeleteDetails",
    method: "post",
    data
  })
}

export function UpdataNewReciptDatas(data) {
  return request({
    url: "/product/UpdataNewReciptDatas",
    method: "post",
    data
  })
}

export function newProductDiageDetil(formList, DataList, newDiageAdd) {
  var data = {
    formList,
    DataList,
    newDiageAdd
  };
  return request({
    url: "/product/newProductDiageDetil",
    method: "post",
    data
  })
}

export function newDiageAdd(index, data, isDelete, productData, formulaList) {
  var reques = {
    index,
    data,
    isDelete,
    productData,
    formulaList
  }
  return request({
    url: "/product/newDiageAdd",
    method: "post",
    data: reques
  })
}


/**
 * 模拟数据
 */

export function updataListlocalHost(data) {
  return request({
    url: '/production/lyUpList',
    method: "post",
    data
  })
}

export function GetLiuYanList(data) {
  return request({
    url: '/production/getliuyanList',
    method: 'post',
    data
  })
}

export function GetTreeList() {
  return request({
    url: '/role/TeamGroup',
    method: 'get'
  })
}

export function updateArticlelocalHost(data) {
  return request({
    url: '/production/getUpdataArtic',
    method: 'post',
    data
  })
}

export function createArticlelocalHost(data) {
  return request({
    url: '/production/getCreateArtic',
    method: 'post',
    data
  })
}

export function GetComposeList(data) {
  return request({
    url: "/production/ComponseFromData",
    method: "post",
    data
  })
}
