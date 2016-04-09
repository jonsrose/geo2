import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import paginate from './paginate'
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

// from stack overflow, lookup random coordinates
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function coordinates(state = null, action) {
  console.log('/reducers/index.js coordinates: ')
  console.log(state)
  console.log(action)
  const { type } = action

  if (type === ActionTypes.RANDOM_COORDINATES) {
    let lat = getRandomInRange(-90, 90, 3)
    let lng = getRandomInRange(-180, 180, 3)
    return {lat, lng}
  }

  return state
}

function currentLocation(state = null, action) {
  const { type } = action
  if (type === ActionTypes.LOCATION_SUCCESS) {
    if (action.response && action.response.entities) {
      return action.response.result
    }
  }

  return state
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
  starredByUser: paginate({
    mapActionToKey: action => action.login,
    types: [
      ActionTypes.STARRED_REQUEST,
      ActionTypes.STARRED_SUCCESS,
      ActionTypes.STARRED_FAILURE
    ]
  }),
  stargazersByRepo: paginate({
    mapActionToKey: action => action.fullName,
    types: [
      ActionTypes.STARGAZERS_REQUEST,
      ActionTypes.STARGAZERS_SUCCESS,
      ActionTypes.STARGAZERS_FAILURE
    ]
  })
})



console.log('pagination')
console.log(pagination)

const rootReducer = combineReducers({
  entities,
  pagination,
  errorMessage,
  routing,
  coordinates,
  currentLocation
})

export default rootReducer
