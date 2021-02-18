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

export function getCategoryList(data) {
  return request({
    method: 'post',
    url: '/acct/getCategoryList',
    data
  })
}

export function getDailyPl(data) {
  return request({
    method: 'post',
    url: '/acct/getDailyProfitAndLost',
    data
  })
}

export function getPlByBizDate(data) {
  return request({
    method: 'post',
    url: '/acct/getProfitAndLostByBizDate',
    data
  })
}

export function deleteInAndEx(data) {
  return request({
    method: 'post',
    url: '/acct/deleteInAndEx',
    data
  })
}
