import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, toggleSideNav } from '../actions'
import { loadWikiLocation, loadLocality } from '../actions/wikipediaActions'
import { loadFlickrPhotos } from '../actions/flickrActions'
import { loadFlickrPhoto } from '../actions'
import {getCurrentLocation, getCurrentLocationObject, getCountryObject, getAreaLevel1Object, getLocalityObject} from '../reducers'
import LeftNav from 'material-ui/lib/left-nav'
import Paper from 'material-ui/lib/paper'

import {deepOrange500} from 'material-ui/lib/styles/colors'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider'

const MainSection = props =>
<div style={{
    position: 'absolute',
    top: 0,
    left: props.sideNavWidth + 'px',
    right: 0,
    bottom: 0,
    backgroundColor:'rgb(0, 188, 212)'
  }}

>
  {props.children}
</div>

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
    console.log('navigateToMap')
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

  handleToggle() {
    this.props.toggleSideNav()
  }

  renderPaper() {
    return (
      <Paper zDepth={1} style={{position:'fixed', top: 64, left:0, right:0, height:44, zIndex: 1101, width:'inherit', fontSize:18, lineHeight:'44px', textAlign: 'center' }}>
        {this.getTitle()}
      </Paper>
    )
  }

  render() {
    const { leftChildren, rightChildren } = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <LeftNav width={400} open={this.props.sideNav} zDepth={1} containerStyle={{zIndex: 1100}}>
            {leftChildren}
          </LeftNav>
          <MainSection sideNavWidth={400}>
            {rightChildren}
          </MainSection>
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
  toggleSideNav: PropTypes.func.isRequired,
  appBarLeft: PropTypes.number,
  coordinatesString: PropTypes.string,
  coordinatesStringParam: PropTypes.string,
  localityParam: PropTypes.string,
  flickrPhotoIdParam: PropTypes.string,
  page: PropTypes.string,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,
  locality: PropTypes.string
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
    navTolocality: state.navTolocality,
    navToFlickrPhoto: state.navToFlickrPhoto
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, toggleSideNav, loadLocality, loadFlickrPhoto, loadWikiLocation,loadFlickrPhotos, newCoordinatesString
})(App)
