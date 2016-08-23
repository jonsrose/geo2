import { Schema, normalize, arrayOf } from 'normalizr'
import { camelizeKeys } from 'humps'
import fetchJsonp from 'fetch-jsonp'

const panoramioPhotoSchema = new Schema('panoramioPhotos', { idAttribute: 'photoId' })
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
      console.log('json',json)
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    console.log('response',response)
    if (!response.ok) {
      return Promise.reject(json)
    }
    let camelizedJson = null

    if (json.photos.length == 0) {
      return Promise.reject(json)
    }

    const panoramioPhotos = json.photos

    console.log('panoramioPhotos',panoramioPhotos)

    camelizedJson = camelizeKeys(panoramioPhotos)

    console.log('camelizedJson',camelizedJson)

    const coordinatesObject= {}
    coordinatesObject.coordinatesString = info.coordinatesString
    coordinatesObject.panoramioPhotos = camelizedJson

    const result = Object.assign({},
      normalize(coordinatesObject, schema)
    )

    console.log('resulty', result)

    return result
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
    response => {
      console.log('response2',response)
      return next(actionWith({
      response,
      type: successType
    }))},
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
