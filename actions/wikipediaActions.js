import { CALL_WIKIPEDIA_API, WikipediaSchemas } from '../middleware/wikipediaApi'
import { COUNTRY_REQUEST, COUNTRY_SUCCESS, COUNTRY_FAILURE, AREA_LEVEL_1_REQUEST, AREA_LEVEL_1_SUCCESS, AREA_LEVEL_1_FAILURE, LOCALITY_REQUEST, LOCALITY_SUCCESS, LOCALITY_FAILURE, WIKI_LOCATION_REQUEST, WIKI_LOCATION_SUCCESS, WIKI_LOCATION_FAILURE } from './ActionTypes'

function fetchCountry(country) {
  // sole.log(`/actions/index fetchCountry ${country}`)
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ COUNTRY_REQUEST, COUNTRY_SUCCESS, COUNTRY_FAILURE ],
      endpoint: `http://localhost:3000/api/wikipedia?action=query&prop=extracts&format=json&exintro=&titles=${country}`,
      schema: WikipediaSchemas.COUNTRY
    }
  }
}

export function loadCountry(country) {
  return (dispatch) => {
    return dispatch(fetchCountry(country))
  }
}

function fetchAreaLevel1(areaLevel1) {
  // sole.log(`/actions/index fetchAreaLevel1 ${areaLevel1}`)
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ AREA_LEVEL_1_REQUEST, AREA_LEVEL_1_SUCCESS, AREA_LEVEL_1_FAILURE ],
      endpoint: `http://localhost:3000/api/wikipedia?action=query&prop=extracts&format=json&exintro=&titles=${areaLevel1}`,
      schema: WikipediaSchemas.AREA_LEVEL_1
    }
  }
}

export function loadAreaLevel1(areaLevel1) {
  return (dispatch) => {
    return dispatch(fetchAreaLevel1(areaLevel1))
  }
}

function fetchLocality(locality) {
  // sole.log(`/actions/index fetchLocality ${locality}`)
  // // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro=&explaintext=&titles=antarctica&piprop=thumbnail&pithumbsize=400
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ LOCALITY_REQUEST, LOCALITY_SUCCESS, LOCALITY_FAILURE ],
      endpoint: `http://localhost:3000/api/wikipedia?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${locality}&piprop=thumbnail&pithumbsize=380`,
      schema: WikipediaSchemas.LOCALITY
    }
  }
}

export function loadLocality(locality) {
  return (dispatch) => {
    return dispatch(fetchLocality(locality))
  }
}

function fetchWikiLocation(lat,lng) {
  // sole.log(`/actions/index fetchWikiLocation ${wikiLocation}`)
  const coordinatesString =  `${lat},${lng}`
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ WIKI_LOCATION_REQUEST, WIKI_LOCATION_SUCCESS, WIKI_LOCATION_FAILURE ],
      endpoint:
      `http://localhost:3000/api/wikipedia?action=query&prop=coordinates%7Cpageimages%7Cpageterms&colimit=50&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=10000&ggslimit=50&format=json`,
      schema: WikipediaSchemas.WIKI_LOCATION_COORDINATES,
      info: {coordinatesString}
    }
  }
}

export function loadWikiLocation(lat,lng) {
  return (dispatch) => {
    return dispatch(fetchWikiLocation(lat,lng))
  }
}
