/*
*
*
*/

var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// instantiate http server
var httpServer = http.createServer(function(req,res){
    commonServer(req,res);
});
// start http server
httpServer.listen(config.httpPort, function(){
    console.log('server listem in port '+ config.httpPort + ' evironment ' + config.envName);
});

// instatiate https server
httsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httsServerOptions, function(req,res){
    commonServer(req,res);
});
// start https server
httpsServer.listen(config.httpsPort, function(){
    console.log('server listem in port '+ config.httpsPort + ' evironment ' + config.envName);
});

// common server initialization
var commonServer = function(req, res){
    var parsedUrl = url.parse(req.url, true);// true permite obter os param na forma de objeto json
    var path = parsedUrl.pathname;
    var trimedPath = path.replace(/^\/+|\/+$/g,'');
    var method = req.method.toLowerCase();
    var queryStringObject = parsedUrl.query;
    // get the payload, se existir
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    // get the headers as object
    var headers = req.headers;

    req.on( 'data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();
        //escolher o processador da rota
        var choosenHandler = typeof(handlers[trimedPath]) != 'undefined' ?  handlers[trimedPath] : handlers.notFound;

        // objeto a ser enviado ao handler
        var data = {
            'trimmedPath':trimedPath,
            'queryStringObject':queryStringObject,
            'headers':headers,
            'payload':buffer,
            'method':method
        };

        
        //console.log(`path: ${trimedPath} with method ${method} and parameter `, queryStringObject, headers);
        //console.log('payload: ' +buffer);

        //route the request to the handler
        choosenHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode)=='number'?statusCode:200;
            payload = typeof(payload)=='object'?payload:{};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');//deve vir antes da linha seguinte
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('returning this response:', statusCode, payloadString); 
        });
    });
};

// handlers das rotas
var handlers = {};
handlers.ping = function(data,callback){
    callback(200);
};
handlers.hello = function(data, callback){
    callback(200, {message:'wellcome to my firts homework'});
};
handlers.notFound = function(data, callback){
    callback(404);
};
// rotas
var router = {
    'ping':handlers.ping,
    'hello':handlers.hello
}
