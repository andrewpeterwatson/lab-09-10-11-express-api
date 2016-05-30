'use strict';

const AppError = require('./app-error');
const debug = require('debug')('note:error-response');

module.exports = function(req, res, next) {
  res.sendError = function(err){
    debug('sendError');
    console.error(err.message);
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send();
    }

  };
  next();
};
