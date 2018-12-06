/*
Create and export configurations

*/

var environments = {};

environments.staging = {
    'envName':'staging',
    'httpPort':3000,
    'httpsPort':3001
}

environments.production ={
    'envName':'production',
    'httpPort':5000,
    'httpsPort': 5001
}

var currentEnvironment = typeof(process.env.NODE_ENV)=='string'? process.env.NODE_ENV.toLowerCase(): '';

var environmentToExport = typeof(environments[currentEnvironment])=='object'?environments[currentEnvironment]:environments.staging;

module.exports = environmentToExport;