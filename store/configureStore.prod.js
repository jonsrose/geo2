import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import googleApi from '../middleware/googleApi'
import wikipediaApi from '../middleware/wikipediaApi'
import rootReducer from '../reducers'
import flickrApi from '../middleware/flickrApi'

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, googleApi, wikipediaApi, flickrApi)
  )
}
