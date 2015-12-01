// setup

// import express
var express = require('express');

// create our app with express
var app = express();

// path
var path = require('path');

// log requests to the console (express4)
var morgan = require('morgan');

// port
var port = process.env.PORT || 8000;

// set the static files location /public/img will be /img for users
app.use(express.static(path.join(__dirname, '../client')));


// log every request to the console
app.use(morgan('dev'));


// ROUTES *************************

// get application
app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendfile(path.resolve(__dirname, '../client/index.html'));
});

// listen (start app with node server.js)
app.listen(port);
console.log('App listening on port %s', port);