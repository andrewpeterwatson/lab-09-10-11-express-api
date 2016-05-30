'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const server = require('../server');
const storage = require('../lib/storage');
const Brewer = require('../model/brewer');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/brewer`;
const createTempBrewer = (done) => {
  this.tempBrewer = new Brewer('kenya');
  storage.setItem('brewer', this.tempBrewer);
  done();
};

describe('Testing the module brew-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        console.log(`Server running on PORT:${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });
  describe('Testing for bad route', function() {
    it('should return status 404', function(done) {
      request.get(`${baseUrl}/bad route`)
      .end((req, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('testing POST /api/brewer', function() {
    after((done) => {
      storage.pool = {};
      done();
    });
    it('Should return a brew method', function(done) {
      request.post(baseUrl)
    .send({coffeeOrigin: 'kenya'})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.brewMethods[0]).to.equal('Kalita Wave');
      expect(!!res.body.id);
      done();
    });
    });
  });

  describe('Testing POST /api/brewer', function() {
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return bad request', function(done) {
      request.post(baseUrl)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET /api/brewer', function() {
    before((done) => {
      this.tempBrewer = new Brewer('kenya');
      storage.setItem('brewer', this.tempBrewer);
      done();
    });
    it('should return a brewer', (done) => {
      request.get(`${baseUrl}/${this.tempBrewer.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.brewMethods[0]).to.equal(this.tempBrewer.brewMethods[0]);
        expect(res.body.id).to.equal(this.tempBrewer.id);
        done();
      });
    });
  });
  describe('testing GET /api/brewer', function() {
    before((done) => {
      createTempBrewer(done);
    });
    it('should return not found', (done) => {
      request.get(`${baseUrl}/12345`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('testing GET /api/brewer', function() {
    before((done) => {
      createTempBrewer(done);
    });
    it('should return not found', (done) => {
      request.get(`${baseUrl}/`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('Testing PUT /api/brewer', function() {
    before((done) => {
      this.tempBrewer = new Brewer('kenya');
      storage.setItem('brewer', this.tempBrewer);
      done();
    });
    it('should return a status 200', (done) => {
      request.put(`${baseUrl}/${this.tempBrewer.id}`)
      .send({coffeeOrigin: 'Mexico'})
      .end((req, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.coffeeOrigin).to.equal('Mexico');
        done();
      });
    });
  });
  describe('Testing PUT /api/brewer', function() {
    before((done) => {
      this.tempBrewer = new Brewer('kenya');
      storage.setItem('brewer', this.tempBrewer);
      done();
    });
    it('should return a status 200', (done) => {
      request.put(`${baseUrl}/${this.tempBrewer.id}`)
      .send(null)
      .end((req, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
});
