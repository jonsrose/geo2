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

console.log ('/index.js after configureStore()')

const history = syncHistoryWithStore(browserHistory, store)

console.log ('/index.js after syncHistoryWithStore()')

console.log ('/index.js store: ${JSON.stringify(store)} history:')
console.log(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
