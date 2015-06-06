/*
* TACIT SERVER - The Tacit Server module
* @module tacit-server
*
* Usage
* var TacitServer = require("./tacitserver");
*
* // you can use the 'new' keyword
* var ts = new TacitServer(5); // tacit server object
* var s = ts.Server(); // server object
* var config = {'test':true};
* s.setConfig(config); // sets the server config
*
* // or you can skip it!
* var ts = TacitServer(5); // tacit server object
* var s = ts.Server(); // server object
* var config = {'test':true};
* s.setConfig(config); // sets the server config
*/

// See also http://www.sitepoint.com/understanding-module-exports-exports-node-js/
// See also http://stackoverflow.com/questions/20534702/node-js-use-of-module-exports-as-a-constructor

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
/*
 * SERVER - The Server used for shutdown etc
 * See: https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/
 */
//function Server() {
//  if(!(this instanceof Server)){
//    return new Server();
//  };
//  /*
//   * CONFIGS - The Configurations
//   */
//  this.config = {}; // does not show as a property, but can be accessed
//};
var Server = new Object();
Server.config = {};
// Server setConfig function
Server.setConfig = function setConfig(config) {
  Server.config = config;
};
// Server getConfig function
Server.getConfig = function getConfig() {
  return Server.config;
};
// Define TacitServer
function TacitServer() {
  if(!(this instanceof TacitServer)){
    return new TacitServer();
  };
  /*
   * CONFIGS - The Configurations
   */
  this.config = {}; // does not show as a property, but can be accessed
};
// TacitServer setConfig function
TacitServer.setConfig = function setConfig(config) {
  TacitServer.config = config;
};
// TacitServer getConfig function
TacitServer.getConfig = function getConfig() {
  return TacitServer.config;
};
// TacitServer Test function 1
TacitServer.testFunction1 = function testFunction1(string) {
  return String(string);
};
// TacitServer Test object 1
TacitServer.testObject1 = function testObject1(string) {
  return String(string);
};
// Add Server to TacitServer
TacitServer.Server = function Server() {
  return Server;
};
// Export TacitServer
module.exports = TacitServer;
