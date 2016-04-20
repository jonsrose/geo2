import { CALL_GOOGLE_API, GoogleSchemas } from '../middleware/googleApi'
import { CALL_WIKIPEDIA_API, WikipediaSchemas } from '../middleware/wikipediaApi'

//https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJg
export const GOOGLE_API_SERVER_KEY='AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJ6g'

export const LOCATION_REQUEST = 'LOCATION_REQUEST'
export const LOCATION_SUCCESS = 'LOCATION_SUCCESS'
export const LOCATION_FAILURE = 'LOCATION_FAILURE'

function fetchLocation(coordinatesString) {
  return {
    [CALL_GOOGLE_API]: {
      types: [ LOCATION_REQUEST, LOCATION_SUCCESS, LOCATION_FAILURE ],
      endpoint: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinatesString}&key=${GOOGLE_API_SERVER_KEY}`,
      schema: GoogleSchemas.LOCATION,
      info: {coordinatesString}
    }
  }
}

export function loadLocation(coordinatesString) {

  return (dispatch) => {
    return dispatch(fetchLocation(coordinatesString))
  }
}

export const COUNTRY_REQUEST = 'COUNTRY_REQUEST'
export const COUNTRY_SUCCESS = 'COUNTRY_SUCCESS'
export const COUNTRY_FAILURE = 'COUNTRY_FAILURE'

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

export const WIKI_LOCATION_REQUEST = 'WIKI_LOCATION_REQUEST'
export const WIKI_LOCATION_SUCCESS = 'WIKI_LOCATION_SUCCESS'
export const WIKI_LOCATION_FAILURE = 'WIKI_LOCATION_FAILURE'

function fetchWikiLocation(lat,lng) {
  // sole.log(`/actions/index fetchWikiLocation ${wikiLocation}`)
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ WIKI_LOCATION_REQUEST, WIKI_LOCATION_SUCCESS, WIKI_LOCATION_FAILURE ],
      endpoint: `http://localhost:3000/api/wikipedia?action=query&format=json&list=geosearch&gsradius=10000&gscoord=${lat}|${lng}`,
      schema: WikipediaSchemas.WIKI_LOCATION
    }
  }
}

export function loadWikiLocation(wikiLocation) {
  return (dispatch) => {
    return dispatch(fetchWikiLocation(wikiLocation))
  }
}



function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}


export const NEW_COORDINATES = 'NEW_COORDINATES'

export function randomCoordinates() {
  // sole.log('/actions/index randomCoordinates')
  let lat = getRandomInRange(-90, 90, 3)
  let lng = getRandomInRange(-180, 180, 3)
  let coordinatesString = `${lat},${lng}`

  return navToCoordinatesString(coordinatesString)
}

function getCoordinatesFromCoordinatesString(coordinatesString) {
  const coordinatesArray = coordinatesString.split(',')
  const lat = Number(coordinatesArray[0])
  const lng = Number(coordinatesArray[1])
  return {lat, lng}
}

export function newCoordinatesString(coordinatesString) {
  const {lat, lng} = getCoordinatesFromCoordinatesString(coordinatesString)
  return newCoordinates(lat,lng)
}

export const NAV_TO_COORDINATES = 'NAV_TO_COORDINATES'

export function navToCoordinatesString(coordinatesString) {
  return {
    type: NAV_TO_COORDINATES,
    coordinatesString
  }
}

export function newCoordinates(lat, lng) {
  let coordinatesString = `${lat},${lng}`

  const coordinates = {}
  coordinates[coordinatesString] = {
    lat,
    lng,
    coordinatesString
  }

  return {
    type: NEW_COORDINATES,
    response: {
        entities: {
          coordinates
        },
        result: coordinatesString
    },
    coordinates: {lat, lng}
  }
}

export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV'

export function toggleSideNav() {
  return {
    type: TOGGLE_SIDE_NAV
  }
}

export const SHOW_INFO_WINDOW = 'SHOW_INFO_WINDOW'

export function showInfoWindow() {
  return {
    type: SHOW_INFO_WINDOW
  }
}

export const HIDE_INFO_WINDOW = 'HIDE_INFO_WINDOW'

export function hideInfoWindow() {
  return {
    type: HIDE_INFO_WINDOW
  }
}
