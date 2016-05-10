import { Schema, normalize, arrayOf } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

const flickrPhotoSchema = new Schema('flickrPhotos')
const flickrPhotoCoordinatesSchema = new Schema('flickrPhotoCoordinates', { idAttribute: 'coordinatesString' })


flickrPhotoCoordinatesSchema.define({
  flickrPhotos: arrayOf(flickrPhotoSchema)
})

export const FlickrSchemas = {
  FLICKR_PHOTO_COORDINATES: flickrPhotoCoordinatesSchema
}

function callFlickrApi(endpoint, schema, info) {
  return fetch(endpoint)
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

    const flickrPhotos = json.photos.photo

    camelizedJson = camelizeKeys(flickrPhotos)

    const coordinatesObject= {}
    coordinatesObject.coordinatesString = info.coordinatesString
    coordinatesObject.flickrPhotos = camelizedJson

    return Object.assign({},
      normalize(coordinatesObject, schema)
    )
  })
}

export const CALL_FLICKR_API = Symbol('Call Flickr API')

export default store => next => action => {
  const callApi = action[CALL_FLICKR_API]
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
    delete finalAction[CALL_FLICKR_API]
    return finalAction
  }

  const [ requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callFlickrApi(endpoint, schema, info).then(
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
