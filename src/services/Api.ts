// @ts-ignore

import axios from "axios";
import {
  AmountBounds,
  AmountBoundsFilter,
  AuthRequest,
  Client,
  ClientFilter,
  InterestRate,
  InterestRateFilter,
  LoanDuration,
  LoanDurationFilter, LoanRefundPlan,
  LoanRequest,
  LoanRequestFilter, MonthlyProfitFilter, MonthlyRefundFilter,
  RefillRequest,
  RefillRequestFilter
} from "../common/appTypes";

/* api calls */
// Generic
export const getCall = (url: string, auth = false) => {
  let config = {}
  if (auth) {
    config = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
  }
  return axios
    .get(url, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const deleteCall = (url: string, auth = false) => {
  let config = {}
  if (auth) {
    config = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
  }
  return axios
    .delete(url, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const postCall = (url: string, data: any, auth = false) => {
  let config = {}
  if (auth) {
    config = { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') } }
  }
  return axios
    .post(url, data, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const putCall = (url: string, data: any, auth = false) => {
  let config = {}
  if (auth) {
    config = { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') } }
  }
  return axios
    .put(url, data, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

interface DataFilter {
  field: string
  name: string
}
const buildUrlWithFilter = (url: string, data: any, filters: DataFilter[]) => {
  if(data === undefined) {
    return url
  }
  let sep = '?'
  filters.forEach((filter) => {
    if (data[filter.field] !== undefined) {
      url += sep + filter.name + '=' + data[filter.field]
      sep = '&'
    }
  })
  return url
}

const base = 'http://localhost:8080'

// Login
const loginUrl = `${base}/user/authenticate`
export const login = (data: AuthRequest) => {
  return postCall(loginUrl, data)
}

// Settings
const settingsUrl = `${base}/settings`
// Setting - amount bounds
const amountBoundsUrl = `${settingsUrl}/amount-bounds`
export const createAmountBounds = (data: AmountBounds) => {
  data.minAmount = 0
  return postCall(amountBoundsUrl, data, true)
}

export const findAllAmountBounds = (data?: AmountBoundsFilter) => {
  const filters = [
    { field: 'page', name: 'page' },
  ]
  let url = buildUrlWithFilter(amountBoundsUrl, data, filters)
  return getCall(url, true)
}

// Setting - loan duration
const loandurationUrl = `${settingsUrl}/loan-durations`
export const createLoanDuration = (data: LoanDuration) => {
  return postCall(loandurationUrl, data, true)
}

export const findAllLoanDuration = (data?: LoanDurationFilter) => {
  const filters = [
    { field: 'page', name: 'page' }
  ]
  let url = buildUrlWithFilter(loandurationUrl, data, filters)
  return getCall(url, true)
}

// Setting - Interest rate
const interestRateUrl = `${settingsUrl}/interest-rates`

export const createInterestRate = (data: InterestRate) => {
  data.rate = data.rate! / 100
  return postCall(interestRateUrl, data, true)
}

export const findAllInterestRate = (data?: InterestRateFilter) => {
  const filters =[
    { field: 'page', name: 'page' },
  ]
  let url = buildUrlWithFilter(interestRateUrl, data, filters)
  return getCall(url, true)
}

// Client
const userUrl = `${base}/user`
const clientsUrl = `${base}/clients`
export const createClient = (data: Client) => {
  data.role = {id: 2}
  return postCall(userUrl, data, true)
}

export const findAllClient = (data?: ClientFilter) => {
  const filters = [
    { field: 'page', name: 'page' },
    { field: 'role', name: 'role.id' },
  ]
  if(data) {
    data.role = 2;
  }
  let url = buildUrlWithFilter(clientsUrl, data, filters)
  return getCall(url, true)
}

const refillRequestUrl = `${base}/refill-requests`
export const createRefillRequest = (data: RefillRequest) => {
  const json = sessionStorage.getItem('userId')
  if(json) {
    data.user = {id: JSON.parse(json)}
  }
  return postCall(refillRequestUrl, data, true)
}

export const updateRefillRequest = (id: number, data: RefillRequest) => {
  return putCall(`${refillRequestUrl}/${id}`, data, true)
}

export const findAllRefillRequest = (data?: RefillRequestFilter) => {
  const filters = [
    { field: 'page', name: 'page' },
    { field: 'user', name: 'user.id' },
  ]
  if(data) {
    const roleJson = sessionStorage.getItem('role')
    if(roleJson && roleJson === '2') {
      const idJson = sessionStorage.getItem('userId')
      if(idJson) {
        data.user = JSON.parse(idJson)
      }
    }
  }
  let url = buildUrlWithFilter(refillRequestUrl, data, filters)
  return getCall(url, true)
}

// loan request
const loanRequestUrl = `${base}/loan-requests`
export const createLoanRequest = (data: LoanRequest) => {
  const json = sessionStorage.getItem('userId')
  if(json) {
    data.user = {id: JSON.parse(json)}
  }
  return postCall(loanRequestUrl, data, true)
}

export const updateLoanRequest = (id: number, data: LoanRequest) => {
  return putCall(`${loanRequestUrl}/${id}`, data, true)
}

export const findAllLoanRequest = (data?: LoanRequestFilter) => {
  const filters = [
    { field: 'page', name: 'page' },
    { field: 'user', name: 'user.id' },
  ]
  if(data) {
    const roleJson = sessionStorage.getItem('role')
    let role = {} as LoanRequest
    if(roleJson != null) {
      role = JSON.parse(roleJson)
    }
    if(role && role.id === 2) {
      const id = sessionStorage.getItem('userId')
      if(id) {
        data.user = Number.parseInt(id)
      }
    }
  }
  let url = buildUrlWithFilter(loanRequestUrl, data, filters)
  return getCall(url, true)
}

export const findLoanRequest = (id: number) => {
  return getCall(`${loanRequestUrl}/${id}`, true)
}

export const findClient = (id: number) => {
  return getCall(`${clientsUrl}/${id}`, true)
}

export const findCurrentClient = () => {
  const json = sessionStorage.getItem('userId')
  if(json) {
    return getCall(`${clientsUrl}/${JSON.parse(json)}`, true)
  }
  return Promise.reject()
}


// loan refund
export const loandrefundUrl = `${base}/loan-refunds`

export const updateLoanRefund = (id: number, data: LoanRefundPlan) => {
  return putCall(`${loandrefundUrl}/${id}`, data, true)
}

// refund summary
const refundSummaryUrl = `${base}/monthly-refunds`

export const findAllRefundSummary = (data?: MonthlyRefundFilter) => {
  const filters = [
    { field: 'page', name: 'page'},
    { field: 'minYear', name: 'mineq_year'},
    { field: 'maxYear', name: 'maxeq_year'},
    { field: 'minMonth', name: 'mineq_month'},
    { field: 'maxMonth', name: 'maxeq_month'},
  ]
  let url = buildUrlWithFilter(refundSummaryUrl, data, filters)
  return getCall(url, true)
}

export const findAllRefundSummaryPdf = (data?: MonthlyRefundFilter) => {
  const filters = [
    { field: 'minYear', name: 'mineq_year'},
    { field: 'maxYear', name: 'maxeq_year'},
    { field: 'minMonth', name: 'mineq_month'},
    { field: 'maxMonth', name: 'maxeq_month'},
  ]
  let url = buildUrlWithFilter(refundSummaryUrl, data, filters)
  return getCall(url, true)
}

// monthly profit
const monthlyProfitUrl = `${base}/monthly-profits`

export const findAllMonthlyProfit = (data?: MonthlyProfitFilter) => {
  const filters = [
    { field: 'page', name: 'page'},
    { field: 'minYear', name: 'mineq_year'},
    { field: 'maxYear', name: 'maxeq_year'},
    { field: 'minMonth', name: 'mineq_month'},
    { field: 'maxMonth', name: 'maxeq_month'},
  ]
  let url = buildUrlWithFilter(monthlyProfitUrl, data, filters)
  return getCall(url, true)
}
