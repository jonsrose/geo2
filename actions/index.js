import { CALL_API, Schemas } from '../middleware/api'


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
    [CALL_API]: {
      types: [ LOCATION_REQUEST, LOCATION_SUCCESS, LOCATION_FAILURE ],
      endpoint: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinatesString}&key=${GOOGLE_API_SERVER_KEY}`,
      schema: Schemas.LOCATION,
      info: {coordinatesString}
    }
  }
}

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
    [CALL_API]: {
      types: [ COUNTRY_REQUEST, COUNTRY_SUCCESS, COUNTRY_FAILURE ],
      endpoint: `http://localhost:3000/api/wikipedia?action=query&prop=extracts&format=json&exintro=&titles=${country}`,
      schema: Schemas.COUNTRY
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


export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchUser(login) {
  // sole.log(`/actions/index fetchUser ${login}`)
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${login}`,
      schema: Schemas.USER
    }
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(login, requiredFields = []) {
  // sole.log(`/actions/index loadUser ${login} requiredFields `)
  // sole.log(requiredFields)
  return (dispatch, getState) => {
    const user = getState().entities.users[login]
    if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
      // sole.log('actions/index about to return null')
      return null
    }

    return dispatch(fetchUser(login))
  }
}

export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
export const REPO_FAILURE = 'REPO_FAILURE'

// Fetches a single repository from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchRepo(fullName) {
  // sole.log(`/actions/index fetchRepo ${fullName}`)
  return {
    [CALL_API]: {
      types: [ REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE ],
      endpoint: `repos/${fullName}`,
      schema: Schemas.REPO
    }
  }
}

// Fetches a single repository from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadRepo(fullName, requiredFields = []) {
  // sole.log(`/actions/index loadRepo ${fullName} requiredFields`)
  // sole.log(requiredFields)
  return (dispatch, getState) => {
    const repo = getState().entities.repos[fullName]
    if (repo && requiredFields.every(key => repo.hasOwnProperty(key))) {
      return null
    }

    return dispatch(fetchRepo(fullName))
  }
}

export const STARRED_REQUEST = 'STARRED_REQUEST'
export const STARRED_SUCCESS = 'STARRED_SUCCESS'
export const STARRED_FAILURE = 'STARRED_FAILURE'

// Fetches a page of starred repos by a particular user.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchStarred(login, nextPageUrl) {
  // sole.log(`/actions/index fetchStarred ${login} ${nextPageUrl}`)
  return {
    login,
    [CALL_API]: {
      types: [ STARRED_REQUEST, STARRED_SUCCESS, STARRED_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.REPO_ARRAY
    }
  }
}

// Fetches a page of starred repos by a particular user.
// Bails out if page is cached and user didn’t specifically request next page.
// Relies on Redux Thunk middleware.
export function loadStarred(login, nextPage) {
  // sole.log(`/actions/index loadStarred ${login} ${nextPage}`)
  return (dispatch, getState) => {
    const {
      nextPageUrl = `users/${login}/starred`,
      pageCount = 0
    } = getState().pagination.starredByUser[login] || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchStarred(login, nextPageUrl))
  }
}

export const STARGAZERS_REQUEST = 'STARGAZERS_REQUEST'
export const STARGAZERS_SUCCESS = 'STARGAZERS_SUCCESS'
export const STARGAZERS_FAILURE = 'STARGAZERS_FAILURE'

// Fetches a page of stargazers for a particular repo.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchStargazers(fullName, nextPageUrl) {
  // sole.log(`/actions/index fetchStargazers ${fullName} ${nextPageUrl}`)
  return {
    fullName,
    [CALL_API]: {
      types: [ STARGAZERS_REQUEST, STARGAZERS_SUCCESS, STARGAZERS_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.USER_ARRAY
    }
  }
}

// Fetches a page of stargazers for a particular repo.
// Bails out if page is cached and user didn’t specifically request next page.
// Relies on Redux Thunk middleware.
export function loadStargazers(fullName, nextPage) {
  // sole.log(`/actions/index loadStargazers ${fullName} ${nextPage}`)
  return (dispatch, getState) => {
    const {
      nextPageUrl = `repos/${fullName}/stargazers`,
      pageCount = 0
    } = getState().pagination.stargazersByRepo[fullName] || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchStargazers(fullName, nextPageUrl))
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  // sole.log('/actions/index resetErrorMessage')
  return {
    type: RESET_ERROR_MESSAGE
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
