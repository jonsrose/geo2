import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'
import fetchJsonp from 'fetch-jsonp'

// Extracts the next page URL from Github API response.
function getNextPageUrl(response) {
  // sole.log('middleware/api getNextPageUrl')
  const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.

function callGoogleApi(endpoint, schema) {
  return fetch(endpoint)
  .then(response => {
    console.log('Im in the first response bro')
    console.log(response)
    return response.json()
    .then(json => {
      console.log('Im in the 2nd response bro')
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    console.log('Im in the 3rd response bro')
    if (!response.ok) {
      return Promise.reject(json)
    }

    console.log('googlygooglygoogly')
    if (json.status && json.status === 'ZERO_RESULTS') {
      // sole.log('failed')
      // sole.log(json)
      return Promise.reject(json)
    } else {
      // sole.log('nailed')
    }

    let firstResultJson = json.results[0]

    // sole.log('schema')
    // sole.log(schema)

    const camelizedJson = camelizeKeys(firstResultJson)
    const nextPageUrl = getNextPageUrl(response)

    var options = {
      assignEntity: function (obj, key, val) {
        if (key === 'addressComponents') {
          val.forEach(addressComponent => {
            if (addressComponent.types.indexOf('country') > -1) {
              obj.country = addressComponent.longName
            }
            if (addressComponent.types.indexOf('locality') > -1) {
              obj.locality = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality') > -1) {
              obj.sublocality = addressComponent.longName
            }
            if (addressComponent.types.indexOf('postalCode') > -1) {
              obj.postalCode = addressComponent.longName
            }
            if (addressComponent.types.indexOf('administrative_area_level_1') > -1) {
              obj.areaLevel1 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('administrative_area_level_2') > -1) {
              obj.areaLevel2 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('administrative_area_level_3') > -1) {
              obj.areaLevel3 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('administrative_area_level_4') > -1) {
              obj.areaLevel4 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('administrative_area_level_5') > -1) {
              obj.areaLevel5 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality_level_1') > -1) {
              obj.sublocalityLevel1 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality_level_2') > -1) {
              obj.sublocalityLevel2 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality_level_3') > -1) {
              obj.sublocalityLevel3 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality_level_4') > -1) {
              obj.sublocalityLevel4 = addressComponent.longName
            }
            if (addressComponent.types.indexOf('sublocality_level_5') > -1) {
              obj.sublocalityLevel5 = addressComponent.longName
            }
          })
        } else if (key === 'formattedAddress'){
          obj.id = makeSlugForString(val)
          obj[key] = val
        } else {
          obj[key] = val
        }
      }
    }

    return Object.assign({},
      normalize(camelizedJson, schema, options),
      { nextPageUrl }
    )
  })
}

function callWikipediaApi(endpoint, schema) {
  return fetch(endpoint)
  .then(response => {
    console.log('Im in the first response bro')
    console.log(response)
    return response.json()
    .then(json => {
      console.log('Im in the 2nd response bro')
      return { json, response }
    })
  }
  ).then(({ json, response }) => {
    console.log('Im in the 3rd response bro')
    if (!response.ok) {
      return Promise.reject(json)
    }


    console.log('wikiwikiwiki')

    let firstResultJson = json.parse

    // sole.log('schema')
    // sole.log(schema)

    const camelizedJson = camelizeKeys(firstResultJson)
    const nextPageUrl = getNextPageUrl(response)

    return Object.assign({},
      normalize(camelizedJson, schema),
      { nextPageUrl }
    )
  })
}




function callApi(endpoint, schema) {
    // sole.log(`middleware/api callApi endpoint: ${endpoint} schema:`)
    // sole.log(schema)

    if (endpoint.indexOf('wikipedia') > -1) {
      return callWikipediaApi(endpoint, schema)
    } else {
      return callGoogleApi(endpoint, schema)
    }
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const userSchema = new Schema('users', {
  idAttribute: 'login'
})

const repoSchema = new Schema('repos', {
  idAttribute: 'fullName'
})

repoSchema.define({
  owner: userSchema
})

function makeSlugForLocationSchema(locationSchema) {
  return makeSlugForString(locationSchema.formattedAddress)
}

function makeSlugForCountrySchema(countrySchema) {
  return makeSlugForString(countrySchema.title)
}

function makeSlugForString(formattedAddress) {
  return formattedAddress.toLowerCase().replace(/\,/g, '').replace(/ /g, '-')
}

const locationSchema = new Schema('locations', {
  idAttribute: makeSlugForLocationSchema
})

const countrySchema = new Schema('countries', {
  idAttribute: makeSlugForCountrySchema
})

/*
resultsSchema.define({
    address: arrayOf(addressSchema)
});

addressSchema.define({
    idAttribute: 'place_id'
    address_components: arrayOf(addressComponentSchema);
});
*/
// Schemas for Github API responses.
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  REPO: repoSchema,
  REPO_ARRAY: arrayOf(repoSchema),
  LOCATION: locationSchema,
  COUNTRY: countrySchema
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types } = callAPI

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
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    }))/*,
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))*/
  )
}
