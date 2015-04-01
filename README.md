# passport-http-jwt-bearer

[![Build Status](https://travis-ci.org/FloeDesignTechnologies/passport-http-jwt-bearer.svg?branch=master)](https://travis-ci.org/FloeDesignTechnologies/passport-http-jwt-bearer) [![Dependency Status](https://david-dm.org/FloeDesignTechnologies/passport-http-jwt-bearer.svg)](https://david-dm.org/FloeDesignTechnologies/passport-http-jwt-bearer) [![devDependency Status](https://david-dm.org/FloeDesignTechnologies/passport-http-jwt-bearer/dev-status.svg)](https://david-dm.org/FloeDesignTechnologies/passport-http-jwt-bearer#info=devDependencies)

JSON Web Token (JWT) Bearer Token for OAuth 2.0 user authentication strategy
for Passport, using [HTTP Bearer authentication](https://www.npmjs.org/package/passport-http-bearer)
and [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

This module lets you authenticate requests containing a JSON Web Token (JWT)
encoded and signed OAuth2 access token, in your Node.js applications.

Bearer tokens are typically used protect API endpoints, and are often issued
using OAuth 2.0.

JSON Web Toke (JWT) is a compact, URL-safe means of representing claims to be
transferred between two parties.  The claims in a JWT are encoded as a
JavaScript Object Notation (JSON) object that is used as the payload of a JSON
Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption
(JWE) structure, enabling the claims to be digitally signed or MACed and/or
encrypted.

This authentication strategy extend the [HTTP Bearer authentication](https://www.npmjs.org/package/passport-http-bearer)
to add verification of the JWT token. The verification of the token includes
signature, expiration, issuer and audience validations.

By plugging into Passport, bearer token support can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-http-jwt-bearer

## Usage

#### Configure Strategy

The HTTP JWT Bearer authentication strategy authenticates users using a bearer
token.  The strategy requires a secret (when using HMAC) or a PEM encoded
public key (when using RSA or ECDSA) to validate the signature of the token.
And a `verify` callback, which accepts that token and calls `done` providing a
user.  Optional `info` can be passed, typically including associated scope,
which will be set by Passport at `req.authInfo` to be used by later middleware
for authorization and access control.

    var JwtBearerStrategy require('passport-http-bearer')

     passport.use(new JwtBearerStrategy(
       secretOrPublicKey,
       function(token, done) {
         User.findById(token.sub, function (err, user) {
           if (err) { return done(err); }
           if (!user) { return done(null, false); }
           return done(null, user, token);
         });
       }
     ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'jwt-bearer'` strategy, to
authenticate requests.  Requests containing bearer tokens do not require
session support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/profile', 
      passport.authenticate('jwt-bearer', { session: false }),
      function(req, res) {
        res.json(req.user);
      });

#### Issuing Tokens

Bearer tokens are typically issued using OAuth 2.0. [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
is a toolkit for implementing OAuth 2.0 servers and issuing bearer tokens.  Once
issued, this module can be used to authenticate tokens as described above.

When issuing a JWT Token, the token is signed using either a secret shared with
consumers, or a private key. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
is a toolkit that can be used to produce JWT Token.

## Related Modules

- [OAuth2orize](https://github.com/jaredhanson/oauth2orize) — OAuth 2.0 authorization server toolkit
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JSON Web Token implementation

## Tests

    $ npm install
    $ npm test

## Credits

  - [Pierre Buyle](https://github.com/pbuyle)
  - [Jared Hanson](https://github.com/jaredhanson), author and maintainer of passport and passport-http-bearer.
  - [Matias Woloski](https://github.com/woloski), author and maintainer of jsonwebtoken.

## License

[The MIT License](http://opensource.org/licenses/MIT)
