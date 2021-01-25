import request from '@/utils/request'

export function findStoreList(data) {
  return request({
    url: '/store/findStoreList',
    method: 'post',
    data
  })
}
export function addStore(data) {
  return request({
    url: '/store/addStore',
    method: 'post',
    data
  })
}
export function editStore(data) {
  return request({
    url: '/store/editStore',
    method: 'post',
    data
  })
}
export function deleteStore(data) {
  return request({
    url: '/store/deleteStore',
    method: 'post',
    data
  })
}
