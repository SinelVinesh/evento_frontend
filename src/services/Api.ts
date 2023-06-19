// @ts-ignore

import axios from "axios";
import {AuthRequest, MaterialFilter} from "../common/appTypes";

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
const materialUrl = `${base}/material`
export const findAllMaterial = (filter?: MaterialFilter) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(materialUrl, filter, filters)
  return getCall(url, true)
}
