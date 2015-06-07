var connect = require("connect");
var app = connect();

function sayHello(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Connect');
}

app
.use(sayHello)
.listen(3031);

console.log("Server is listening");