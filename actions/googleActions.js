import { CALL_GOOGLE_API, GoogleSchemas } from '../middleware/googleApi'
import { LOCATION_REQUEST, LOCATION_SUCCESS, LOCATION_FAILURE } from './ActionTypes'
//https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJg
export const GOOGLE_API_SERVER_KEY='AIzaSyDNwz2AmIdACEiuR5aOObQZarSwZCVVJ6g'

//todo https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=al wahat libya&utf8=&format=json&srwhat=text

function fetchLocation(coordinatesString) {
  return {
    [CALL_GOOGLE_API]: {
      types: [ LOCATION_REQUEST, LOCATION_SUCCESS, LOCATION_FAILURE ],
      endpoint: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinatesString}&key=${GOOGLE_API_SERVER_KEY}`,
      schema: GoogleSchemas.LOCATION,
      info: {coordinatesString}
    }
  }
}

export function loadLocation(coordinatesString) {

  return (dispatch) => {
    return dispatch(fetchLocation(coordinatesString))
  }
}
