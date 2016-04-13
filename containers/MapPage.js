import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { newCoordinates, loadLocation, showInfoWindow, hideInfoWindow } from '../actions'
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

  handleCloseInfoWindow() {
    this.props.hideInfoWindow()
  }


  loadData(props) {
    this.props.newCoordinates(props.lat, props.lng)
    this.props.loadLocation(props.lat, props.lng)
  }

  componentWillMount() {
    // sole.log('containers/MapPage componentWillMount')
    // loadData(this.props)
    // sole.log(this.props)
    this.loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat !== this.props.lat || nextProps.lng !== this.props.lng) {
      this.loadData(nextProps)
    }
  }

/*
  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.props.login) {
      loadData(nextProps)
    }
  }

  handleLoadMoreClick() {
    this.props.loadStarred(this.props.login, true)
  }

  renderRepo([ repo, owner ]) {
    return (
      <Repo repo={repo}
            owner={owner}
            key={repo.fullName} />
    )
  }

  render() {
    const { user, login } = this.props
    if (!user) {
      return <h1><i>Loading {login}’s profile...</i></h1>
    }

    const { starredRepos, starredRepoOwners, starredPagination } = this.props
    return (
      <div>
        <User user={user} />
        <hr />
        <List renderItem={this.renderRepo}
              items={zip(starredRepos, starredRepoOwners)}
              onLoadMoreClick={this.handleLoadMoreClick}
              loadingLabel={`Loading ${login}’s starred...`}
              {...starredPagination} />
      </div>
    )
  }

  */

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

    const {country, locality, areaLevel1, areaLevel2, areaLevel3} = currentLocationObject

    return (
      <div>
        {locality && <div>{locality}</div>}
        {areaLevel1 && <div>{areaLevel1}</div>}
        {areaLevel2 && <div>{areaLevel2}</div>}
        {areaLevel3 && <div>{areaLevel3}</div>}
        {country && <div>{country}</div>}
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
              defaultZoom={3}
              center={ { lat: this.props.lat, lng: this.props.lng } }
              ref="map">
              <Marker position={{lat: this.props.lat, lng: this.props.lng}} onClick={this.handleMarkerClick.bind(this)}>
                {this.renderInfoWindow()}
              </Marker>

            </GoogleMap>
          }
        />

      </section>
    )
  }

}



MapPage.propTypes = {

  lat: PropTypes.number,
  lng: PropTypes.number,
  coordinates: PropTypes.object,
  coordinatesString: PropTypes.string,
  newCoordinates: PropTypes.func.isRequired,
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
  //const { currentLocation, coordinates } = state
  const { coordinatesString } = ownProps.params
  // sole.log('coordinatesString')
  // sole.log(coordinatesString)
  const coordinatesArray = coordinatesString.split(',')
  const lat = Number(coordinatesArray[0])
  const lng = Number(coordinatesArray[1])

  return {
    coordinatesString,
    coordinates: state.coordinates,
    lat,
    lng,
    currentLocationObject: state.currentLocationObject,
    infoWindow: state.infoWindow
  }
}

export default connect(mapStateToProps, { loadLocation, newCoordinates, showInfoWindow, hideInfoWindow
})(MapPage)

/*

import React, { Component } from 'react';



export default class SimpleMap extends Component {





}








*/
