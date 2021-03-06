/**
 * Main application file
 */

'use strict';
var path = require('path');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

var hardware = require('./config/config.json').hardware;

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);

var sockets = require('./sockets')(server);

if (hardware) {
	var hardwareInterface = require('./hardware')(sockets);
	sockets.setHardwareInterface(hardwareInterface);
} 


require('./routes')(app, sockets);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;