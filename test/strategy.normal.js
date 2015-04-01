var chai = require('chai')
  , jwt = require('jsonwebtoken')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
  var secret = Math.random().toString(36).replace(/[^a-z]+/g, '');
  var strategy = new Strategy(
    secret,
    function(token, done) {
      if (token.sub % 2) {
        return done(null, { id: token.sub }, token);
      }
      return done(null, false);
    }
  );

  describe('handling a request with valid token in header', function() {
    var user
      , info;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret, {subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal(1);
    });

    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info).to.have.property('sub', 1);
    });
  });

  describe('handling a request with valid token in form-encoded body parameter', function() {
    var user
      , info;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.access_token = jwt.sign({}, secret, {subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal(1);
    });

    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info).to.have.property('sub', 1);
    });
  });

  describe('handling a request with valid credential in URI query parameter', function() {
    var user
      , info;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.access_token = jwt.sign({}, secret, {subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal(1);
    });

    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info).to.have.property('sub', 1);
    });
  });

  describe('handling a request with wrong token in header', function() {

    it('should fail with challenge when token is malformed', function(done) {
      chai.passport.use(strategy)
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="Invalid token (jwt malformed)"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer WRONG';
        })
        .authenticate();
    });

    it('should fail with challenge when token is expired', function(done) {
      chai.passport.use(strategy)
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="The access token expired"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret, {subject: 1, expiresInMinutes: -1});
        })
        .authenticate();
    });

    it('should fail with challenge when token signature is invalid', function(done) {
      chai.passport.use(strategy)
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="Invalid token (invalid signature)"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret + 'x', {subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

    it('should fail with challenge when token signature is not signed', function(done) {
      chai.passport.use(strategy)
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="Invalid token (jwt signature is required)"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret, {subject: 1, expiresInMinutes: 15, algorithm: 'none'});
        })
        .authenticate();
    });

    it('should fail with challenge when token audience does not match', function(done) {
      chai.passport.use(new Strategy(secret, {audience: 'foo'}, function(token, done) { done(null, false)}))
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="Invalid token (jwt audience invalid. expected: foo)"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret, {audience: 'bar', subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

    it('should fail with challenge when token issuer does not match', function(done) {
      chai.passport.use(new Strategy(secret, {issuer: 'foo'}, function(token, done) { done(null, false)}))
        .fail(function(challenge) {;
          expect(challenge).to.be.a.string;
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="Invalid token (jwt issuer invalid. expected: foo)"');
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer ' + jwt.sign({}, secret, {issuer: 'bar', subject: 1, expiresInMinutes: 15});
        })
        .authenticate();
    });

  });

  describe('handling a request without credentials', function() {
    var challenge;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(c) {
          challenge = c;
          done();
        })
        .req(function(req) {
        })
        .authenticate();
    });

    it('should fail with challenge', function() {
      expect(challenge).to.be.a.string;
      expect(challenge).to.equal('Bearer realm="Users"');
    });
  });

});
