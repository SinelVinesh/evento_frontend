// @ts-ignore

import axios from "axios";
import {
  AuthRequest,
  Location,
  Material,
  MaterialFilter,
  Paginated,
  RatedExpense,
  RatedExpenseType
} from "../common/appTypes";

/* api calls */
// Generic
export const getCall = (url: string, auth = false) => {
  let config = {}
  if (auth) {
    config = {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}}
  }
  return axios
    .get(url, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const deleteCall = (url: string, auth = false) => {
  let config = {}
  if (auth) {
    config = {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}}
  }
  return axios
    .delete(url, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const postCall = (url: string, data: any, auth = false) => {
  let config = {}
  if (auth) {
    config = {headers: {Authorization: 'Bearer ' + sessionStorage.getItem('token')}}
  }
  return axios
    .post(url, data, config)
    .then((res) => (Math.floor(res.status / 100) === 2 ? res : Promise.reject(res)))
    .then((res) => res.data)
}

export const putCall = (url: string, data: any, auth = false) => {
  let config = {}
  if (auth) {
    config = {headers: {Authorization: 'Bearer ' + sessionStorage.getItem('token')}}
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
  if (data === undefined) {
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

// Material
const materialUrl = `${base}/materials`
export const findAllMaterial = (filter?: MaterialFilter) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(materialUrl, filter, filters)
  return getCall(url, true)
}
export const createMaterial = (data?: Material) => {
  return postCall(materialUrl, data, true)
}

// Location type
const locationTypeUrl = `${base}/location-types`
export const findAllLocationType = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(locationTypeUrl, filter, filters)
  return getCall(url, true)
}

export const createLocationType = (data?: Material) => {
  return postCall(locationTypeUrl, data, true)
}

// Location
const locationUrl = `${base}/locations`
export const findAllLocation = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(locationUrl, filter, filters)
  return getCall(url, true)
}

export const createLocation = (data?: Location) => {
  return postCall(locationUrl, data, true)
}


// Rated expense type
const ratedExpenseTypeUrl = `${base}/rated-expense-types`
export const findAllRatedExpenseType = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(ratedExpenseTypeUrl, filter, filters)
  return getCall(url, true)
}
export const createRatedExpenseType = (data?: RatedExpenseType) => {
  return postCall(ratedExpenseTypeUrl, data, true)
}

// Rate type
const rateTypeUrl = `${base}/rate-types`
export const findAllRateType = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(rateTypeUrl, filter, filters)
  return getCall(url, true)
}

// Rated expense
const ratedExpenseUrl = `${base}/rated-expenses`
export const findAllRatedExpense = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(ratedExpenseUrl, filter, filters)
  return getCall(url, true)
}

export const createRatedExpense = (data?: RatedExpense) => {
  return postCall(ratedExpenseUrl, data, true)
}

// Variable expense
const variableExpenseUrl = `${base}/expense-types`

export const findAllVariableExpense = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(variableExpenseUrl, filter, filters)
  return getCall(url, true)
}

export const createVariableExpense = (data?: RatedExpense) => {
  return postCall(variableExpenseUrl, data, true)
}
