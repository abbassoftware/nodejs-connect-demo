var connect = require("connect");
var url = require('url');
var app = connect();
var authJsonObj = require("./authDetails.json");

function sayHello(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.write('Write first chunk. ');
    res.write('Write second chunk. ');
    res.end('Hello Connect');
}

function loggingMiddleware(req, res, next) {
    console.log("The request method is : " + req.method );
    console.log("The request url is : " + req.url );
    var queryData = url.parse(req.url, true).query;
    console.log("The query parameters are : " + queryData.name );
    next();
}

function authenticateAdmin(req, res, next) {
    console.log("authenticateAdmin");
    var authorization = req.headers.authorization;
    //if the Authorization header is not present return error.
    if (!authorization) return returnAuthError(res);

    var parts = authorization.split(' ');

    //Check the Authorization header contains both the parts.
    if (parts.length !== 2) return returnAuthError(res);

    //Check the Authorization header Scheme is correct.
    var scheme = parts[0];
    if ('Basic' != scheme) return returnAuthError(res);

    //Credentials will be base64 encoded. After decoding they will be in the format username:password
    var credentials = new Buffer(parts[1], 'base64').toString()
    var index = credentials.indexOf(':');

    var user = credentials.slice(0, index)
    var pass = credentials.slice(index + 1);

    //If the password does not match return error.
    if(authJsonObj[user] != pass) return returnAuthError(res);

    //Auth is complete pass to the next handler.
    next();
}

function returnAuthError(res) {
  res.statusCode = 401;
  res.end('Unauthorized     ');
};

app
.use(loggingMiddleware)
.use('/admin', authenticateAdmin)
.use(sayHello)
.listen(3031);

console.log("Server is listening");
