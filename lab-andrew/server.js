'use strict';

const debug = require('debug')('brew:server');
const express = require('express');
const bodyParser = require('body-parser');

const brewRouter = require('./route/brew-router');
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

app.use('/api/brew', brewRouter);
app.all('*', function(req, res) {
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function() {
  debug('listen');
  console.log('app running on port', port);
});

server.isRunning = true;
module.exports = server;
