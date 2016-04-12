import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
  console.log('/reducers/index.js entities() state: action: ')
  console.log(state)
  console.log(action)
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  console.log('/reducers/index.js errorMessage: ')
  console.log(state)
  console.log(action)
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
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

function currentLocation(state = null, action) {
  const { type } = action
  if (type === ActionTypes.LOCATION_SUCCESS) {
    if (action.response) {
      return action.response.result
    }
  } else if (type === ActionTypes.LOCATION_REQUEST) {
      return null
  } else if (type === ActionTypes.LOCATION_FAILURE) {
      return null
  }

  return state
}

function currentLocationObject(state = null, action) {
  const { type } = action
  if (type === ActionTypes.LOCATION_SUCCESS) {
    if (action.response) {
      let locationName = action.response.result

      return action.response.entities.locations[locationName]
    }
  } else if (type === ActionTypes.LOCATION_REQUEST) {
      return null
  } else if (type === ActionTypes.LOCATION_FAILURE) {
      return null
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

const rootReducer = combineReducers({
  entities,
  errorMessage,
  routing,
  coordinates,
  currentLocation,
  currentLocationObject,
  sideNav
})

export default rootReducer
