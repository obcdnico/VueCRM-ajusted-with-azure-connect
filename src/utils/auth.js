/* eslint-disable handle-callback-err */
/* globals Store */

// runtime Auth service decorelled from vue app with process variables
const clientId = process.env.AZURE_B2C_clientId;
const graphScopes = process.env.AZURE_B2C_graphScopes;
const authority = process.env.AZURE_B2C_authority;
const ENV = process.env.NODE_ENV;

// import library && helpers
import * as Msal from 'msal';
import waitForGlobal from '../helpers/wait-global';

// configure auth service
let redirectUri = window.location.origin;
const applicationConfig = {
  clientID: clientId, // '9d86c8dc-bf7d-4573-bc3c-4df2f2c32b93',
  graphScopes: graphScopes, // ['user.read']
  authority: authority
};

var logger = new Msal.Logger(loggerCallback, {
  level: ENV === 'development' ? Msal.LogLevel.Info : Msal.LogLevel.Error, // "Error", "Warning", "Info", "Verbose"
  correlationId: '12345'
}); // level and correlationId are optional parameters.
// Logger has other optional parameters like piiLoggingEnabled which can be assigned as shown aabove. Please refer to the docs to see the full list and their default values.
function loggerCallback(logLevel, message, piiLoggingEnabled) {
    console.log(message);
}
// create the auth AzureB2C agent
const AuthAgent = new Msal.UserAgentApplication(
  applicationConfig.clientID, // clientId
  applicationConfig.authority, // authority
  authCallback, // tokenReceivedCallback
  { logger: logger, // options
    cacheLocation: 'sessionStorage',
    redirectUri: redirectUri
  }
);

// used when return url iscalled from AzureB2C return url given in argument
function authCallback(errorDesc, token, error, tokenType) {
    // This function is called after loginRedirect and acquireTokenRedirect. Use tokenType to determine context.
    // For loginRedirect, tokenType = "id_token". For acquireTokenRedirect, tokenType:"access_token".
    if (token) {
        this.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
            const user = AuthAgent.getUser();
            // set to store the user with a wait glovbal action for app runStart !
            waitForGlobal('Store', function() {
              Store.dispatch('user/loginUser', { user: user, token: accessToken })
            });
        }, function (error) {
            // fallback on popup mode if redirect mode not working
            this.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
                const user = AuthAgent.getUser();
                // set to store the user with a wait glovbal action for app runStart !
                waitForGlobal('Store', function() {
                  Store.dispatch('user/loginUser', { user: user, token: accessToken })
                });
            }, function (error) {
                console.log(error);
            });
        });
    }
    else if (errorDesc || error) {
        console.log(error + ':' + errorDesc);
    }
}

// export an Auth service consumed at runtime
export default {
  login () {
    const extraQueryParameters = '';
    return AuthAgent.loginRedirect(applicationConfig.graphScopes, extraQueryParameters);
  },
  getToken () {
    return Store.state.user.token
  },
  logout (callback) {
    this.onChange(false);
    AuthAgent.logout();
    Store.dispatch('user/logout');
    if (callback) callback(false)
  },
  loggedIn () {
    console.log('loggedIn', Store.state.user.loggedIn);
    return !!Store.state.user.loggedIn;
  },
  onChange () {},
  getUser() {
    return AuthAgent.getUser();
  }
}
