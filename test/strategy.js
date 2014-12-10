var Strategy = require('../lib/strategy');

describe('Strategy', function() {
  var strategy = new Strategy('secret', function(){});
  it('should be named jwt-bearer', function() {
    expect(strategy.name).to.equal('jwt-bearer');
  });
  it('should throw if constructed without a secret or public key', function() {
    expect(function() {
      new Strategy();
    }).to.throw(TypeError, 'HTTPJwtBearerStrategy requires a string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA callback');
  });
  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      new Strategy('secret');
    }).to.throw(TypeError, 'HTTPJwtBearerStrategy requires a verify callback');
  });
});