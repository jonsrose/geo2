/*eslint no-undef: 0*/
export const latLng = (lat, lng) => new google.maps.LatLng(lat, lng)
export const geocoder = () => new google.maps.Geocoder
export const map = (node, map) => new google.maps.Map(node, map)
export const infowindow = () => new google.maps.InfoWindow
export const marker = (position, map) => new google.maps.Marker({
    position: position,
    map: map
})
export const GeocoderStatusOK = google.maps.GeocoderStatus.OK
export const satelliteMap = google.maps.MapTypeId.SATELLITE
