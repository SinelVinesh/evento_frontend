// @ts-ignore

import axios from "axios";
import {
  AuthRequest,
  Event,
  EventType,
  Location,
  Material,
  MaterialFilter,
  Paginated,
  RatedExpense,
  RatedExpenseFilter,
  RatedExpenseType,
  User,
  UserFilter
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
export const filesUrl = `${base}/files`
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

export const getLocationType = (id: string) => {
  return getCall(`${locationTypeUrl}/${id}`, true)
}

export const createLocationType = (data?: Location) => {
  return postCall(locationTypeUrl, data, true)
}

export const updateLocationType = (data?: Location) => {
  const url = `${locationTypeUrl}/${data?.id}`
  return putCall(url, data, true)
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

export const getLocation = (id: string) => {
  return getCall(`${locationUrl}/${id}`, true)
}

export const createLocation = (data?: Location) => {
  return postCall(locationUrl, data, true)
}

export const updateLocation = (data?: Location) => {
  const url = `${locationUrl}/${data?.id}`
  return putCall(url, data, true)
}

// File upload
const fileUploadUrl = `${base}/files`
export const uploadFile = (data: FormData) => {
  return postCall(fileUploadUrl, data, true)
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
export const getRatedExpenseType = (id: string) => {
  return getCall(`${ratedExpenseTypeUrl}/${id}`, true)
}
export const createRatedExpenseType = (data?: RatedExpenseType) => {
  return postCall(ratedExpenseTypeUrl, data, true)
}
export const updateRatedExpenseType = (data?: RatedExpenseType) => {
  const url = `${ratedExpenseTypeUrl}/${data?.id}`
  return putCall(url, data, true)
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
export const findAllRatedExpense = (filter?: RatedExpenseFilter) => {
  const filters = [
    {field: 'page', name: 'page'},
    {field: 'ratedExpenseType', name: 'ratedExpenseType.id'}
  ]
  let url = buildUrlWithFilter(ratedExpenseUrl, filter, filters)
  return getCall(url, true)
}

export const findAllOtherRatedExpense = (filter?: RatedExpenseFilter) => {
  filter = {...filter, ratedExpenseType: 1}
  const filters = [
    {field: 'page', name: 'page'},
    {field: 'ratedExpenseType', name: 'noteq_ratedExpenseType.id'}
  ]
  let url = buildUrlWithFilter(ratedExpenseUrl, filter, filters)
  return getCall(url, true)
}

export const findAllArtists = (filter?: RatedExpenseFilter) => {
  filter = {...filter, ratedExpenseType: 1}
  const filters = [
    {field: 'page', name: 'page'},
    {field: 'ratedExpenseType', name: 'ratedExpenseType.id'}
  ]
  let url = buildUrlWithFilter(ratedExpenseUrl, filter, filters)
  return getCall(url, true)
}

export const getRatedExpense = (id: string) => {
  return getCall(`${ratedExpenseUrl}/${id}`, true)
}

export const updateRatedExpense = (data?: RatedExpense) => {
  const url = `${ratedExpenseUrl}/${data?.id}`
  return putCall(url, data, true)
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

// Event type
const eventTypeUrl = `${base}/event-types`
export const findAllEventType = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(eventTypeUrl, filter, filters)
  return getCall(url, true)
}

export const createEventType = (data?: EventType) => {
  return postCall(eventTypeUrl, data, true)
}

// Event estimation
const eventEstimationUrl = `${base}/event-estimations`

export const findAllEventEstimation = (filter?: Paginated) => {
  const filters = [
    {field: 'page', name: 'page'}
  ]
  let url = buildUrlWithFilter(eventEstimationUrl, filter, filters)
  return getCall(url, true)
}

// Event
const eventUrl = `${base}/events`
export const createEvent = (data?: Event) => {
  return postCall(eventUrl, data, true)
}

export const getEvent = (id: number) => {
  return getCall(`${eventUrl}/${id}`, true)
}

export const updateEvent = (data?: Event) => {
  const url = `${eventUrl}/${data?.id}`
  return putCall(url, data, true)
}

// Users
const userUrl = `${base}/user`
export const findAllUser = (filter?: UserFilter) => {
  const filters = [
    {field: 'page', name: 'page'},
    {field: 'role', name: 'role.id'}
  ]
  filter = {...filter, role: 2}
  let url = buildUrlWithFilter(userUrl, filter, filters)
  return getCall(url, true)
}
export const createUser = (data?: User) => {
  return postCall(userUrl, data, true)
}

export const getUser = (id: string) => {
  return getCall(`${userUrl}/${id}`, true)
}

export const updateUser = (data?: User) => {
  const url = `${userUrl}/${data?.id}`
  return putCall(url, data, true)
}
