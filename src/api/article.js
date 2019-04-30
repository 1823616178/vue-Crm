import request from '@/utils/request'
import production from '../router/modules/production'


export function fetchListS () {
  return request({
    url: '/content/getContentList',
    method: 'get'
  })
}

export function fetchArticle (id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv (pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle (data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle (data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function getIndexData () {
  return request({
    url: '/article/indexData',
    method: 'get'
    // params: { model }
  })
}

export function getIndexpiedata () {
  return request({
    url: '/article/piedata',
    method: 'get'
  })
}

export function defalutList () {
  return request({
    url: '/article/defalutList',
    method: 'get'
  })
}

export function contts () {
  return request({
    url: '/article/contts',
    method: 'get'
  })
}

export function IndexArr () {
  return request({
    url: '/article/arrfuse',
    method: 'get'
  })
}

export function gaveContent (data) {
  return request({
    url: '/content/getcontent',
    method: 'post',
    data
  })
}

export function productionList (data) {
  return request({
    url: '/production/getListData',
    method: 'post',
    data
  })
}

export function fetPeopleList (data) {
  return request({
    url: "/jurisdiction/gavePeopleList",
    method: "post",
    data
  })
}


/**
 * 模拟数据
 */

export function updataListlocalHost (data) {
  return request({
    url: '/production/lyUpList',
    method: "post",
    data
  })
}

export function GetLiuYanList (data) {
  return request({
    url: '/production/getliuyanList',
    method: 'post',
    data
  })
}

export function GetTreeList () {
  return request({
    url: '/article/production/getTreeList',
    method: 'get'
  })
}

export function updateArticlelocalHost (data) {
  return request({
    url: '/production/getUpdataArtic',
    method: 'post',
    data
  })
}

export function createArticlelocalHost (data) {
  return request({
    url: '/production/getCreateArtic',
    method: 'post',
    data
  })
}