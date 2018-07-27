var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://saft-tmp-asvc-api.azurewebsites.net/api"',
  AZURE_B2C_clientId: '"2570b55c-f769-43f9-a2d1-8eb4a303fde8"',
  AZURE_B2C_graphScopes: '["https://bhcdevtest.onmicrosoft.com/api/read"]',
  AZURE_B2C_authority: '"https://login.microsoftonline.com/tfp/bhcdevtest.onmicrosoft.com/B2C_1_signin"'
})
