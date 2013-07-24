var express = require('express');
var _ = require('underscore');
var fs = require("fs");


var app = express();

app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get('/', function(request, response) {
  response.sendfile("index.html");
});

app.get('/capture', function(request, response){
  
});

var port = process.env.PORT || 5000;

var crypto = require('crypto'),
      http = require("http");

var privateKey = fs.readFileSync('server.key').toString();
var certificate = fs.readFileSync('server.crt').toString();
var options = {key: privateKey, cert: certificate};

var server;

if (process.env.NODE_ENV === "production"){
	// Heroku production environment
	server = http.createServer(app);
} else {
	// local dev
	var https = require("https")
	server = https.createServer(options, app);
}
server.listen(port);
console.log("Listening on port " + port);



var sayGreeting = function(greeting, name) {
	return greeting + ", " + name;
};