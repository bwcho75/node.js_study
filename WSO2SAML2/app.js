var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , SamlStrategy = require('passport-saml').Strategy
  , fs = require('fs');
  

var users = [
    { id: 'admin', givenName: 'bob', email: 'admin' }
  , { id: 'terry', givenName: 'joe', email: 'joe@example.com' }
];

function findById(id, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://localhost:9443/samlsso',
    issuer: 'passport-saml',
    protocol: 'http://',
    //identifierFormat :'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
    identifierFormat :'urn:oasis:names:tc:SAML:2.0:nameid-format:entity'
    //cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w=='/*,
    //privateCert: fs.readFileSync('./cert.pem', 'utf-8')*/
  },
  function(profile, done) {
    console.log("Auth with", profile);
    console.log('Name Id',profile.nameID);
    if (!profile.nameID) {
      return done(new Error("No nameId found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findById(profile.nameID, function(err, user) {
	    	console.log('User ',user);
	    	console.log('done function',done);
	    	
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      })
    });
  }
));

var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/error', failureFlash: true,samlFallback:'login-request' }),
  function(req, res) {
    res.redirect('/welcome');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/callback_error', failureFlash: true }),
  function(req, res) {
    res.redirect('/welcome');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log("Server listening in http://localhost:3000");
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
