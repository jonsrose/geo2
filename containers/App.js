import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, toggleSideNav } from '../actions'
import { loadCountry, loadWikiLocation, loadAreaLevel1, loadLocality } from '../actions/wikipediaActions'
import { loadFlickrPhotos } from '../actions/flickrActions'
import { loadLocation } from '../actions/googleActions'
import {getCurrentLocation, getCurrentLocationObject, getCountryObject, getAreaLevel1Object, getLocalityObject} from '../reducers'
import LeftNav from 'material-ui/lib/left-nav'
import Paper from 'material-ui/lib/paper'

import {deepOrange500} from 'material-ui/lib/styles/colors'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider'

// todo: on page load it needs to handle case where coords already present, e.g. put load location in right place
// todo: fix mobile, maybe use appleftnav? download source of material ui
// todo: link up panoramio

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

  //loadLocation(currentLocation) {
    //browserHistory.push(`/locations/${currentLocation}`)
  //}

  navigateToMap(coordinatesString) {
    console.log('navigateToMap')
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }



  componentWillReceiveProps(nextProps) {

    // sole.log('componentWillReceiveProps')

    if (nextProps.navToCoordinatesString && nextProps.navToCoordinatesString !== this.props.navToCoordinatesString) {
      // sole.log('navigateToMap')
      this.navigateToMap(nextProps.navToCoordinatesString)
    }

    this.loadData(nextProps)

    if (nextProps.coordinatesString && nextProps.coordinatesString !== this.props.coordinatesString) {
      //// sole.log('loadCoord')
      //this.navigateToMap(nextProps.coordinatesString)
      // sole.log('loadLoc')
      //this.props.loadLocation(nextProps.coordinatesString)
      this.props.loadWikiLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
      this.props.loadFlickrPhotos(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }

    if (nextProps.navTolocality && nextProps.navTolocality !== this.props.navTolocality) {
      //// sole.log('loadCoord')
      //this.navigateToMap(nextProps.coordinatesString)
      // sole.log('loadLoc')
      //this.props.loadLocation(nextProps.coordinatesString)
      browserHistory.push(`/coordinates/${nextProps.coordinatesString}/placeDetail/localityInfo/${nextProps.navTolocality}`)
    }

    if (nextProps.locality && nextProps.locality !== this.props.locality) {
      //// sole.log('loadCoord')
      //this.navigateToMap(nextProps.coordinatesString)
      // sole.log('loadLoc')
      //this.props.loadLocation(nextProps.coordinatesString)
      // do i need to do anything
    }

/*
    if (nextProps.country !== this.props.country) {
      this.props.loadCountry(nextProps.country)
    }
*/
/*
    if (nextProps.currentLocationObject && nextProps.currentLocationObject.country) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.country
        || this.props.currentLocationObject.country != nextProps.currentLocationObject.country) {
        this.props.loadCountry(nextProps.currentLocationObject.countryName)
        // sole.log('loadCountry')
      }
    }

    if (nextProps.currentLocationObject && nextProps.currentLocationObject.areaLevel1) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.areaLevel1
        || this.props.currentLocationObject.areaLevel1 != nextProps.currentLocationObject.areaLevel1) {
        this.props.loadAreaLevel1(nextProps.currentLocationObject.areaLevel1)
        // sole.log('loadCountry')
      }
    }

    if (nextProps.currentLocationObject && nextProps.currentLocationObject.locality) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.locality
        || this.props.currentLocationObject.locality != nextProps.currentLocationObject.locality) {
        this.props.loadLocality(nextProps.currentLocationObject.locality)
        // sole.log('loadCountry')
      }
    }
*/
  }

  loadData(props) {
    if (props.coordinatesStringParam && (!props.coordinatesString || props.coordinatesStringParam != props.coordinatesString)){
      // sole.log('newCoordinatesString')
      this.props.newCoordinatesString(props.coordinatesStringParam)
    }

    if (props.localityParam && (!props.locality || props.localityParam != props.locality)) {
      // sole.log('newlocality')
      this.props.loadLocality(props.localityParam)
    }

    //this.props.loadLocation(props.lat, props.lng)
  }

  componentWillMount() {
    // sole.log('componentWillMount')
    // sole.log('containers/MapPage componentWillMount')
    // loadData(this.props)
    // sole.log(this.props)
//    this.loadData(this.props) /* TODO what here */
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
    console.log('render start ---------------------------------------------------------------------------------------------------')
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

/*
<AppBar
  title="GEOJUMP"
  zDepth={1}
  style={{position:'fixed', top: 0, left:0, right:0, zIndex: 1102, width:'inherit'}}
  onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
  iconElementRight={<RaisedButton secondary={true} label="Random Coordinates" onTouchTap={this.randomCoordinates.bind(this)} style={{marginTop: 6, marginRight: 6}} />}
/>

<LeftNav width={408} containerStyle={{zIndex: 1100, marginTop:64}}>
  <MenuItem onTouchTap={this.randomCoordinates.bind(this)}>Get Random Coordinates</MenuItem>
</LeftNav>
*/

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
  // Injected by React Redux
  randomCoordinates: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  currentLocationObject: PropTypes.object,
  countryObject: PropTypes.object,
  coordinates: PropTypes.object,
  // Injected by React Router
  appBarTitle: PropTypes.string,
  toggleSideNav: PropTypes.func.isRequired,
  appBarLeft: PropTypes.number,
  coordinatesString: PropTypes.string,
  coordinatesStringParam: PropTypes.string,
  localityParam: PropTypes.string,
  page: PropTypes.string,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,
  locality: PropTypes.string
}



function mapStateToProps(state, ownProps) {
  //const page = getPageFromPath(ownProps.location.pathname)

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
    navTolocality: state.navTolocality
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, toggleSideNav, loadCountry, loadAreaLevel1, loadLocation, loadLocality, loadWikiLocation,loadFlickrPhotos, newCoordinatesString
})(App)
