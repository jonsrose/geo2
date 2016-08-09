import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import wikipediaApi from '../middleware/wikipediaApi'
import flickrApi from '../middleware/flickrApi'
import panoramioApi from '../middleware/panoramioApi'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, wikipediaApi, flickrApi, panoramioApi, createLogger())
    )
  )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
