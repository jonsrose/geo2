import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import MapPage from './containers/MapPage'
import CountryPage from './containers/CountryPage'
import AreaLevel1Page from './containers/AreaLevel1Page'
import LocalityPage from './containers/LocalityPage'
import LeftNavMain from './containers/LeftNavMain'

export default (
  <Route path="/" component={App}>
    <IndexRoute components={{leftChildren: LeftNavMain, rightChildren: null}}/>
    <Route path="/coordinates/:coordinatesString"
         components={{leftChildren: LeftNavMain, rightChildren: MapPage}}/>
    <Route path="/coordinates/:coordinatesString/localityInfo"
         components={{leftChildren: LocalityPage, rightChildren: MapPage}}/>
    <Route path="/coordinates/:coordinatesString/areaLevel1Info"
        components={{leftChildren: AreaLevel1Page, rightChildren: MapPage}}/>
    <Route path="/coordinates/:coordinatesString/countryInfo"
        components={{leftChildren: CountryPage, rightChildren: MapPage}}/>
  </Route>
)
