import { CALL_FLICKR_API, FlickrSchemas } from '../middleware/flickrApi'
import { FLICKR_PHOTO_REQUEST, FLICKR_PHOTO_SUCCESS, FLICKR_PHOTO_FAILURE } from './ActionTypes'

function fetchFlickrPhotos(lat,lng) {
  const coordinatesString =  `${lat},${lng}`
  return {
    [CALL_FLICKR_API]: {
      types: [ FLICKR_PHOTO_REQUEST, FLICKR_PHOTO_SUCCESS, FLICKR_PHOTO_FAILURE ],
      endpoint: `https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&extras=description,geo,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o
      &api_key=22355a5ffcecac332859348f3d9f2611&lat=${lat}&lon=${lng}&format=json&nojsoncallback=1`,
      schema: FlickrSchemas.FLICKR_PHOTO_COORDINATES,
      info: {coordinatesString}
    }
  }
}

export function loadFlickrPhotos(lat,lng) {
  return (dispatch, getState) => {
    const coordinatesString = `${lat},${lng}`

    if (getState().entities.flickrPhotoCoordinates) {
      const flickrPhotoCoordinates = getState().entities.flickrPhotoCoordinates[coordinatesString]

      if (flickrPhotoCoordinates && flickrPhotoCoordinates.flickrPhotos && flickrPhotoCoordinates.flickrPhotos.length > 0) {
        return null
      }
    }

    return dispatch(fetchFlickrPhotos(lat,lng))
  }
}
