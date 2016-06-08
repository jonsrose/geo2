import { Schema, normalize, arrayOf } from 'normalizr'
import { camelizeKeys } from 'humps'
import fetchJsonp from 'fetch-jsonp'

const wikiLocationSchema = new Schema('wikiLocations', { idAttribute: 'title' })
const wikiLocationCoordinatesSchema = new Schema('wikiLocationCoordinates', { idAttribute: 'coordinatesString' })


wikiLocationCoordinatesSchema.define({
  wikiLocations: arrayOf(wikiLocationSchema)
})

const localitySchema = new Schema('localities', {
  idAttribute: 'title'
})

export const WikipediaSchemas = {
  WIKI_LOCATION_COORDINATES: wikiLocationCoordinatesSchema,
  LOCALITY: localitySchema
}

function callWikipediaApi(endpoint, schema, info) {
  return fetchJsonp(endpoint)
  .then(response => {
    return response.json()
    .then(json => {
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    // sole.log('Im in the 3rd response bro')
    if (!response.ok) {
      return Promise.reject(json)
    }

    if (endpoint.indexOf('geosearch') > -1) {
      let camelizedJson = null

      if (!json.query || !json.query.pages || json.query.pages.length == 0) {
        return Promise.reject(json)
      }

      const wikiLocations = Object.keys(json.query.pages).map(k => json.query.pages[k])

      camelizedJson = camelizeKeys(wikiLocations)

      const coordinatesObject= {}
      coordinatesObject.coordinatesString = info.coordinatesString
      coordinatesObject.wikiLocations = camelizedJson

      return Object.assign({},
        normalize(coordinatesObject, schema)
      )
    } else {
      let firstKey

      for (var property in  json.query.pages) {
          if (json.query.pages.hasOwnProperty(property)) {
            firstKey = property
            break
          }
      }

      const page = json.query.pages[firstKey]

      if (info && (info.index || info.index === 0)) {
        page.index = info.index
      }

      // console.log('yo wikipedia api page', page, 'info.index',info.index)      



      const camelizedJson = camelizeKeys(page)

      const normalized = normalize(camelizedJson, schema)

      return Object.assign({},
        normalized
      )
    }
  })
}

export const CALL_WIKIPEDIA_API = Symbol('Call Wikipedia API')

// A Redux middleware that interprets actions with CALL_WIKIPEDIA_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callApi = action[CALL_WIKIPEDIA_API]
  if (typeof callApi === 'undefined') {
    return next(action)
  }

  let { endpoint } = callApi
  const { schema, types } = callApi

  let info
  if (callApi.info) {
    info = callApi.info
  }

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
    delete finalAction[CALL_WIKIPEDIA_API]
    return finalAction
  }

  const [ requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callWikipediaApi(endpoint, schema, info).then(
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
