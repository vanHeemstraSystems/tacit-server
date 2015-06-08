/*
* TACIT SERVER - The Tacit Server module
* @module tacit-server
*
* Usage
* var TacitServer = require("tacitserver");
*
* // you can use the 'new' keyword
* var ts = new TacitServer; // tacit server object
* var s = ts.Server; // server object
* var config = {'test':true};
* s.setConfig(config); // sets the server config
*
* // or you can skip it!
* var ts = TacitServer; // tacit server object
* var s = ts.Server; // server object
* var config = {'test':true};
* s.setConfig(config); // sets the server config
*/
// See also http://www.sitepoint.com/understanding-module-exports-exports-node-js/
// See also http://stackoverflow.com/questions/20534702/node-js-use-of-module-exports-as-a-constructor
/**
* Module dependencies.
*/
var express = require('express'),
path = require('path'),
mime = require('mime'),
fs = require('fs'),
url = require('url'),
http = require('http'),
cors = require('cors'),
runner = require('child_process'),
morgan = require('morgan'),
partials = require('express-partials'),
device = require('./lib/device.js'),
hash = require('./lib/pass.js').hash,
redirect = require('express-redirect'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
i18n = require('i18n-2'),
methodOverride = require('method-override'),
errorHandler = require('errorhandler'),
sass = require('node-sass'),
sassMiddleware = require('node-sass-middleware'),
session = require('express-session'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy = require('passport-facebook').Strategy;
// Define TacitServer
var TacitServer = new Object();
TacitServer.configs = {};
/*
 * SERVER - The Server used for shutdown etc
 * See: https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/
 */
var Server = express();
/*
* Server get prepareForShutdown
*/
Server.get('/prepareForShutdown', function(req, res) {
	if(req.connection.remoteAddress == "127.0.0.1"
			|| req.socket.remoteAddress == "127.0.0.1"
			// 0.4.7 oddity in https only
			|| req.connection.socket.remoteAddress == "127.0.0.1")
	{
		managePreparationForShutdown(function() {
			// don't complete the connection until the preparation is done.
			res.statusCode = 200;
			res.end();
		});
	}
	else {
		res.statusCode = 500;
		res.end();
	}
});
// Manage prepare for shutdown
var managePreparationForShutdown = function(callback) {
	// perform all the cleanup and other operations needed prior to shutdown,
	// but do not actually shutdown. Call the callback function only when
	// these operations are actually complete.
	try {
    TacitServer.app_server.close();
		console.log(TacitServer.configs.server_prefix + " - Shutdown app successful.");
	}
	catch(ex) {
		console.log(TacitServer.configs.server_prefix + " - Shutdown app failed.");
		console.log(ex);
	}
	try {
    TacitServer.api_server.close();
		console.log(TacitServer.configs.server_prefix + " - Shutdown api successful.");
	}
	catch(ex) {
		console.log(TacitServer.configs.server_prefix + " - Shutdown api failed.");
		console.log(ex);
	}
	console.log(TacitServer.configs.server_prefix + " - All preparations for shutdown completed.");
	callback();
};
/*
* APP - The Application
*/
var App = express();
/*
* APP DEVELOPMENT
*
* .bash_profile contains
* NODE_ENV=development
*
* or start server as follows
* NODE_ENV=development node server.js
*
* on Windows use
* set NODE_ENV=development
* check with
* echo %NODE_ENV%
*/
if('development' == App.settings.env){
	console.log("Using development configurations");

  // ... more

}
/*
* APP PRODUCTION
*
* .bash_profile contains
* NODE_ENV=production
*
* or start server as follows
* NODE_ENV=production node server.js
*
* on Windows use
* set NODE_ENV=production
* check with
* echo %NODE_ENV%
*/
if('production' == App.settings.env){
	console.log("Using production configurations");

  // ... more

}
/*
* API - The Application Programming Interface
*/
var Api = express();
// API All
Api.all('*', function(req, res, next){
	if (!req.get('Origin')) return next();
	// use "*" here to accept any origin
	res.set('Access-Control-Allow-Origin', '*');  // Accepts requests coming from anyone, replace '*' by configs.allowedHost to restrict it
	res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	res.set('X-Powered-By', 'Express');
	res.set('Content-Type', 'application/json; charset=utf8');
	// res.set('Access-Control-Allow-Max-Age', 3600);
	if ('OPTIONS' == req.method) return res.send(200);
	next();
});
// API Post
Api.post('/login', function(req, res){
	console.log(req.body);
	res.send(201);
});
/*
* CMD - The Command
*/
function cmd(request, response)
{
	var urlpath = url.parse(request.url).pathname;
	var param = url.parse(request.url).query;
	//    var localpath = path.join(process.cwd(), urlpath); // OLD
	var localpath = path.join(__dirname, urlpath);	// NEW
	fs.exists(localpath, function(result) { runScript(result, localpath, param, response)});
}
/*
* SENDERROR - The Sending of the Error
*/
function sendError(errCode, errString, response) {
	console.log(TacitServer.configs.server_prefix + " - sendError called");
	response.writeHead(errCode, {"Content-Type": "text/plain;charset=utf-8"});
	response.write(errString + "\n");
	response.end();
	return false;
}
/*
* SENDDATA - The Sending of the Data
*/
function sendData(err, stdout, stderr, response) {
	console.log(TacitServer.configs.server_prefix + " - sendData called");
	if(err) return sendError(500, stderr, response);
	response.writeHead(200,{"Content-Type": "text/plain;charset=utf-8"});
	response.write(stdout);
	response.end();
}
/*
* RUNSCRIPT - The Running of the Script
*/
function runScript(exists, file, param, response) {
	console.log(TacitServer.configs.server_prefix + " - runScript called");
	if(!exists) return sendError(404, 'File not found', response);
	var command = '';
	var extension = file.split('.').pop();
	switch(extension) {
	case 'php':
		command = 'php';
		break;
	case 'js':
		command = 'node';
		break;
	default:
		// nothing
	}
	runner.exec(command + " " + file + " " + param,
	function(err, stdout, stderr) {
		sendData(err, stdout, stderr, response);
	}
	);
}
/*
* ARGUMENTS - The Arguments
*/
function args(req, res) {
	console.log(TacitServer.configs.server_prefix + " - args called");
	var urlpath = url.parse(req.url).pathname;
	var param = url.parse(req.url).query;
	var localpath = path.join(process.cwd(), urlpath);
	path.exists(localpath, function(result) {
		console.log(TacitServer.configs.server_prefix + " - Process parameters: %p", param);
		runScript(result, localpath, param, res);
	});
}
// TacitServer setConfigs function
TacitServer.setConfigs = function setConfigs(configs) {
  TacitServer.configs = configs;
  // Server Prefix
  if(typeof TacitServer.configs.server_prefix === 'undefined'){
    var server_prefix = TacitServer.configs.server_prefix = "SERVER_PREFIX";
  }
  else {
  	var server_prefix = TacitServer.configs.server_prefix;
  }
  // Server Port
  if(typeof TacitServer.configs.server_port === 'undefined'){
  	//var server_port = process.env.PORT || 14080;
    var server_port = TacitServer.configs.server_port = process.env.PORT;
  }
  else {
  	var server_port = TacitServer.configs.server_port;
  }
  // App Port
  if(typeof TacitServer.configs.app_port === 'undefined'){
    //var app_port = process.env.PORT || 5000;
    var app_port = TacitServer.configs.app_port = process.env.PORT;
  }
  else {
    var app_port = TacitServer.configs.app_port;
  }
  // App List
  if(typeof TacitServer.configs.app_list === 'undefined'){
  	var app_list = {};
  }
  else {
  	var app_list = TacitServer.configs.app_list;
  }
  // Api Port
  if(typeof TacitServer.configs.api_port === 'undefined'){
    //var api_port = app_port+1 || 5001;
    var api_port = TacitServer.configs.api_port = app_port+1;
  }
  else {
    var api_port = TacitServer.configs.api_port;
  }
  // Api List
  if(typeof TacitServer.configs.api_list === 'undefined'){
  	var api_list = {};
  }
  else {
  	var api_list = TacitServer.configs.api_list;
  }
  // Command Port
  if(typeof TacitServer.configs.cmd_port === 'undefined') {
    //var cmd_port = app_port+2 || 5002;
    var cmd_port = TacitServer.configs.cmd_port = app_port+2;
  }
  else {
    var cmd_port = TacitServer.configs.cmd_port;
  }
  // Action List
  if(typeof TacitServer.configs.action_list === 'undefined'){
  	var action_list = TacitServer.configs.action_list = {};
  }
  else {
  	var action_list = TacitServer.configs.action_list;
  }
  // Model List
  if(typeof TacitServer.configs.model_list === 'undefined'){
  	var model_list = TacitServer.configs.model_list = {};
  }
  else {
  	var model_list = TacitServer.configs.model_list;
  }
  // Format List
  if(typeof TacitServer.configs.format_list === 'undefined'){
  	var format_list = TacitServer.configs.format_list = {};
  }
  else {
  	var format_list = TacitServer.configs.format_list;
  }
  // User List
  if(typeof TacitServer.configs.user_list === 'undefined'){
  	var user_list = TacitServer.configs.user_list = {};
  }
  else {
  	var user_list = TacitServer.configs.user_list;
  }
};
// TacitServer getConfigs function
TacitServer.getConfigs = function getConfigs() {
  return TacitServer.configs;
};
// TacitServer setRouter function
TacitServer.setRouter = function setRouter(router) {
  /**
  * ALL using router
  */
  // test
  try {
    App.use('/test', router.test);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Test Router: " + err);
  }
  // login
  try {
    App.use('/login', router.login);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Login Router: " + err);
  }
  // logout
  try {
    App.use('/logout', router.logout);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Logout Router: " + err);
  }
  // admin
  try {
    App.use('/admin', router.admin);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Admin Router: " + err);
  }
  // source
  try {
    App.use('/source', router.source);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Source Router: " + err);
  }
  // index, place last
  try {
    App.use('/', router.index);
  }
  catch(err) {
    console.log(TacitServer.configs.server_prefix + " - Index Router: " + err);
  }
};
// TacitServer listen function
TacitServer.listen = function listen() {
  TacitServer.app_server = App.listen(TacitServer.configs.app_port, function() {
  	console.log(TacitServer.configs.server_prefix + " - TacitServer app server listening on port %d in %s mode", TacitServer.configs.app_port, App.settings.env);
  });
  TacitServer.api_server = Api.listen(TacitServer.configs.api_port, function() {
  	console.log(TacitServer.configs.server_prefix + " - TacitServer api server listening on port %d in %s mode", TacitServer.configs.api_port, Api.settings.env);
  });
  TacitServer.cmd_server = http.createServer(cmd); // Usage: http://localhost:port/filename.extension?key=value
  TacitServer.cmd_server.listen(TacitServer.configs.cmd_port, function() {
  	console.log(TacitServer.configs.server_prefix + " - TacitServer cmd server listening on port %d", TacitServer.configs.cmd_port);
  });
};
// Add Server to TacitServer
TacitServer.Server = Server;
// Export TacitServer
module.exports = TacitServer;
