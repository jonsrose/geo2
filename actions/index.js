import { CALL_GOOGLE_API, GoogleSchemas } from '../middleware/googleApi'
import { CALL_WIKIPEDIA_API, WikipediaSchemas } from '../middleware/wikipediaApi'

//https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJg
export const GOOGLE_API_SERVER_KEY='AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJ6g'

export const LOCATION_REQUEST = 'LOCATION_REQUEST'
export const LOCATION_SUCCESS = 'LOCATION_SUCCESS'
export const LOCATION_FAILURE = 'LOCATION_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchLocation(coordinatesString) {
  // sole.log(`/actions/index fetchLocation ${lat}, ${lng}`)
  return {
    [CALL_GOOGLE_API]: {
      types: [ LOCATION_REQUEST, LOCATION_SUCCESS, LOCATION_FAILURE ],
      endpoint: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinatesString}&key=${GOOGLE_API_SERVER_KEY}`,
      schema: GoogleSchemas.LOCATION,
      info: {coordinatesString}
    }
  }
}


//?action=query&format=json&list=geosearch&gsradius=10000&gscoord=37.786971|-122.399677



// Fetches a single location from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadLocation(coordinatesString) {
  // sole.log(`/actions/index loadLocation ${lat}, ${lng}`)
  //return (dispatch, getState) => {
  return (dispatch) => {
    /*
    const location = getState().entities.locations[login]
    if (location && requiredFields.every(key => location.hasOwnProperty(key))) {
      // sole.log(`actions/index about to return null`)
      react-routern null
    }
    */

    return dispatch(fetchLocation(coordinatesString))
  }
}

export const COUNTRY_REQUEST = 'COUNTRY_REQUEST'
export const COUNTRY_SUCCESS = 'COUNTRY_SUCCESS'
export const COUNTRY_FAILURE = 'COUNTRY_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
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

// Fetches a single location from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadCountry(country) {
  // sole.log(`/actions/index loadCountry ${country}`)
  //return (dispatch, getState) => {
  return (dispatch) => {
    /*
    const location = getState().entities.locations[login]
    if (location && requiredFields.every(key => location.hasOwnProperty(key))) {
      // sole.log(`actions/index about to return null`)
      react-routern null
    }
    */

    return dispatch(fetchCountry(country))
  }
}



function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}


// Fetches a single location from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadRandomLocation() {

  // let lat = getRandomInRange(-90, 90, 3)
  // let lng = getRandomInRange(-180, 180, 3)
  let lat = 72.24
  let lng = 86.337
  // sole.log(`/actions/index loadLocation ${lat}, ${lng}`)
  return (dispatch) => {
    /*
    const location = getState().entities.locations[login]
    if (location && requiredFields.every(key => location.hasOwnProperty(key))) {
      // sole.log(`actions/index about to return null`)
      react-routern null
    }
    */

    return dispatch(fetchLocation(lat,lng))
  }
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
