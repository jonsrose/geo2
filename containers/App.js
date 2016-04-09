import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { resetErrorMessage, loadRandomLocation, randomCoordinates } from '../actions'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'

const SideNavLabel = props =>
<div style={{color:'rgba(0, 0, 0,0.54)',fontSize:'14px',fontWeight:500,lineHeight:'48px',paddingLeft:'16px'}}
>
  {props.children}
</div>

const RightSide = props =>
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

  loadLocation(currentLocation) {
    browserHistory.push(`/locations/${currentLocation}`)
  }

  loadCoordinates(coordinates) {
    browserHistory.push(`/coordinates/${coordinates.lat},${coordinates.lng}`)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinates !== this.props.coordinates) {
      this.loadCoordinates(nextProps.coordinates)
    }

    if (nextProps.currentLocation !== this.props.currentLocation) {
      this.loadLocation(nextProps.currentLocation)
    }
  }
/*
  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }
*/
  loadRandomLocation() {
    //this.setState(this.getLatLngFromRandom());
    this.props.loadRandomLocation()
    console.log('loadRandomLocation')
  }

  randomCoordinates() {
    //this.setState(this.getLatLngFromRandom());
    this.props.randomCoordinates()
    console.log('randomCoordinates')
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

  render() {
    console.log(this)
    console.log('randomCoordinates')
    console.log(this.randomCoordinates)
    const { children } = this.props
    console.log('loadRandomLocation')
    console.log(this.loadRandomLocation)
    return (
      <div>
        <LeftNav width={408}>
          <MenuItem onTouchTap={this.randomCoordinates.bind(this)}>Get Random Coordinates</MenuItem>
          {this.renderCoordinates()}
        </LeftNav>
        <RightSide sideNavWidth={408}>
          {children}
        </RightSide>
      </div>
    )
  }

/*
render() {
  console.log('root app');
  let {lat, lng} = this.state;

  let map = {
    center: latLng(lat, lng),
    zoom: 12,
    disableDefaultUI: true
  };

  return (
    <div>
      <LeftNav width={408}>
         <MenuItem onTouchTap={this.randomLocation.bind(this)}>Get Random Location</MenuItem>
         <SideNavLabel>
          latitude, longitude: {lat}, {lng}
          </SideNavLabel>
       </LeftNav>
      <div>
      </div>
      <Map map={map}/>
    </div>
  );
}
*/

}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  loadRandomLocation: PropTypes.func.isRequired,
  randomCoordinates: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  // Injected by React Router
  children: PropTypes.node
}

function mapStateToProps(state, ownProps) {
  return {
    errorMessage: state.errorMessage,
    coordinates: state.coordinates,
    inputValue: ownProps.location.pathname.substring(1),
    currentLocation: state.currentLocation
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage, loadRandomLocation, randomCoordinates
})(App)
