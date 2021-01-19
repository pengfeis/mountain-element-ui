import request from '@/utils/request'

export function addIncomeAndExpend(data) {
  return request({
    method: 'post',
    url: '/acct/addIncomeAndExpend',
    data
  })
}

export function getIncomeAndExpendList(data) {
  return request({
    method: 'post',
    url: '/acct/getIncomeAndExpendList',
    data
  })
}

export function getTypeList(data) {
  return request({
    method: 'post',
    url: '/acct/getTypeList',
    data
  })
}

