import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { newCoordinatesString, showInfoWindow, hideInfoWindow } from '../actions'
import {getCurrentLocationObject, getWikiLocations} from '../reducers'
import { satelliteMap } from '../components/GoogleMapsHelper'
import { navTolocality } from '../actions'
// import { loadUser, loadStarred } from '../actions'
// import User from '../components/User'
// import Repo from '../components/Repo'
// import List from '../components/List'
// import zip from 'lodash/zip'

/*
function loadData(props) {
  // sole.log('loadData')
  const { login } = props
  props.loadUser(login, [ 'name' ])
  props.loadStarred(login)
}
*/

class MapPage extends Component {
  constructor(props) {
    // sole.log('containers/MapPage constructor props:')
    // sole.log(props)
    super(props)
    // this.renderRepo = this.renderRepo.bind(this)
    // this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this)
  }

  handleMarkerClick() {
    this.props.showInfoWindow()
  }

  handleWikiLocationMarkerClick(title) {
    this.props.navTolocality(title)
  }

  handleCloseInfoWindow() {
    this.props.hideInfoWindow()
  }

  renderCoordinates(coordinates) {
    return (
      <div>Coordinates: {coordinates.lat}, {coordinates.lng}</div>
    )
  }

  renderInfoWindowContent() {
    // sole.log('renderInfoWindowContent')

    const { coordinates, currentLocationObject } = this.props

    // sole.log(coordinates)
    // sole.log(currentLocationObject)

    if (!coordinates) {
      return null
    }

    if (!currentLocationObject ){
      return this.renderCoordinates(coordinates)
    }

    const {countryName, locality, areaLevel1, areaLevel2, areaLevel3} = currentLocationObject

    return (
      <div>
        {locality && <div>{locality}</div>}
        {areaLevel1 && <div>{areaLevel1}</div>}
        {areaLevel2 && <div>{areaLevel2}</div>}
        {areaLevel3 && <div>{areaLevel3}</div>}
        {countryName && <div>{countryName}</div>}
        {this.renderCoordinates(coordinates)}
      </div>
    )

  }

  renderInfoWindow(){
    if (!this.props.infoWindow) {
        return null
    }

    return (
      <InfoWindow key="info"
        onCloseclick={this.handleCloseInfoWindow.bind(this)}>
        {this.renderInfoWindowContent()}
      </InfoWindow>
    )
  }

  render() {
    // sole.log(`map page lat = ${this.props.lat} lng = ${this.props.lng}`)


    if (!this.props.coordinates) {
      return null
    }

    // sole.log(this.props.coordinates)
    const {lat, lng} = this.props.coordinates
    // sole.log('read lat lng')

    const markerTitle = `lat: ${lat}, lng: ${lng}`

    return (
      <section style={{ height: '100%' }}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: '100%'
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => console.log(map)}
              defaultZoom={8}
              center={ { lat, lng } }
              ref="map"
              mapTypeId = {satelliteMap}
              >
              {!this.props.wikiLocations && <Marker position={{lat, lng}} title={markerTitle}>
              </Marker>}
              {this.props.wikiLocations && this.props.wikiLocations.map((wikiLocation, index) => {
                return (
                  <Marker key={index}
                    position={{lat: wikiLocation.lat, lng: wikiLocation.lon}}
                    onClick={this.handleWikiLocationMarkerClick.bind(this, wikiLocation.title)}
                    title={wikiLocation.title}
                  />
                )
              })}
            </GoogleMap>
          }
        />
      </section>
    )
  }

}



MapPage.propTypes = {
  coordinates: PropTypes.object,
  coordinatesString: PropTypes.string,
  newCoordinatesString: PropTypes.func.isRequired,
  loadLocation: PropTypes.func.isRequired,
  currentLocationObject: PropTypes.object
}

/*
MapPage.propTypes = {
  login: PropTypes.string.isRequired,
  user: PropTypes.object,
  starredPagination: PropTypes.object,
  starredRepos: PropTypes.array.isRequired,
  starredRepoOwners: PropTypes.array.isRequired,
  loadUser: PropTypes.func.isRequired,
  loadStarred: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  const { login } = ownProps.params
  const {
    pagination: { starredByUser },
    entities: { users, repos }
  } = state

  const starredPagination = starredByUser[login] || { ids: [] }
  const starredRepos = starredPagination.ids.map(id => repos[id])
  const starredRepoOwners = starredRepos.map(repo => users[repo.owner])

  return {
    login,
    starredRepos,
    starredRepoOwners,
    starredPagination,
    user: users[login]
  }
}
*/

function mapStateToProps(state, ownProps) {
  //const coordinatesStringParam  = ownProps.params.coordinatesString
  // sole.log('coordinatesString')
  // sole.log(coordinatesString)

  //const coordinatesArray = coordinatesStringParam.split(',')
  //const lat = Number(coordinatesArray[0])
  //const lng = Number(coordinatesArray[1])

  return {
    coordinatesStringParam: ownProps.params.coordinatesString,
    coordinates: state.coordinates,
    coordinatesString: state.coordinatesString,
    currentLocationObject: getCurrentLocationObject(state),
    infoWindow: state.infoWindow,
    wikiLocations: getWikiLocations(state)
  }
}

export default connect(mapStateToProps, { navTolocality, newCoordinatesString, showInfoWindow, hideInfoWindow
})(MapPage)

/*

import React, { Component } from 'react';



export default class SimpleMap extends Component {





}








*/
