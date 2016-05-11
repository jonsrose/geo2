import { CALL_WIKIPEDIA_API, WikipediaSchemas } from '../middleware/wikipediaApi'
import { LOCALITY_REQUEST, LOCALITY_SUCCESS, LOCALITY_FAILURE, WIKI_LOCATION_REQUEST, WIKI_LOCATION_SUCCESS, WIKI_LOCATION_FAILURE } from './ActionTypes'

function fetchLocality(locality) {
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ LOCALITY_REQUEST, LOCALITY_SUCCESS, LOCALITY_FAILURE ],
      endpoint: `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${locality}&piprop=thumbnail&pithumbsize=256`,
      schema: WikipediaSchemas.LOCALITY
    }
  }
}

export function loadLocality(locality) {
  return (dispatch, getState) => {
    if (getState().entities.localities && getState().entities.localities[locality]) {
      return null
    }

    return dispatch(fetchLocality(locality))
  }
}

function fetchWikiLocation(lat,lng) {
  const coordinatesString =  `${lat},${lng}`
  return {
    [CALL_WIKIPEDIA_API]: {
      types: [ WIKI_LOCATION_REQUEST, WIKI_LOCATION_SUCCESS, WIKI_LOCATION_FAILURE ],
      endpoint:
      `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms&colimit=50&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=10000&ggslimit=50&format=json`,
      schema: WikipediaSchemas.WIKI_LOCATION_COORDINATES,
      info: {coordinatesString}
    }
  }
}


export function loadWikiLocation(lat,lng) {
  return (dispatch, getState) => {
    const coordinatesString = `${lat},${lng}`

    if (getState().entities.wikiLocationCoordinates) {
      const wikiLocationCoordinates = getState().entities.wikiLocationCoordinates[coordinatesString]

      if (wikiLocationCoordinates && wikiLocationCoordinates.wikiLocation && wikiLocationCoordinates.wikiLocation.length > 0) {
        return null
      }
    }

    return dispatch(fetchWikiLocation(lat,lng))
  }
}
