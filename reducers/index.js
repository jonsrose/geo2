import * as ActionTypes from '../actions/ActionTypes'
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

function wikiLocationsForCoordinates(state = {}, action) {
  const { type } = action

  if (type === ActionTypes.WIKI_LOCATION_SUCCESS) {
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
  //// sole.log(`getCurrentLocation ${location}`)
  return (location)
}

export function getCurrentLocationObject(state) {
  var location = getCurrentLocation(state)

  if (!location) {
    return null
  }

  var locationObject = state.entities.locations[location]
  //// sole.log(`getCurrentLocationObject ${locationObject}`)
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

export function getAreaLevel1(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.areaLevel1
}

export function getAreaLevel1Object(state) {
  var areaLevel1 = getAreaLevel1(state)

  if (!areaLevel1 || !state.entities.areaLevel1s) {
    return null
  }

  return state.entities.areaLevel1s[areaLevel1]
}

export function getAreaLevel1Text(state) {
  var areaLevel1Object = getAreaLevel1Object(state)

  if (!areaLevel1Object) {
    return null
  }

  return areaLevel1Object.extract
}

export function getLocality(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.locality
}

export function getLocalityObject(state) {
  var locality = getLocality(state)

  if (!locality || !state.entities.localities) {
    return null
  }

  return state.entities.localities[locality]
}

export function getLocalityText(state) {
  var localityObject = getLocalityObject(state)

  if (!localityObject) {
    return null
  }

  return localityObject.extract
}

const rootReducer = combineReducers({
  entities,
  routing,
  coordinates,
  sideNav,
  infoWindow,
  coordinatesString,
  locationForCoordinates,
  wikiLocationsForCoordinates,
  navToCoordinatesString
})



export default rootReducer
