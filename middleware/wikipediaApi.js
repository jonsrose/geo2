import { Schema, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was

function callWikipediaApi(endpoint, schema) {
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

    let firstKey

    for (var property in  json.query.pages) {
        if (json.query.pages.hasOwnProperty(property)) {
          firstKey = property
          break
        }
    }

    const page = json.query.pages[firstKey]



    // sole.log('schema')
    // sole.log(schema)

    // sole.log('page')
    // sole.log(page)
    const camelizedJson = camelizeKeys(page)
    const normalized = normalize(camelizedJson, schema)
    // sole.log('normalized')
    // sole.log(normalized)


    return Object.assign({},
      normalized
    )
  })
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr


function makeSlugForCountrySchema(countrySchema) {
  return makeSlugForString(countrySchema.title)
}

function makeSlugForString(formattedAddress) {
  return formattedAddress.toLowerCase().replace(/\,/g, '').replace(/ /g, '-')
}

const countrySchema = new Schema('countries', {
  idAttribute: makeSlugForCountrySchema
})

const wikiLocationSchema = new Schema('wikiLocations')

// Schemas for Github API responses.
export const WikipediaSchemas = {
  COUNTRY: countrySchema,
  WIKI_LOCATION: wikiLocationSchema
}

// Action key that carries API call info interpreted by this Redux middleware.
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
    delete finalAction[CALL_WIKIPEDIA_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callWikipediaApi(endpoint, schema).then(
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
