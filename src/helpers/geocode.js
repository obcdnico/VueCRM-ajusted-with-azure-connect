
import * as axios from 'axios';

// return a Promise handle with .then() && .catch()
function googleGeocode(lat, long) {
  console.log('googleGeocode', lat, long);
  return axios.get(`http://open.mapquestapi.com/geocoding/v1/reverse?key=KEY&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`);
}

export default googleGeocode;
