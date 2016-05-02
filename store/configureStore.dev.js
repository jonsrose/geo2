import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import googleApi from '../middleware/googleApi'
import wikipediaApi from '../middleware/wikipediaApi'
import flickrApi from '../middleware/flickrApi'
import rootReducer from '../reducers'
// import DevTools from '../containers/DevTools'

export default function configureStore(initialState) {
  // sole.log(`/store/configureStoreDev/configureStore:`)
  // sole.log(initialState)
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      //applyMiddleware(thunk, api, createLogger())
      applyMiddleware(thunk, googleApi, wikipediaApi, flickrApi, createLogger())
      // DevTools.instrument()
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
