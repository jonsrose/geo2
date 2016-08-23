import { CALL_PANORAMIO_API, PanoramioSchemas } from '../middleware/panoramioApi'
import { PANORAMIO_PHOTO_REQUEST, PANORAMIO_PHOTO_SUCCESS, PANORAMIO_PHOTO_FAILURE } from './ActionTypes'
import GeoPoint from 'geopoint'

function fetchPanoramioPhotos(lat,lng) {
  var geoPoint = new GeoPoint(lat,lng)
  var boundingCoordinates = geoPoint.boundingCoordinates(10)

  var minLatitude = Math.min(boundingCoordinates[0].latitude(), boundingCoordinates[1].latitude())
  var minLongitude = Math.min(boundingCoordinates[0].longitude(), boundingCoordinates[1].longitude())
  var maxLatitude = Math.max(boundingCoordinates[0].latitude(), boundingCoordinates[1].latitude())
  var maxLongitude = Math.max(boundingCoordinates[0].longitude(), boundingCoordinates[1].longitude())

  console.log('boundingCoordinates',boundingCoordinates)
  const coordinatesString =  `${lat},${lng}`
  return {
    [CALL_PANORAMIO_API]: {
      types: [ PANORAMIO_PHOTO_REQUEST, PANORAMIO_PHOTO_SUCCESS, PANORAMIO_PHOTO_FAILURE ],
      endpoint: `http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=25&minx=${minLongitude}&miny=${minLatitude}&maxx=${maxLongitude}&maxy=${maxLatitude}&size=medium&mapfilter=true`,
      schema: PanoramioSchemas.PANORAMIO_PHOTO_COORDINATES,
      info: {coordinatesString}
    }
  }
}

export function loadPanoramioPhotos(lat,lng) {
  return (dispatch, getState) => {
    const coordinatesString = `${lat},${lng}`

    if (getState().entities.panoramioPhotoCoordinates) {
      const panoramioPhotoCoordinates = getState().entities.panoramioPhotoCoordinates[coordinatesString]

      if (panoramioPhotoCoordinates && panoramioPhotoCoordinates.panoramioPhotos && panoramioPhotoCoordinates.panoramioPhotos.length > 0) {
        return null
      }
    }

    return dispatch(fetchPanoramioPhotos(lat,lng))
  }
}
