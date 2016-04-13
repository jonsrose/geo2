import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const store = configureStore()

// sole.log ('/index.js after configureStore()')

const history = syncHistoryWithStore(browserHistory, store)

// sole.log ('/index.js after syncHistoryWithStore()')

// sole.log ('/index.js store: ${JSON.stringify(store)} history:')
// sole.log(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
