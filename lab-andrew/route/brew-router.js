'use strict';

const Router = require('express').Router;
const brewRouter = module.exports = new Router();
const debug = require('debug')('brew:brew-router');
const bodyParser = require('body-parser').json();

const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Brewer = require('../model/brewer');

function createBrewer(reqBody) {
  debug('createBrewer');
  return new Promise(function(resolve, reject) {
    var brewer;
    try {
      brewer = new Brewer(reqBody.coffeeOrigin);
    } catch (err) {
      reject(err);
    }
    storage.setItem('brew', brewer)
    .then(function(brewer) {
      resolve(brewer);
    }).catch(function(err) {
      reject(err);
    });
  });
}

brewRouter.post('/', bodyParser, function(req, res) {
  console.log('hit POST');
  debug('hit endpoint /api/brew POST');
  createBrewer(req.body).then(function(brewer) {
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

brewRouter.get('/:id', function(req, res) {
  storage.fetchItem('brew', req.params.id)
  .then(function(brew) {
    res.status(200).json(brew);
  }).catch(function(err) {
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode)
      .send(err.responseMessage);
      return;
    }
    res.status(500)
    .send('interal server error');
  });
});
