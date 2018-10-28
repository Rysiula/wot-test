var passport = require('passport'),
  util = require('util'),
  FacebookStrategy = require('passport-facebook').Strategy,
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  auth = require('../middleware/auth'),
  methodOverride = require('method-override');

var acl = require('../config/acl.json'); //#A
var facebookAppId = '446871648832920'; //#A
var facebookAppSecret = '7499c233a1e2c4d8234dedca5e6a0cc3'; //#A
var socialNetworkName = 'facebook'; //#A
var callbackResource = '/auth/facebook/callback'; //#A
var callbackUrl = 'https://localhost:' + acl.config.sourcePort + callbackResource; //#A


module.exports.setupFacebookAuth = setupFacebookAuth;
function setupFacebookAuth(app) {
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
  app.use(passport.initialize()); //#B
  app.use(passport.session());

  passport.serializeUser(function (user, done) { //#C
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
        clientID: facebookAppId, //#D
        clientSecret: facebookAppSecret,
        callbackURL: callbackUrl //#E
      },
      function (accessToken, refreshToken, profile, done) {

        auth.checkUser(socialId(profile.id), accessToken, function (err, res) { //#F
          if (err) return done(err, null);
          else return done(null, profile);
        });
      }));

  app.get('/auth/facebook',
    passport.authenticate('facebook'), //#G
    function (req, res) {}); //#H

  app.get(callbackResource, //#I
    passport.authenticate('facebook', {session: true, failureRedirect: '/login'}),
    function (req, res) {
      res.redirect('/account');
    });

  app.get('/account', ensureAuthenticated, function (req, res) { //#J
    auth.getToken(socialId(req.user.id), function (err, user) {
      if (err) res.redirect('/login');
      else {
        req.user.token = user.token;
        res.render('account', {user: req.user});
      }
    });
  });

  function socialId(userId) { //#K
    return socialNetworkName + ':' + userId;
  };

  app.get('/', ensureAuthenticated, function (req, res) {
    res.render('index', {user: req.user});
  });

  app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

};

// #A Zmienne konfiguracyjne: identyfikator aplikacji Facebooka, klucz tajny aplikacji, nazwa, adres URL wywoływany po uwierzytelnieniu użytkownika.
// #B Inicjalizacja modułu Passport i umożliwienie przechowywania danych użytkownika w sesji.
// #C Gdyby istniała baza danych użytkowników, to te dwie metody byłyby używane do ich wczytywania i zapisywania.
// #D Dane używane do uwierzytelnienia tworzonego pośrednika jako aplikacji Facebooka. 
// #E Ten adres URL zostanie wywołany przez Facebook po pomyślnym zalogowaniu.
// #F Funkcja "weryfikująca", wywoływana przez framework po pomyślnym uwierzytelnieniu przez pośrednika; sprawdzamy w niej czy pośrednik zna użytkownika, a jeśli tak to zapisujemy ich żetony.
// #G Uruchomienie procesu uwierzytelniania i przekierowanie użytkownika na stronę facebook.com.
// #H Facebook.com przekieruje użytkownika na adres callbackUrl, zatem ta funkcja nigdy nie zostanie wywołana!
// #I Ta trasa zostanie wywołana przez Facebook po uwierzytelnieniu użytkownika. Nieudane logowanie zakończy się przekierowaniem na adres /login, a udane na stronę /account.
// #J Dla zalogowanego użytkownika zostaje pobrany jego żeton i wyświetlona strona jego konta; w przeciwnym razie użytkownik zostaje przekierowany na adres /login.
// #K Unikalny identyfikator społecznościowy jest tworzony poprzez połączenie identyfikatora użytkownika w sieci społecznościowej oraz nazwy tej sieci.