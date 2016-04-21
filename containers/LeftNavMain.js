import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/lib/app-bar'
import RaisedButton from 'material-ui/lib/raised-button'
import MenuItem from 'material-ui/lib/menu/menu-item'
import {getCountryObject, getAreaLevel1Object, getLocalityObject} from '../reducers'
import { browserHistory } from 'react-router'
import {randomCoordinates} from '../actions'

const SideNavLabel = props =>
<div style={{color:'rgba(0, 0, 0,0.54)',fontSize:'14px',fontWeight:500,lineHeight:'48px',paddingLeft:'16px'}}
>
  {props.children}
</div>

class LeftNavMain extends Component {

  navigateToMap(coordinatesString) {
    console.log('navigateToMap')
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  navigateToCountry(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/countryInfo`)
  }

  navigateToAreaLevel1(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/areaLevel1Info`)
  }

  navigateToLocality(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/localityInfo`)
  }

  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }

  countryInfo() {
    this.navigateToCountry(this.props.coordinatesString)
  }

  areaLevel1Info() {
    this.navigateToAreaLevel1(this.props.coordinatesString)
  }

  localityInfo() {
    this.navigateToLocality(this.props.coordinatesString)
  }

  renderCountryMenuItem() {
    console.log('renderCountryMenuItem')
    const { countryObject, page } = this.props
    // sole.log(`countryObject ${countryObject}`)

    if (page == 'country' || page == 'home') {
      // sole.log('if (page == \'country\') ')
      return null
    }

    if (!countryObject || ! countryObject.title) {
      //console.log('nocountry')
      return null
    }

    console.log(`country ${countryObject.title}`)

    return (
      <MenuItem index={0} onTouchTap={this.countryInfo.bind(this)}>More about {countryObject.title}</MenuItem>
    )
  }

  renderAreaLevel1MenuItem() {
    console.log('renderAreaLevel1MenuItem')
    const { areaLevel1Object, page } = this.props
    // sole.log(`areaLevel1Object ${areaLevel1Object}`)

    if (page == 'areaLevel1' || page == 'home') {
      // sole.log('if (page == \'areaLevel1\') ')
      return null
    }

    if (!areaLevel1Object || ! areaLevel1Object.title) {
      //console.log('noareaLevel1')
      return null
    }

    console.log(`areaLevel1 ${areaLevel1Object.title}`)

    return (
      <MenuItem index={1} onTouchTap={this.areaLevel1Info.bind(this)}>More about {areaLevel1Object.title}</MenuItem>
    )
  }

  renderLocalityMenuItem() {
    console.log('renderLocalityMenuItem')
    const { localityObject, page } = this.props
    // sole.log(`localityObject ${localityObject}`)

    if (page == 'locality' || page == 'home') {
      // sole.log('if (page == \'locality\') ')
      return null
    }

    if (!localityObject || ! localityObject.title) {
      //console.log('nolocality')
      return null
    }

    console.log(`locality ${localityObject.title}`)

    return (
      <MenuItem index={2} onTouchTap={this.localityInfo.bind(this)}>More about {localityObject.title}</MenuItem>
    )
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

  renderMapMenuItem() {
    const { page } = this.props
    if (page == 'map' || page == 'home') {
      return null /* TODO could return read only menu item with treatment */
    }

    // sole.log('we do have a map dude')

    return (
      <MenuItem index={3} onTouchTap={this.mapInfo.bind(this)}>Map</MenuItem>
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

  randomCoordinates() {
    //this.setState(this.getLatLngFromRandom());
    this.props.randomCoordinates()
    // sole.log('randomCoordinates')
  }

  render() {
    // sole.log('rendercountry')
    // sole.log(this.props.countryText)
    return (
      <div>
        <AppBar title="GEOJUMP" showMenuIconButton={false} iconElementRight={<RaisedButton label="Jump" onTouchTap={this.randomCoordinates.bind(this)} primary={true} style={{marginTop:6, marginRight:6}} />}>
        </AppBar>
        {this.renderMapMenuItem()}
        {this.renderAreaLevel1MenuItem()}
        {this.renderLocalityMenuItem()}
        {this.renderCountryMenuItem()}
      </div>

    )
  }
}

LeftNavMain.propTypes = {
  countryObject: PropTypes.object,
  areaLevel1Object: PropTypes.object,
  localityObject: PropTypes.object,
  page: PropTypes.string,
  coordinatesString: PropTypes.string
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

function mapStateToProps(state, ownProps) {
  //const page = getPageFromPath(ownProps.location.pathname)

  return {
    countryObject: getCountryObject(state),
    areaLevel1Object: getAreaLevel1Object(state),
    localityObject: getLocalityObject(state),
    coordinatesString: state.coordinatesString,
    page: getPageFromPath(ownProps.location.pathname)
  }
}

export default connect(mapStateToProps, {
  randomCoordinates })(LeftNavMain)
