import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import {getCountryObject, getAreaLevel1Object, getLocalityObject, getWikiLocations, getFlickrPhotos, getPanoramioPhotos} from '../reducers'
import { browserHistory } from 'react-router'
import {hoverWikiLocation, unHoverWikiLocation, navTolocality, hoverFlickrPhoto, unHoverFlickrPhoto, navToFlickrPhoto, navToPanoramioPhoto, toggleHideEmpty} from '../actions'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Paper from 'material-ui/Paper'

const SideNavLabel = props =>
<div style={{color:'rgba(0, 0, 0,0.54)',fontSize:'14px',fontWeight:500,lineHeight:'48px',paddingLeft:'16px'}}
>
  {props.children}
</div>

class LeftNavMain extends Component {

  navigateToMap(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  navigateToCountry(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/placeDetail/countryInfo`)
  }

  navigateToAreaLevel1(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/placeDetail/areaLevel1Info`)
  }

  navigateToLocality(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/placeDetail/localityInfo`)
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
    const { countryObject, page } = this.props

    if (page == 'country' || page == 'home') {
      return null
    }

    if (!countryObject || ! countryObject.title) {
      return null
    }

    return (
      <MenuItem index={0} onTouchTap={this.countryInfo.bind(this)}>More about {countryObject.title}</MenuItem>
    )
  }

  renderAreaLevel1MenuItem() {
    const { areaLevel1Object, page } = this.props

    if (page == 'areaLevel1' || page == 'home') {
      return null
    }

    if (!areaLevel1Object || ! areaLevel1Object.title) {
      return null
    }

    return (
      <MenuItem index={1} onTouchTap={this.areaLevel1Info.bind(this)}>More about {areaLevel1Object.title}</MenuItem>
    )
  }

  renderLocalityMenuItem() {
    const { localityObject, page } = this.props

    if (page == 'locality' || page == 'home') {
      return null
    }

    if (!localityObject || ! localityObject.title) {
      return null
    }

    return (
      <MenuItem index={2} onTouchTap={this.localityInfo.bind(this)}>More about {localityObject.title}</MenuItem>
    )
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

  renderMapMenuItem() {
    const { page } = this.props
    if (page == 'map' || page == 'home') {
      return null
    }

    return (
      <MenuItem index={3} onTouchTap={this.mapInfo.bind(this)}>Map</MenuItem>
    )
  }

  renderCurrentLocation() {
    const { currentLocationObject } = this.props

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
    const {wikiLocations, flickrPhotos, panoramioPhotos, coordinatesString} = this.props
    return (
      <div style={{overflowX:'hidden'}}>
        {wikiLocations &&
          <List>
          <Subheader>Nearby Wikipedia locations</Subheader>
          {wikiLocations.map((wikiLocation, index) => {
            return (
              <ListItem
                key={index}
                primaryText={wikiLocation.title}
                onMouseEnter = {this.props.hoverWikiLocation.bind(this, wikiLocation.title)}
                onMouseLeave = {this.props.unHoverWikiLocation.bind(this)}
                onTouchTap={this.props.navTolocality.bind(this, wikiLocation.title, index)}
                leftAvatar={
                  wikiLocation.thumbnail
                  ? <Avatar style={{borderRadius:0}} src={wikiLocation.thumbnail.source} />
                : <Avatar style={{ visibility:'hidden'}}/>
                }
              />
            )
          })}
          </List>
        }

        {flickrPhotos &&
          <List>
          <Subheader>Nearby Flickr Photos</Subheader>
          {flickrPhotos.map((flickrPhoto, index) => {
            return (
              <ListItem
                key={index}
                primaryText={flickrPhoto.title}
                onMouseEnter = {this.props.hoverFlickrPhoto.bind(this, flickrPhoto.id)}
                onMouseLeave = {this.props.unHoverFlickrPhoto.bind(this)}
                onTouchTap={this.props.navToFlickrPhoto.bind(this, flickrPhoto.id, index)}
                leftAvatar={<Avatar style={{borderRadius:0}} src={flickrPhoto.urlSq} />}
              />
            )
          })}
          </List>
        }

        {panoramioPhotos &&
          <List>
          <Subheader>Nearby Panoramio Photos</Subheader>
          {panoramioPhotos.map((panoramioPhoto, index) => {
            return (
              <ListItem
                key={index}
                primaryText={panoramioPhoto.photoTitle}
                onTouchTap={this.props.navToPanoramioPhoto.bind(this, panoramioPhoto.photoId, index)}
                leftAvatar={<Avatar style={{borderRadius:0}} src={panoramioPhoto.photoFileUrl} />}
              />
            )
          })}
          </List>
        }

        {coordinatesString && !wikiLocations && !flickrPhotos && !panoramioPhotos &&
          <Paper style={{position: 'absolute', top: 0, bottom:10, overflow:'auto', paddingLeft:10, paddingRight:10}}>
            <p><strong>No nearby places found.</strong></p>
              <p>Touch somewhere else on the map, zoom out first if that helps</p>
              <p>Or hit the JUMP to go to another location</p>
              <p>Note that you may have to jump several times before landing on a location!</p>
              <p><input type="checkbox" checked={this.props.hideEmpty} onClick={this.props.toggleHideEmpty}  />Don't show this again</p>
          </Paper>
        }

        {!coordinatesString &&
          <Paper style={{position: 'absolute', top: 0, bottom:10, overflow:'auto', paddingLeft:10, paddingRight:10}}>
            <p><strong>Welcome to GEOJUMP!</strong></p>
            <p>Press the JUMP button to start!</p>
            <p>GEOJUMP will generate random coordinates and will jump to that location on a map, and will look for nearby photos from Panoramio or Flickr or locations from Wikipedia</p>
            <p>Note that you may have to jump several times before landing on a location with nearby places as 71% of earths surface is water!</p>
            <p>Questions? email <a href="jonrosesf@gmail.com">jonrosesf@gmail.com</a></p>
          </Paper>
        }
      </div>

    )
  }
}

LeftNavMain.propTypes = {
  countryObject: PropTypes.object,
  areaLevel1Object: PropTypes.object,
  localityObject: PropTypes.object,
  page: PropTypes.string,
  coordinatesString: PropTypes.string,
  hoverWikiLocation: PropTypes.func,
  unHoverWikiLocation: PropTypes.func,
  hoverFlickrPhoto: PropTypes.func,
  unHoverFlickrPhoto: PropTypes.func,
  navTolocality: PropTypes.func,
  navToFlickrPhoto: PropTypes.func,
  navToPanoramioPhoto: PropTypes.func,
  toggleHideEmpty: PropTypes.func
}

/*
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
*/

function mapStateToProps(state) {
  return {
    countryObject: getCountryObject(state),
    areaLevel1Object: getAreaLevel1Object(state),
    localityObject: getLocalityObject(state),
    coordinatesString: state.coordinatesString,
    wikiLocations: getWikiLocations(state),
    flickrPhotos: getFlickrPhotos(state),
    panoramioPhotos: getPanoramioPhotos(state),
    hideEmpty: state.hideEmpty
  }
}

export default connect(mapStateToProps, {
  hoverWikiLocation, unHoverWikiLocation, hoverFlickrPhoto, unHoverFlickrPhoto, navTolocality, navToFlickrPhoto, navToPanoramioPhoto, toggleHideEmpty })(LeftNavMain)
