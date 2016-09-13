import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, setSideNavVisibility, zoom } from '../actions'
import { loadWikiLocation, loadLocality } from '../actions/wikipediaActions'
import { loadFlickrPhotos } from '../actions/flickrActions'
import { loadPanoramioPhotos } from '../actions/panoramioActions'
import { loadFlickrPhoto, loadPanoramioPhoto } from '../actions'
import { getCurrentLocation, getCurrentLocationObject, getCountryObject, getAreaLevel1Object, getLocalityObject, getSideNavVisibility } from '../reducers'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import LeftNavMain from './LeftNavMain'
import MapPage from './MapPage'
import FlickrPhotoPage from './FlickrPhotoPage'
import PanoramioPhotoPage from './PanoramioPhotoPage'
import LeftNavContainer from './LeftNavContainer'
import LocalityPage from './LocalityPage'

const wideDrawerWidth = 408
const narrowDrawerWidth = 256
const ipadWidth = 768

const LOCALITY_PAGE = 'locality'
const FLICKR_PHOTO_PAGE = 'flickrPhoto'
const PANORAMIO_PHOTO_PAGE = 'panoramioPhoto'
const MAP_PAGE = 'map'
const HOME_PAGE = 'home'

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

  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
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

      //console.log('hello?')

    if (nextProps.coordinatesString && nextProps.coordinatesString !== this.props.coordinatesString) {
      this.props.loadWikiLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
      this.props.loadFlickrPhotos(nextProps.coordinates.lat, nextProps.coordinates.lng)
      console.log('loadPanoramioPhotos')
      this.props.loadPanoramioPhotos(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }

    if (nextProps.navTolocality && nextProps.navTolocality !== this.props.navTolocality) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/localityInfo/${nextProps.navTolocality.index}/${nextProps.navTolocality.locality}`)
    }

    if (nextProps.navToFlickrPhoto && nextProps.navToFlickrPhoto !== this.props.navToFlickrPhoto) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/flickrPhoto/${nextProps.navToFlickrPhoto.index}-${nextProps.navToFlickrPhoto.id}`)
    }

    if (nextProps.navToPanoramioPhoto && nextProps.navToPanoramioPhoto !== this.props.navToPanoramioPhoto) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/panoramioPhoto/${nextProps.navToPanoramioPhoto.index}-${nextProps.navToPanoramioPhoto.id}`)
    }

  }

  loadData(props) {
    if (props.coordinatesStringParam && (!props.coordinatesString || props.coordinatesStringParam != props.coordinatesString)){
      this.props.newCoordinatesString(props.coordinatesStringParam)
    }

    if (props.localityParam && (!props.locality || props.localityParam != props.locality.id)) {
      this.props.loadLocality(props.localityParam, parseInt(props.indexParam))
    }

    if (props.flickrPhotoIdParam && (!props.flickrPhoto || props.flickrPhotoIdParam != props.flickrPhoto.id)) {
      this.props.loadFlickrPhoto(props.flickrPhotoIdParam, parseInt(props.indexParam))
    }

    if (props.panoramioPhotoIdParam && (!props.panoramioPhoto || props.panoramioPhotoIdParam != props.panoramioPhoto.photoId)) {
      this.props.loadPanoramioPhoto(props.panoramioPhotoIdParam, parseInt(props.indexParam))
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

  renderLeftNav() {
    const { page  }= this.props
    if (page === HOME_PAGE || page === MAP_PAGE) {
      return <LeftNavMain />
    }

    if (page === LOCALITY_PAGE) {
      /*return (
        <LeftNavContainer zoom={this.props.zoom.bind(this)} mapInfo={this.mapInfo.bind(this)}>
          <LocalityPage />
        </LeftNavContainer>
      )*/
      return(
        <LeftNavContainer>
          <LocalityPage />
        </LeftNavContainer>
      )
    }

    if (page === FLICKR_PHOTO_PAGE) {
      return (
        <LeftNavContainer>
          <FlickrPhotoPage />
        </LeftNavContainer>
      )
    }

    if (page === PANORAMIO_PHOTO_PAGE) {
      return (
        <LeftNavContainer>
          <PanoramioPhotoPage />
        </LeftNavContainer>
      )
    }

  }

  render() {

    let drawerWidth
    /*eslint-disable */
    if ($(window).width() >= ipadWidth ) { /*eslint-enable */
      drawerWidth = wideDrawerWidth
    } else {
      drawerWidth = narrowDrawerWidth
    }

    var sideNavVisibility = this.props.sideNav

    if (this.props.zoomed) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          {this.renderLeftNav()}
        </MuiThemeProvider>
      )
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Drawer width={drawerWidth} overlayStyle={{opacity:0.25}} onRequestChange={(open) => this.setSideNavVisibility(open)} docked={false} open={sideNavVisibility}>
            {this.renderLeftNav()}
          </Drawer>
          <AppBar style={{position:'fixed'}}title={<span><a style={{textDecoration:'none', color:'white'}} href="/">GEOJUMP</a> <span style={{fontSize:10}}>beta</span></span>} onLeftIconButtonTouchTap={this.setSideNavVisibility.bind(this, true)} iconElementRight={<RaisedButton label="Jump" id="jump" onTouchTap={this.props.randomCoordinates.bind(this)} secondary={true} style={{marginTop:6, marginRight:6}} />}>
          </AppBar>
          <div style={{
              position: 'fixed',
              top:0,
              marginTop:64,
              bottom:0,
              width:'100%',
              backgroundColor:'rgb(0, 188, 212)'
            }}
          >
            <MapPage />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

function getPageFromPath(path){
  if (path.indexOf('localityInfo') > -1) {
    return LOCALITY_PAGE
  }

  if (path.indexOf('flickrPhoto') > -1) {
    return FLICKR_PHOTO_PAGE
  }

  if (path.indexOf('panoramioPhoto') > -1) {
    return PANORAMIO_PHOTO_PAGE
  }

  if (path.indexOf('coordinates') > -1) {
    return MAP_PAGE
  }

  return HOME_PAGE
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
  indexParam: PropTypes.string,
  page: PropTypes.string,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,
  locality: PropTypes.object,
  setSideNavVisibility: PropTypes.func,
  zoomed: PropTypes.bool
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
    sideNav: getSideNavVisibility(state),
    appBarLeft: state.sideNav? 256 : 0,
    coordinatesString: state.coordinatesString,
    coordinatesStringParam: ownProps.params.coordinatesString,
    navToCoordinatesString: state.navToCoordinatesString,
    page: getPageFromPath(ownProps.location.pathname),
    locality: state.locality,
    localityParam: ownProps.params.locality,
    flickrPhotoIdParam: ownProps.params.flickrPhotoId,
    panoramioPhotoIdParam: ownProps.params.panoramioPhotoId,
    indexParam: ownProps.params.index,
    flickrPhoto: state.flickrPhoto,
    navTolocality: state.navTolocality,
    navToFlickrPhoto: state.navToFlickrPhoto,
    navToPanoramioPhoto: state.navToPanoramioPhoto,
    zoomed: state.zoom
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, loadLocality, loadFlickrPhoto, loadWikiLocation, loadFlickrPhotos, loadPanoramioPhotos, loadPanoramioPhoto, newCoordinatesString, setSideNavVisibility, zoom
})(App)
