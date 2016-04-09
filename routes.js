import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import UserPage from './containers/UserPage'
import RepoPage from './containers/RepoPage'
import MapPage from './containers/MapPage'

export default (
  <Route path="/" component={App}>
    <Route path="/locations/:name"
           component={MapPage} />
    <Route path="/:login/:name"
           component={RepoPage} />
    <Route path="/:login"
           component={UserPage} />
  </Route>
)
