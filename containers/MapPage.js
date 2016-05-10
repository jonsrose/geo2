import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { newCoordinatesString, showInfoWindow, hideInfoWindow } from '../actions'
import {getCurrentLocationObject, getWikiLocations, getHoverWikiLocation, getFlickrPhotos, getHoverFlickrPhoto} from '../reducers'
import { satelliteMap } from '../util/GoogleMapsHelper'
import { navTolocality, navToFlickrPhoto, navToCoordinatesString } from '../actions'

class MapPage extends Component {
  constructor(props) {
    super(props)
  }

  handleMarkerClick() {
    this.props.showInfoWindow()
  }

  handleWikiLocationMarkerClick(title) {
    this.props.navTolocality(title)
  }

  handleFlickrPhotoMarkerClick(title) {
    this.props.navToFlickrPhoto(title)
  }

  handleCloseInfoWindow() {
    this.props.hideInfoWindow()
  }

  handleMapClick(event) {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    this.props.navToCoordinatesString(`${lat},${lng}`)
  }

  renderCoordinates(coordinates) {
    return (
      <div>Coordinates: {coordinates.lat}, {coordinates.lng}</div>
    )
  }

  renderInfoWindowContent() {
    const { coordinates, currentLocationObject } = this.props

    if (!coordinates) {
      return null
    }

    if (!currentLocationObject ){
      return this.renderCoordinates(coordinates)
    }

    const {countryName, locality, areaLevel1, areaLevel2, areaLevel3} = currentLocationObject

    return (
      <div>
        {locality && <div>{locality}</div>}
        {areaLevel1 && <div>{areaLevel1}</div>}
        {areaLevel2 && <div>{areaLevel2}</div>}
        {areaLevel3 && <div>{areaLevel3}</div>}
        {countryName && <div>{countryName}</div>}
        {this.renderCoordinates(coordinates)}
      </div>
    )

  }

  renderInfoWindow(){
    if (!this.props.infoWindow) {
        return null
    }

    return (
      <InfoWindow key="info"
        onCloseclick={this.handleCloseInfoWindow.bind(this)}>
        {this.renderInfoWindowContent()}
      </InfoWindow>
    )
  }

  getPixelPositionOffset(width, height) {
    return { x: -(width / 2), y: -(height / 2) }
  }

  render() {
    console.log('MapPage')
    // sole.log(`map page lat = ${this.props.lat} lng = ${this.props.lng}`)



    // sole.log(this.props.coordinates)
    let {lat, lng} = {lat: 0, lng: 0}

    if (this.props.coordinates) {
        lat = this.props.coordinates.lat
        lng = this.props.coordinates.lng
    }

    // sole.log('read lat lng')

    // const markerTitle = `lat: ${lat}, lng: ${lng}`

    return (
      <section style={{ height: '100%' }}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: '100%'
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => console.log(map)}
              defaultZoom={8}
              center={ { lat, lng } }
              ref="map"
              mapTypeId = {satelliteMap}
              onClick={this.handleMapClick.bind(this)}
              >
              {this.props.wikiLocations && this.props.wikiLocations.map((wikiLocation, index) => {
                if (!wikiLocation.coordinates || wikiLocation.coordinates.length == 0) {
                  return null
                }

                const wikiLocationCoordinates = wikiLocation.coordinates[0]
                return (
                  <Marker key={index}
                    position={{lat: wikiLocationCoordinates.lat, lng: wikiLocationCoordinates.lon}}
                    onClick={this.handleWikiLocationMarkerClick.bind(this, wikiLocation.title)}
                    title={wikiLocation.title}
                    icon={'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'}
                  />
                )
              })}
              {this.props.hoverWikiLocation &&
                <Marker
                  position={{lat: this.props.hoverWikiLocation.coordinates[0].lat,
                    lng: this.props.hoverWikiLocation.coordinates[0].lon}}
                />
              }

              {this.props.flickrPhotos && this.props.flickrPhotos.map((flickrPhoto, index) => {
                if (!flickrPhoto.latitude || flickrPhoto.longitude == 0) {
                  return null
                }

                return (
                  <Marker key={index}
                    position={{lat: Number(flickrPhoto.latitude), lng: Number(flickrPhoto.longitude)}}
                    onClick={this.handleFlickrPhotoMarkerClick.bind(this, flickrPhoto.id)}
                    title={flickrPhoto.title}
                    icon={'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png'}
                  />
                )
              })}

              {this.props.hoverFlickrPhoto &&
                <Marker
                  position={{lat: Number(this.props.hoverFlickrPhoto.latitude),
                    lng: Number(this.props.hoverFlickrPhoto.longitude)}}
                    icon = {'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
                />
              }
            </GoogleMap>
          }
        />
      </section>
    )
  }

}



MapPage.propTypes = {
  coordinates: PropTypes.object,
  coordinatesString: PropTypes.string,
  newCoordinatesString: PropTypes.func.isRequired,
  currentLocationObject: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    coordinatesStringParam: ownProps.params.coordinatesString,
    coordinates: state.coordinates,
    coordinatesString: state.coordinatesString,
    currentLocationObject: getCurrentLocationObject(state),
    infoWindow: state.infoWindow,
    wikiLocations: getWikiLocations(state),
    flickrPhotos: getFlickrPhotos(state),
    hoverWikiLocation: getHoverWikiLocation(state),
    hoverFlickrPhoto: getHoverFlickrPhoto(state)
  }
}

export default connect(mapStateToProps, { navTolocality, navToFlickrPhoto, navToCoordinatesString, newCoordinatesString, showInfoWindow, hideInfoWindow
})(MapPage)
