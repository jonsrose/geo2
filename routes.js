import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import MapPage from './containers/MapPage'
import CountryPage from './containers/CountryPage'
import AreaLevel1Page from './containers/AreaLevel1Page'
import LocalityPage from './containers/LocalityPage'
import LeftNavMain from './containers/LeftNavMain'
import PlaceDetail from './containers/PlaceDetail'
import FlickrPhotoPage from './containers/FlickrPhotoPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute components={{leftChildren: LeftNavMain, rightChildren: MapPage}}/>
    <Route path="/coordinates/:coordinatesString"
         components={{leftChildren: LeftNavMain, rightChildren: MapPage}}/>
    <Route path="/coordinates/:coordinatesString/placeDetail"
         components={{leftChildren: PlaceDetail, rightChildren: MapPage}}>
      <Route path="/coordinates/:coordinatesString/placeDetail/localityInfo/:locality"
          component={LocalityPage}/>
        <Route path="/coordinates/:coordinatesString/placeDetail/flickrPhoto/:flickrPhotoId"
        component={FlickrPhotoPage}/>
      <Route path="/coordinates/:coordinatesString/placeDetail/areaLevel1Info"
         component={AreaLevel1Page}/>
      <Route path="/coordinates/:coordinatesString/placeDetail/countryInfo"
         component={CountryPage}/>
    </Route>
  </Route>
)
