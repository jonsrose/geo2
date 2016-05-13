import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, setSideNavVisibility } from '../actions'
import { loadWikiLocation, loadLocality } from '../actions/wikipediaActions'
import { loadFlickrPhotos } from '../actions/flickrActions'
import { loadFlickrPhoto } from '../actions'
import {getCurrentLocation, getCurrentLocationObject, getCountryObject, getAreaLevel1Object, getLocalityObject} from '../reducers'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'



const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDismissClick =
     this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    e.preventDefault()
  }

  handleChange(nextValue) {
    browserHistory.push(`/${nextValue}`)
  }

  navigateToMap(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navToCoordinatesString && nextProps.navToCoordinatesString !== this.props.navToCoordinatesString) {
      this.navigateToMap(nextProps.navToCoordinatesString)
    }

    this.loadData(nextProps)

    if (nextProps.coordinatesString && nextProps.coordinatesString !== this.props.coordinatesString) {
      this.props.loadWikiLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
      this.props.loadFlickrPhotos(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }

    if (nextProps.navTolocality && nextProps.navTolocality !== this.props.navTolocality) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/localityInfo/${nextProps.navTolocality}`)
    }

    if (nextProps.navToFlickrPhoto && nextProps.navToFlickrPhoto !== this.props.navToFlickrPhoto) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/flickrPhoto/${nextProps.navToFlickrPhoto}`)
    }
  }

  loadData(props) {
    if (props.coordinatesStringParam && (!props.coordinatesString || props.coordinatesStringParam != props.coordinatesString)){
      this.props.newCoordinatesString(props.coordinatesStringParam)
    }

    if (props.localityParam && (!props.locality || props.localityParam != props.locality)) {
      this.props.loadLocality(props.localityParam)
    }

    if (props.flickrPhotoIdParam && (!props.flickrPhotoId || props.flickrPhotoIdParam != props.flickrPhotoId)) {
      console.log(`loadFlickrPhoto ${props.flickrPhotoIdParam} ${props.flickrPhotoId}`)
      this.props.loadFlickrPhoto(props.flickrPhotoIdParam)
    }
  }

  componentWillMount() {
    this.loadData(this.props)
  }

  getTitle() {
    let title

    if (this.props.coordinates) {
      if (this.props.currentLocationObject) {
          title = `${this.props.currentLocationObject.formattedAddress} - Coords: `
      } else {
        title = 'Coords: '
      }
      title += `${this.props.coordinates.lat}, ${this.props.coordinates.lng}`
    } else {
      title = 'Get Random Location'
    }

    return title
  }

  renderPaper() {
    return (
      <Paper zDepth={1} style={{position:'fixed', top: 64, left:0, right:0, height:44, zIndex: 1101, width:'inherit', fontSize:18, lineHeight:'44px', textAlign: 'center' }}>
        {this.getTitle()}
      </Paper>
    )
  }

  setSideNavVisibility(open) {

      this.props.setSideNavVisibility(open)
  }

  render() {
    const { leftChildren, rightChildren } = this.props
    var sideNavVisibility = this.props.sideNav
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Drawer overlayStyle={{opacity:0.25}} onRequestChange={(open) => this.setSideNavVisibility(open)} docked={false} open={sideNavVisibility}>
            {leftChildren}
          </Drawer>
          <AppBar title={<span>GEOJUMP <span style={{fontSize:10}}>(beta)</span></span>} onLeftIconButtonTouchTap={this.setSideNavVisibility.bind(this, true)} iconElementRight={<RaisedButton label="Jump" onTouchTap={this.props.randomCoordinates.bind(this)} secondary={true} style={{marginTop:6, marginRight:6}} />}>
          </AppBar>
          <div style={{
              position: 'absolute',
              top:0,
              marginTop:64,
              bottom:0,
              width:'100%',
              backgroundColor:'rgb(0, 188, 212)'
            }}
          >
            {rightChildren}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

function getPageFromPath(path){
  if (path.indexOf('countryInfo') > -1) {
    return 'country'
  } else if (path.indexOf('areaLevel1Info') > -1) {
    return 'areaLevel1'
  } else if (path.indexOf('locality') > -1) {
    return 'locality'
  }

  if (path.indexOf('coordinates') > -1) {
    return 'map'
  }

  return 'home'
}

App.propTypes = {
  randomCoordinates: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  currentLocationObject: PropTypes.object,
  countryObject: PropTypes.object,
  coordinates: PropTypes.object,
  appBarTitle: PropTypes.string,
  appBarLeft: PropTypes.number,
  coordinatesString: PropTypes.string,
  coordinatesStringParam: PropTypes.string,
  localityParam: PropTypes.string,
  flickrPhotoIdParam: PropTypes.string,
  page: PropTypes.string,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,
  locality: PropTypes.string,
  setSideNavVisibility: PropTypes.func
}



function mapStateToProps(state, ownProps) {
  return {
    coordinates: state.coordinates,
    inputValue: ownProps.location.pathname.substring(1),
    currentLocation: getCurrentLocation(state),
    currentLocationObject: getCurrentLocationObject(state),
    countryObject: getCountryObject(state),
    areaLevel1Object: getAreaLevel1Object(state),
    localityObject: getLocalityObject(state),
    appBarTitle: state.appBarTitle,
    sideNav: state.sideNav,
    appBarLeft: state.sideNav? 256 : 0,
    coordinatesString: state.coordinatesString,
    coordinatesStringParam: ownProps.params.coordinatesString,
    navToCoordinatesString: state.navToCoordinatesString,
    page: getPageFromPath(ownProps.location.pathname),
    locality: state.locality,
    localityParam: ownProps.params.locality,
    flickrPhotoIdParam: ownProps.params.flickrPhotoId,
    flickrPhotoId: state.flickrPhotoId,
    navTolocality: state.navTolocality,
    navToFlickrPhoto: state.navToFlickrPhoto
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, loadLocality, loadFlickrPhoto, loadWikiLocation,loadFlickrPhotos, newCoordinatesString, setSideNavVisibility
})(App)
