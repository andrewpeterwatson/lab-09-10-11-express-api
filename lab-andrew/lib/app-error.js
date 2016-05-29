'use strict';

const debug = require('debug')('brew:app-error');

const AppError = module.exports = function(msg, statusCode, responseMessage) {
  debug('creating app error');
  Error.call(this);
  this.message = msg;
  this.statusCode = statusCode;
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype);

AppError.isAppError = function(err) {
  debug('isAppError');
  return err instanceof AppError;
};

AppError.error400 = function(message) {
  debug('error400');
  return new AppError(message, 400, 'bad request');
};
AppError.error404 = function(message) {
  debug('error404');
  return new AppError(message, 404, 'not found');
};
AppError.error500 = function(message) {
  debug('error500');
  return new AppError(message, 500, 'server error');
};
