'use strict';

// node moudles
// npm modules
// app modules
// globals && then modules dependent on globals
const Router = require('express').Router;
const debug = require('debug')('brew:brew-router');
const jsonParser = require('body-parser').json();

const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Brewer = require('../model/brewer');

const brewRouter = module.exports = new Router();

function createBrewer(reqBody) {
  debug('createBrewer');
  return new Promise(function(resolve, reject) {
    var brewer;
    try {
      brewer = new Brewer(reqBody.coffeeOrigin);
    } catch (err) {
      return reject(err);
    }
    storage.setItem('brewer', brewer)
    .then(function(brewer) {
      resolve(brewer);
    }).catch(function(err) {
      reject(err);
    });
  });
}

brewRouter.post('/', jsonParser, function(req, res) {
  debug('hit endpoint /api/brew POST');
  createBrewer(req.body).then(function(brewer) {
    console.log('brewing', brewer);
    res.status(200).json(brewer);
  }).catch(function(err) {
    console.error(err.mesagee);
    if(AppError.isAppError(err)){
      res.status(err.statusCode)
      .send(err.responseMessage);
      return;
    }
    res.status(500)
    .send('internal server error');
  });
});

brewRouter.get('/:id', jsonParser, function(req, res) {
  storage.fetchItem('brewer', req.params.id)
  .then(function(brew) {
    res.status(200).json(brew);
  }).catch(function(err) {
    res.sendError(err);

  });
});
brewRouter.get('/', function(req, res) {
  const err = AppError.error400('bad request');
  res.sendError(err);
});

brewRouter.put('/:id', jsonParser, function(req, res) {
  if(!req.body.coffeeOrigin) {
    const err = AppError.error400('bad request');
    res.sendError(err);
  }
  storage.fetchItem('brewer', req.params.id)
  .then(function(brewer) {
    brewer.coffeeOrigin = req.body.coffeeOrigin;
    res.status(200).json(brewer);
  }).catch(function(err) {
    res.sendError(err);
  });
});
