import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import UserPage from './containers/UserPage'
import RepoPage from './containers/RepoPage'
import MapPage from './containers/MapPage'
import CountryPage from './containers/CountryPage'
import AreaLevel1Page from './containers/AreaLevel1Page'

export default (
  <Route path="/" component={App}>
    <Route path="/coordinates/:coordinatesString/areaLevel1Info"
           component={AreaLevel1Page} />
    <Route path="/coordinates/:coordinatesString/countryInfo"
           component={CountryPage} />
    <Route path="/coordinates/:coordinatesString"
           component={MapPage} />
    <Route path="/:login/:name"
           component={RepoPage} />
    <Route path="/:login"
           component={UserPage} />
  </Route>
)
