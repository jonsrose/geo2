import { Schema, normalize, arrayOf } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was

//const flickrPhotoSchema = new Schema('flickrPhotos', {
//  idAttribute: 'title'
//})

const flickrPhotoSchema = new Schema('flickrPhotos')
const flickrPhotoCoordinatesSchema = new Schema('flickrPhotoCoordinates', { idAttribute: 'coordinatesString' })


flickrPhotoCoordinatesSchema.define({
  flickrPhotos: arrayOf(flickrPhotoSchema)
})

// Schemas for Github API responses.
export const FlickrSchemas = {
  FLICKR_PHOTO_COORDINATES: flickrPhotoCoordinatesSchema
}

function callFlickrApi(endpoint, schema, info) {
  return fetch(endpoint)
  .then(response => {
    // sole.log('Im in the first response bro')
    // sole.log(response)
    return response.json()
    .then(json => {
      // sole.log('Im in the 2nd response bro')
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    // sole.log('Im in the 3rd response bro')
    if (!response.ok) {
      return Promise.reject(json)
    }



    // sole.log('wikiwikiwiki')

    let camelizedJson = null

    if (json.photos.photo.length == 0) {
      return Promise.reject(json)
    }

    const flickrPhotos = json.photos.photo

    camelizedJson = camelizeKeys(flickrPhotos)

    const coordinatesObject= {}
    coordinatesObject.coordinatesString = info.coordinatesString
    coordinatesObject.flickrPhotos = camelizedJson

    //console.log(`coordinatesString ${coordinatesString}`)

    return Object.assign({},
      normalize(coordinatesObject, schema)
    )


  })
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr




// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_FLICKR_API = Symbol('Call Flickr API')

// A Redux middleware that interprets actions with CALL_FLICKR_API info specified.
// Performs the call and promises when such actions are dispatched.
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
