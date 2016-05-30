'use strict';

const debug = require('debug')('brew:server');
const express = require('express');
const errorResponse = require('./lib/err-response');
const morgan = require('morgan');

const brewRouter = require('./route/brew-router');
const port = process.env.PORT || 3000;
const app = express();

app.use(errorResponse);
app.use(morgan('dev'));
app.use('/api/brewer', brewRouter);

app.all('*', function(req, res) {
  debug('hit 404 route');
  res.status(404).send('not found');
});

const server = app.listen(port, function() {
  debug('listen');
  console.log('app running on port', port);
});

server.isRunning = true;
module.exports = server;
