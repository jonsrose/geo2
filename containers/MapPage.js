import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { newCoordinatesString, showInfoWindow, hideInfoWindow } from '../actions'
import {getCurrentLocationObject, getWikiLocations, getHoverWikiLocation, getFlickrPhotos, getHoverFlickrPhoto, getPanoramioPhotos, getHoverPanoramioPhoto} from '../reducers'
import { satelliteMap, roadMap, hybrid, terrain } from '../util/GoogleMapsHelper'
import { navTolocality, navToFlickrPhoto, navToPanoramioPhoto, navToCoordinatesString, mapCenterChanged } from '../actions'

class MapPage extends Component {
  constructor(props) {
    super(props)
  }

  handleMarkerClick() {
    this.props.showInfoWindow()
  }

  handleWikiLocationMarkerClick(title, index) {
    this.props.navTolocality(title, index)
  }

  handleFlickrPhotoMarkerClick(title, index) {
    this.props.navToFlickrPhoto(title, index)
  }

  handlePanoramioPhotoMarkerClick(title, index) {
    this.props.navToPanoramioPhoto(title, index)
  }

  handleCloseInfoWindow() {
    this.props.hideInfoWindow()
  }

  handleCenterChanged() {
    const newCenter = this.refs.map.getCenter()
    const latitude = newCenter.lat()
    const longitude = newCenter.lng()
    //console.log('handleCenterChanged', latitude, longitude)
    //console.log('oldvalues', this.props.coordinates.lat, this.props.coordinates.lng)

    if (latitude === this.props.coordinates.lat && longitude === this.props.coordinates.lng) {
      //console.log('old values')
      //console.log('no difference')
      return
    }
    //console.log('mapCenterChanged', latitude, longitude)
    this.props.mapCenterChanged(latitude, longitude)
    // const lat = event.latLng.lat()
    // const lng = event.latLng.lng()
    // this.props.mapCenterChanged(lat,lng)
  }

  handleMapTypeIdChanged() {
    const newMapTypeId = this.refs.map.getMapTypeId()
    console.log('newMapTypeId', newMapTypeId)
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
    let {lat, lng} = {lat: 0, lng: 0}

    if (this.props.mapCenter) {
        lat = this.props.mapCenter.lat
        lng = this.props.mapCenter.lng
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
              defaultZoom={6}
              center={ { lat, lng } }
              onDragend={this.handleCenterChanged.bind(this)}
              ref="map"
              mapTypeId = {hybrid}
              onMaptypeidChanged={this.handleMapTypeIdChanged.bind(this)}
              >
              {this.props.wikiLocations && this.props.wikiLocations.map((wikiLocation, index) => {
                if (!wikiLocation.coordinates || wikiLocation.coordinates.length == 0) {
                  return null
                }

                const wikiLocationCoordinates = wikiLocation.coordinates[0]
                return (
                  <Marker key={index}
                    position={{lat: wikiLocationCoordinates.lat, lng: wikiLocationCoordinates.lon}}
                    onClick={this.handleWikiLocationMarkerClick.bind(this, wikiLocation.title, index)}
                    title={wikiLocation.title}
                    icon={'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'}
                  />
                )
              })}
              {this.props.hoverWikiLocation &&
                <Marker
                  position={{lat: this.props.hoverWikiLocation.coordinates[0].lat,
                    lng: this.props.hoverWikiLocation.coordinates[0].lon}}
                    icon = {'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
                />
              }

              {this.props.flickrPhotos && this.props.flickrPhotos.map((flickrPhoto, index) => {
                if (!flickrPhoto.latitude || flickrPhoto.longitude == 0) {
                  return null
                }

                return (
                  <Marker key={index}
                    position={{lat: Number(flickrPhoto.latitude), lng: Number(flickrPhoto.longitude)}}
                    onClick={this.handleFlickrPhotoMarkerClick.bind(this, flickrPhoto.id, index)}
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

              {this.props.panoramioPhotos && this.props.panoramioPhotos.map((panoramioPhoto, index) => {
                if (!panoramioPhoto.latitude || panoramioPhoto.longitude == 0) {
                  return null
                }

                return (
                  <Marker key={index}
                    position={{lat: Number(panoramioPhoto.latitude), lng: Number(panoramioPhoto.longitude)}}
                    onClick={this.handlePanoramioPhotoMarkerClick.bind(this, panoramioPhoto.photoId, index)}
                    title={panoramioPhoto.title}
                    icon={'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png'}
                  />
                )
              })}

              {this.props.hoverPanoramioPhoto &&
                <Marker
                  position={{lat: Number(this.props.hoverPanoramioPhoto.latitude),
                    lng: Number(this.props.hoverPanoramioPhoto.longitude)}}
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
  mapCenter: PropTypes.object,
  coordinatesString: PropTypes.string,
  newCoordinatesString: PropTypes.func.isRequired,
  currentLocationObject: PropTypes.object
}

function mapStateToProps(state) {
  return {
    coordinates: state.coordinates,
    mapCenter: state.mapCenter,
    coordinatesString: state.coordinatesString,
    currentLocationObject: getCurrentLocationObject(state),
    infoWindow: state.infoWindow,
    wikiLocations: getWikiLocations(state),
    flickrPhotos: getFlickrPhotos(state),
    panoramioPhotos: getPanoramioPhotos(state),
    hoverWikiLocation: getHoverWikiLocation(state),
    hoverFlickrPhoto: getHoverFlickrPhoto(state),
    hoverPanoramioPhoto: getHoverPanoramioPhoto(state)
  }
}

export default connect(mapStateToProps, { navTolocality, navToFlickrPhoto, navToPanoramioPhoto, navToCoordinatesString, newCoordinatesString, showInfoWindow, hideInfoWindow, mapCenterChanged
})(MapPage)
