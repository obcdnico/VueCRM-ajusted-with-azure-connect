import * as axios from 'axios';
import AuthService from '../utils/auth';
const baseUrl = process.env.API_URL;

// // add token to axios headers
// var token = AuthService.getToken();
// axios.defaults.headers.common = {'Authorization': "bearer " + token};

// intercept http errors to renew token
function errorResponseHandler(error) {
     // check for errorHandle config
     if ( error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false ) {
         return Promise.reject(error);
     }
     // if has response show the error
     if (error.response) {
       console.log('axios error', error);
     }
 }

// apply interceptor on response
axios.interceptors.response.use(
    response => response,
    errorResponseHandler
);


// export an axiosWrapper service
export default {
  request(url, config = {}) {
    var token = AuthService.getToken();
    // set default config https://github.com/axios/axios#handling-errors
    var requestConfig = {
      // `url` is the server URL that will be used for the request
      url: url,
      // `method` is the request method to be used when making the request
      method: 'get', // default
      // `baseURL` will be prepended to `url` unless `url` is absolute.
      // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
      // to methods of that instance.
      baseURL: baseUrl,
      // `headers` are custom headers to be sent
      headers: {'Authorization': 'bearer ' + token},
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      params: {},
      // `data` is the data to be sent as the request body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // When no `transformRequest` is set, must be of one of the following types:
      // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
      // - Browser only: FormData, File, Blob
      // - Node only: Stream, Buffer
      data: {},
      // `withCredentials` indicates whether or not cross-site Access-Control requests
      // should be made using credentials
      withCredentials: true, // default false
      // `responseType` indicates the type of data that the server will respond with
      // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: 'json', // default
      // `responseEncoding` indicates encoding to use for decoding responses
      // Note: Ignored for `responseType` of 'stream' or client-side requests
      responseEncoding: 'utf8', // default
    };
    // extend initConfig from config param
    Object.assign(requestConfig, config);
    console.log('wrapper requestConfig', requestConfig);
    return axios(requestConfig);
  },
  get(url) {
    return this.request(url);
  },
  post(url, datas) {
    return this.request(url, {
      method: 'post',
      data: datas
    });
  }
}