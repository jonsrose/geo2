import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { resetErrorMessage, randomCoordinates, toggleSideNav, loadCountry, loadLocation } from '../actions'
import {getCurrentLocation, getCurrentLocationObject, getCountryObject} from '../reducers'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import AppBar from 'material-ui/lib/app-bar'
// import RaisedButton from 'material-ui/lib/raised-button'
import Paper from 'material-ui/lib/paper'

// todo: on page load it needs to handle case where coords already present, e.g. put load location in right place
// todo: fix mobile, maybe use appleftnav? download source of material ui
// todo: link up panoramio

const SideNavLabel = props =>
<div style={{color:'rgba(0, 0, 0,0.54)',fontSize:'14px',fontWeight:500,lineHeight:'48px',paddingLeft:'16px'}}
>
  {props.children}
</div>



const MainSection = props =>
<div style={{
    position: 'absolute',
    top: 0,
    left: props.sideNavWidth + 'px',
    right: 0,
    bottom: 0
  }}
>
  {props.children}
</div>

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDismissClick = this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleChange(nextValue) {
    browserHistory.push(`/${nextValue}`)
  }

  //loadLocation(currentLocation) {
    //browserHistory.push(`/locations/${currentLocation}`)
  //}

  loadCoordinates(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinatesString !== this.props.coordinatesString) {
      this.loadCoordinates(nextProps.coordinatesString)
      this.props.loadLocation(nextProps.coordinatesString)
    }
/*
    if (nextProps.country !== this.props.country) {
      this.props.loadCountry(nextProps.country)
    }
*/


    if (nextProps.currentLocationObject && nextProps.currentLocationObject.country) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.country
        || this.props.currentLocationObject.country != nextProps.currentLocationObject.country) {
        this.props.loadCountry(nextProps.currentLocationObject.country)
        console.log('loadCountry')
      }
    }



  }

  randomCoordinates() {
    //this.setState(this.getLatLngFromRandom());
    this.props.randomCoordinates()
    // sole.log('randomCoordinates')
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

  renderCoordinates() {
      // sole.log('renderCoordinates')
      const { coordinates } = this.props

      if (!coordinates) {
        return null
      }

      const { lat, lng } = coordinates
      if (!lat || !lng) {
        return null
      }

      return (
        <SideNavLabel>
          latitude, longitude: {lat}, {lng}
        </SideNavLabel>
      )
  }

  renderCurrentLocation() {
    // sole.log('renderCurrentLocation this.props')
    // sole.log(this.props)
    const { currentLocationObject } = this.props
    // sole.log(currentLocationObject)

    if (!currentLocationObject) {
      return null
    }

    return (
      <SideNavLabel>
        {currentLocationObject.formattedAddress}
      </SideNavLabel>
    )

  }

  mapInfo() {
    browserHistory.push(`/coordinates/${this.props.coordinatesString}`)
  }

  countryInfo() {
    browserHistory.push(`/coordinates/${this.props.coordinatesString}/countryInfo`)
  }

  renderCountryMenuItem() {
    const { countryObject, page } = this.props
    console.log(`countryObject ${countryObject}`)

    if (!countryObject) {
      return null
    }

    if (page == 'country') {
      return null /* TODO could return read only menu item with treatment */
    }

    console.log('we do have a country dude')

    return (
      <MenuItem onTouchTap={this.countryInfo.bind(this)}>{`${countryObject.title} country info`}</MenuItem>
    )
  }

  renderMapMenuItem() {
    const { page } = this.props
    if (page == 'map' || page == 'home') {
      return null /* TODO could return read only menu item with treatment */
    }

    console.log('we do have a map dude')

    return (
      <MenuItem onTouchTap={this.mapInfo.bind(this)}>Map</MenuItem>
    )
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
    const { children } = this.props

    return (
      <div>

      <LeftNav width={400} open={this.props.sideNav} zDepth={1} containerStyle={{zIndex: 1100}}>
        <AppBar title="GEOJUMP" showMenuIconButton={false}>
        </AppBar>
        <MenuItem onTouchTap={this.randomCoordinates.bind(this)}>Get Random Coordinates</MenuItem>
        {this.renderMapMenuItem()}
        {this.renderCountryMenuItem()}
        </LeftNav>
        <MainSection sideNavWidth={400}>
          {children}
        </MainSection>
      </div>
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

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  randomCoordinates: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  currentLocationObject: PropTypes.object,
  countryObject: PropTypes.object,
  coordinates: PropTypes.object,
  // Injected by React Router
  children: PropTypes.node,
  appBarTitle: PropTypes.string,
  toggleSideNav: PropTypes.func.isRequired,
  appBarLeft: PropTypes.number,
  coordinatesString: PropTypes.string
}

function getPageFromPath(path){
  if (path.indexOf('countryInfo') > -1) {
    return 'country'
  }

  if (path.indexOf('coordinates') > -1) {
    return 'map'
  }

  return 'home'
}

function mapStateToProps(state, ownProps) {
  //const page = getPageFromPath(ownProps.location.pathname)

  return {
    errorMessage: state.errorMessage,
    coordinates: state.coordinates,
    inputValue: ownProps.location.pathname.substring(1),
    currentLocation: getCurrentLocation(state),
    currentLocationObject: getCurrentLocationObject(state),
    countryObject: getCountryObject(state),
    appBarTitle: state.appBarTitle,
    sideNav: state.sideNav,
    appBarLeft: state.sideNav? 256 : 0,
    coordinatesString: state.coordinatesString,
    page: getPageFromPath(ownProps.location.pathname)
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage, randomCoordinates, toggleSideNav, loadCountry, loadLocation
})(App)
