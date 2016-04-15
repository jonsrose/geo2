import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
  // sole.log('/reducers/index.js entities() state: action: ')
  // sole.log(state)
  // sole.log(action)
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  // sole.log('/reducers/index.js errorMessage: ')
  // sole.log(state)
  // sole.log(action)
  // const { type, error } = action

  return null

  /*
  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
  */
}

function coordinates(state = null, action) {
  const { type } = action
  if (type === ActionTypes.NEW_COORDINATES) {
    return action.coordinates
  }

  return state
}

function coordinatesString(state = null, action) {
  const { type } = action
  if (type === ActionTypes.NEW_COORDINATES) {
    return action.response.entities.coordinates[action.response.result].coordinatesString
  }

  return state
}

function navToCoordinatesString(state = null, action) {
  const { type, coordinatesString } = action
  if (type === ActionTypes.NAV_TO_COORDINATES) {
    return coordinatesString
  }

  return state
}

function locationForCoordinates(state = {}, action) {
  const { type } = action

  if (type === ActionTypes.LOCATION_SUCCESS) {
    return merge({}, state, {[action.response.coordinatesString]: action.response.result})
  }

  return state
}

function sideNav(state = true, action) {
  const { type } = action
  if (type === ActionTypes.TOGGLE_SIDE_NAV) {
    return !state
  }
  return state
}

function infoWindow(state = true, action) {
  const { type } = action
  if (type === ActionTypes.HIDE_INFO_WINDOW ) {
    return false
  } else if (type === ActionTypes.SHOW_INFO_WINDOW || type === ActionTypes.NEW_COORDINATES) {
    return true
  }
  return state
}

export function getCurrentLocation(state) {
  var coordinatesString = state.coordinatesString

  var location = state.locationForCoordinates[coordinatesString]
  //console.log(`getCurrentLocation ${location}`)
  return (location)
}

export function getCurrentLocationObject(state) {
  var location = getCurrentLocation(state)

  if (!location) {
    return null
  }

  var locationObject = state.entities.locations[location]
  //console.log(`getCurrentLocationObject ${locationObject}`)
  return (locationObject)
}

export function getCountry(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.country
}

export function getCountryObject(state) {
  var country = getCountry(state)

  if (!country || !state.entities.countries) {
    return null
  }

  return state.entities.countries[country]
}

export function getCountryText(state) {
  var countryObject = getCountryObject(state)

  if (!countryObject) {
    return null
  }

  return countryObject.extract
}

const rootReducer = combineReducers({
  entities,
  errorMessage,
  routing,
  coordinates,
  sideNav,
  infoWindow,
  coordinatesString,
  locationForCoordinates,
  navToCoordinatesString
})



export default rootReducer
