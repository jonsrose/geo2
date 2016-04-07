import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router } from 'react-router'

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    console.log(`/containers/Root.dev.js Root.render() store=`)
    console.log(store)
    return (
      <Provider store={store}>
        <div>
          {console.log(`/containers/Root.dev.js Root.render() inside provider store=`)}
          {console.log(store)}
          <Router history={history} routes={routes} />
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
