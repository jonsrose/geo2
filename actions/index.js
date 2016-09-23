import { NAV_TO_COORDINATES, NEW_COORDINATES, SHOW_INFO_WINDOW, HIDE_INFO_WINDOW, NEW_LOCALITY, NAV_TO_LOCALITY, LEFT_NAV_WIKI_LOCATION_HOVER, LEFT_NAV_WIKI_LOCATION_UNHOVER, LEFT_NAV_FLICKR_PHOTO_HOVER, LEFT_NAV_FLICKR_PHOTO_UNHOVER, LEFT_NAV_PANORAMIO_PHOTO_HOVER, LEFT_NAV_PANORAMIO_PHOTO_UNHOVER, NAV_TO_FLICKR_PHOTO, NAV_TO_PANORAMIO_PHOTO, LOAD_FLICKR_PHOTO, LOAD_PANORAMIO_PHOTO, SET_SIDE_NAV_VISIBILITY, ZOOM, UNZOOM, TOGGLE_HIDE_EMPTY, REQUEST_SERVER_RANDOM_COORDINATES,
RECEIVE_SERVER_RANDOM_COORDINATES } from './ActionTypes'

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}

export function requestServerRandomCoordinates() {
  return {
    type: REQUEST_SERVER_RANDOM_COORDINATES
  }
}

export function recieveServerRandomCoordinates(coordinates) {
  return {
    type: NAV_TO_COORDINATES,
    coordinatesString: `${coordinates.latitude},${coordinates.longitude}`
  }
}

export function serverRandomCoordinates() {
    return dispatch => {
      dispatch(requestServerRandomCoordinates())
      return fetch('/api/random')
        .then(response => response.json())
        .then(json => dispatch(recieveServerRandomCoordinates(json)))
    }
}

export function randomCoordinates() {
  // http://stackoverflow.com/questions/34359902/better-way-to-pick-random-point-on-earth

  let lng = (Math.PI - 2 * Math.PI * getRandomInRange(0, 1000000, 0) / 1000000) * 180 / Math.PI
  let lat = (Math.PI / 2 - Math.acos(2 * getRandomInRange(0, 1000000, 0) / 1000000 - 1)) * 180 / Math.PI

  let coordinatesString = `${lat},${lng}`

  return navToCoordinatesString(coordinatesString)
}

function getCoordinatesFromCoordinatesString(coordinatesString) {
  const coordinatesArray = coordinatesString.split(',')
  const lat = Number(coordinatesArray[0])
  const lng = Number(coordinatesArray[1])
  return {lat, lng}
}

export function newCoordinatesString(coordinatesString) {
  const {lat, lng} = getCoordinatesFromCoordinatesString(coordinatesString)
  return newCoordinates(lat,lng)
}

export function navToCoordinatesString(coordinatesString) {
  return {
    type: NAV_TO_COORDINATES,
    coordinatesString
  }
}

export function navTolocality(locality, index) {
  return {
    type: NAV_TO_LOCALITY,
    locality,
    index
  }
}

export function navToFlickrPhoto(id, index) {
  return {
    type: NAV_TO_FLICKR_PHOTO,
    id,
    index
  }
}

export function navToPanoramioPhoto(id, index) {
  return {
    type: NAV_TO_PANORAMIO_PHOTO,
    id,
    index
  }
}

export function newCoordinates(lat, lng) {
  let coordinatesString = `${lat},${lng}`

  const coordinates = {}
  coordinates[coordinatesString] = {
    lat,
    lng,
    coordinatesString
  }

  return {
    type: NEW_COORDINATES,
    response: {
        entities: {
          coordinates
        },
        result: coordinatesString
    },
    coordinates: {lat, lng}
  }
}

export function newLocality(locality){
  return {
    type: NEW_LOCALITY,
    locality
  }
}

export function showInfoWindow() {
  return {
    type: SHOW_INFO_WINDOW
  }
}

export function hideInfoWindow() {
  return {
    type: HIDE_INFO_WINDOW
  }
}

export function hoverWikiLocation(title) {
  return {
    type: LEFT_NAV_WIKI_LOCATION_HOVER,
    title
  }
}

export function unHoverWikiLocation() {
  return {
    type: LEFT_NAV_WIKI_LOCATION_UNHOVER
  }
}

export function hoverFlickrPhoto(id) {
  return {
    type: LEFT_NAV_FLICKR_PHOTO_HOVER,
    id
  }
}

export function unHoverFlickrPhoto() {
  return {
    type: LEFT_NAV_FLICKR_PHOTO_UNHOVER
  }
}
export function hoverPanoramioPhoto(id) {
  return {
    type: LEFT_NAV_PANORAMIO_PHOTO_HOVER,
    id
  }
}

export function unHoverPanoramioPhoto() {
  return {
    type: LEFT_NAV_PANORAMIO_PHOTO_UNHOVER
  }
}

export function loadFlickrPhoto(id, index) {
  return {
    type: LOAD_FLICKR_PHOTO,
    id,
    index
  }
}

export function loadPanoramioPhoto(id, index) {
  return {
    type: LOAD_PANORAMIO_PHOTO,
    id,
    index
  }
}

export function setSideNavVisibility(open) {
  return {
    type: SET_SIDE_NAV_VISIBILITY,
    open
  }
}

export function toggleHideEmpty() {
  return {
    type: TOGGLE_HIDE_EMPTY
  }
}

export function zoom() {
  return {
    type: ZOOM
  }
}

export function unzoom() {
  return {
    type: UNZOOM
  }
}
