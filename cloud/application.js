// Main Start point into the app
var webapp = require('fh-webapp');
var express = require('express');
$fh = require('fh-api');
var mainjs = require('./main');

var app = module.exports = express();

// CORS middleware
//
// This Allows `FHC Local` to work, as cloud is on port 8001
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};

// Use Express to parse various params and allow CORS
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
});

// Set up default routes so app can work as before
//
// (with Exported functions in main.js used with `$fh.act`)
app.use('/sys', webapp.sys(mainjs));
app.use('/mbaas', webapp.mbaas);
app.use('/cloud', webapp.cloud(mainjs));

// this will set up a series of routes under `/users`
//
require('./users').routes(app);
require('./auth').routes(app);

module.exports = app.listen(process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001);