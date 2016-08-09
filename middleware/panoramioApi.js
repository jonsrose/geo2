import { Schema, normalize, arrayOf } from 'normalizr'
import { camelizeKeys } from 'humps'
import fetchJsonp from 'fetch-jsonp'

const panoramioPhotoSchema = new Schema('panoramioPhotos')
const panoramioPhotoCoordinatesSchema = new Schema('panoramioPhotoCoordinates', { idAttribute: 'coordinatesString' })


panoramioPhotoCoordinatesSchema.define({
  panoramioPhotos: arrayOf(panoramioPhotoSchema)
})

export const PanoramioSchemas = {
  PANORAMIO_PHOTO_COORDINATES: panoramioPhotoCoordinatesSchema
}

function callPanoramioApi(endpoint, schema, info) {
  return fetchJsonp(endpoint)
  .then(response => {
    return response.json()
    .then(json => {
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json)
    }
    let camelizedJson = null

    if (json.photos.photo.length == 0) {
      return Promise.reject(json)
    }

    const panoramioPhotos = json.photos.photo

    camelizedJson = camelizeKeys(panoramioPhotos)

    const coordinatesObject= {}
    coordinatesObject.coordinatesString = info.coordinatesString
    coordinatesObject.panoramioPhotos = camelizedJson

    return Object.assign({},
      normalize(coordinatesObject, schema)
    )
  })
}

export const CALL_PANORAMIO_API = Symbol('Call Panoramio API')

export default store => next => action => {
  const callApi = action[CALL_PANORAMIO_API]
  if (typeof callApi === 'undefined') {
    return next(action)
  }

  let { endpoint } = callApi
  const { schema, types } = callApi

  let info
  if (callApi.info) {
    info = callApi.info
  }

  // sole.log('info')
  // sole.log(info)

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_PANORAMIO_API]
    return finalAction
  }

  const [ requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callPanoramioApi(endpoint, schema, info).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
