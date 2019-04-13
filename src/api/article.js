import request from '@/utils/request'
import production from '../router/modules/production'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function GetLiuYanList() {
  return request({
    url: '/production/getliuyanList',
    method: 'get'
  })
}

export function fetchListS() {
  return request({
    url: '/content/getContentList',
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
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
