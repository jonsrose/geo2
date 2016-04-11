import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { resetErrorMessage, loadLocation, randomCoordinates } from '../actions'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import AppBar from 'material-ui/lib/app-bar'

// todo on page load it needs to handle case where coords already present, e.g. put load location in right place

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

  loadCoordinates(coordinates) {
    browserHistory.push(`/coordinates/${coordinates.lat},${coordinates.lng}`)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinates !== this.props.coordinates) {
      this.loadCoordinates(nextProps.coordinates)
      this.props.loadLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }
  }


  randomCoordinates() {
    //this.setState(this.getLatLngFromRandom());
    this.props.randomCoordinates()
    console.log('randomCoordinates')
  }

  getAppBarTitle() {
    let title = 'GEOJUMPER -'

    if (this.props.coordinates) {
      if (this.props.currentLocationObject) {
          title += ` ${this.props.currentLocationObject.formattedAddress} - Coords: `
      } else {
        title += ' Coords: '
      }
      title += ` ${this.props.coordinates.lat}, ${this.props.coordinates.lng}`
    } else {
      title += ' Get Random Location'
    }

    return title
  }

  renderCoordinates() {
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
    console.log('renderCurrentLocation this.props')
    console.log(this.props)
    const { currentLocationObject } = this.props
    console.log(currentLocationObject)

    if (!currentLocationObject) {
      return null
    }



    return (
      <SideNavLabel>
        {currentLocationObject.formattedAddress}
      </SideNavLabel>
    )

  }

  render() {
    const { children } = this.props

    return (
      <div>
        <AppBar
          title={this.getAppBarTitle()}
          style={{position:'fixed', top: 0, left:0, zIndex: 1101}}
          showMenuIconButton={false}
        />
        <MainSection sideNavWidth={408} style={{marginTop:64}}>
            {children}
        </MainSection>
        <LeftNav width={408} containerStyle={{zIndex: 1100, marginTop:64}}>
          <MenuItem onTouchTap={this.randomCoordinates.bind(this)}>Get Random Coordinates</MenuItem>
        </LeftNav>
      </div>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  randomCoordinates: PropTypes.func.isRequired,
  loadLocation: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  currentLocationObject: PropTypes.object,
  coordinates: PropTypes.string,
  // Injected by React Router
  children: PropTypes.node,
  appBarTitle: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  return {
    errorMessage: state.errorMessage,
    coordinates: state.coordinates,
    inputValue: ownProps.location.pathname.substring(1),
    currentLocation: state.currentLocation,
    currentLocationObject: state.currentLocationObject,
    appBarTitle: state.appBarTitle
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage, loadLocation, randomCoordinates
})(App)
