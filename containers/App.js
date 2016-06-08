import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, setSideNavVisibility, zoom } from '../actions'
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
import LeftNavMain from './LeftNavMain'
import MapPage from './MapPage'
import FlickrPhotoPage from './FlickrPhotoPage'
import LeftNavContainer from './LeftNavContainer'
import LocalityPage from './LocalityPage'

const wideDrawerWidth = 408
const narrowDrawerWidth = 256
const ipadWidth = 768

const LOCALITY_PAGE = 'locality'
const FLICKR_PHOTO_PAGE = 'flickrPhoto'
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

    if (nextProps.coordinatesString && nextProps.coordinatesString !== this.props.coordinatesString) {
      this.props.loadWikiLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
      this.props.loadFlickrPhotos(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }

    if (nextProps.navTolocality && nextProps.navTolocality !== this.props.navTolocality) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/localityInfo/${nextProps.navTolocality.index}/${nextProps.navTolocality.locality}`)
    }

    if (nextProps.navToFlickrPhoto && nextProps.navToFlickrPhoto !== this.props.navToFlickrPhoto) {
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/flickrPhoto/${nextProps.navToFlickrPhoto.index}-${nextProps.navToFlickrPhoto.id}`)
    }
  }

  loadData(props) {
    if (props.coordinatesStringParam && (!props.coordinatesString || props.coordinatesStringParam != props.coordinatesString)){
      this.props.newCoordinatesString(props.coordinatesStringParam)
    }

    // console.log('props.localityParam',props.localityParam, 'props.locality',props.locality)
    if (props.localityParam && (!props.locality || props.localityParam != props.locality.id)) {
      // console.log('loadLocality',props.localityParam, parseInt(props.indexParam))
      this.props.loadLocality(props.localityParam, parseInt(props.indexParam))
    }

    if (props.flickrPhotoIdParam && (!props.flickrPhotoId || props.flickrPhotoIdParam != props.flickrPhotoId)) {
      // console.log(`loadFlickrPhoto ${props.flickrPhotoIdParam} ${props.flickrPhotoId}`)
      this.props.loadFlickrPhoto(props.flickrPhotoIdParam, parseInt(props.indexParam))
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
      // console.log('LeftNavMain')
      return <LeftNavMain />
    }

    if (page === LOCALITY_PAGE) {
      // console.log('LocalityPage')
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

  }

  render() {
    //  console.log ($(window).width())
    // todo if width is > ? set drawer width to 408, otherwise leave at 256

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
          <AppBar style={{position:'fixed'}}title={<span>GEOJUMP <span style={{fontSize:10}}>beta</span></span>} onLeftIconButtonTouchTap={this.setSideNavVisibility.bind(this, true)} iconElementRight={<RaisedButton label="Jump" id="jump" onTouchTap={this.props.randomCoordinates.bind(this)} secondary={true} style={{marginTop:6, marginRight:6}} />}>
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
    sideNav: state.sideNav,
    appBarLeft: state.sideNav? 256 : 0,
    coordinatesString: state.coordinatesString,
    coordinatesStringParam: ownProps.params.coordinatesString,
    navToCoordinatesString: state.navToCoordinatesString,
    page: getPageFromPath(ownProps.location.pathname),
    locality: state.locality,
    localityParam: ownProps.params.locality,
    flickrPhotoIdParam: ownProps.params.flickrPhotoId,
    indexParam: ownProps.params.index,
    flickrPhotoId: state.flickrPhotoId,
    navTolocality: state.navTolocality,
    navToFlickrPhoto: state.navToFlickrPhoto,
    zoomed: state.zoom
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, loadLocality, loadFlickrPhoto, loadWikiLocation,loadFlickrPhotos, newCoordinatesString, setSideNavVisibility, zoom
})(App)
