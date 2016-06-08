import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'

export default (
  <Route path="/" component={App}>
    <IndexRoute />
    <Route path="/coordinates/:coordinatesString" />
    <Route path="/coordinates/:coordinatesString/placeDetail/localityInfo/:locality"  />
    <Route path="/coordinates/:coordinatesString/placeDetail/flickrPhoto/:index-:flickrPhotoId" />
  </Route>
)
