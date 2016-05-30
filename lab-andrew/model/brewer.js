'use strict';

const uuid = require('node-uuid');
const debug = require('debug')('brew:brewer');
const AppError = require('../lib/app-error');

const Brewer = module.exports = function(coffeeOrigin) {
  debug('creating brewer');
  if(!coffeeOrigin) throw AppError.error400('brewer contructor requires content');
  this.id = uuid.v1();
  this.coffeeOrigin = coffeeOrigin.toUpperCase();
  this.brewMethods = this.selectBrewMethod();
};

Brewer.prototype.selectBrewMethod = function() {
  var brewMethods = {
    MEXICO: ['AeroPress'],
    ETHIOPIA: ['Chemex'],
    BRAZIL: ['French Press'],
    KENYA: ['Kalita Wave']
  };
  var selectedOrigin = Object.keys(brewMethods);
  var key;
  for (var i = 0; i < selectedOrigin.length; i++){
    key = selectedOrigin[i];
    if (this.coffeeOrigin.toUpperCase() === key) {
      return brewMethods[key];
    }
  }
};
