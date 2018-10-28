// wersja ostateczna
var express = require('express'),
  router = express.Router(),
  resources = require('./../resources/model');

router.route('/').get(function (req, res, next) {
  req.result = resources.pi.sensors; //#A
  next(); //#B
});

router.route('/pir').get(function (req, res, next) {
  req.result = resources.pi.sensors.pir;
  next();
});

router.route('/temperature').get(function (req, res, next) {
  req.result = resources.pi.sensors.temperature;
  next();
});

router.route('/humidity').get(function (req, res, next) {
  req.result = resources.pi.sensors.humidity;
  next();
});

module.exports = router;

//#A Przypisanie wyniku do nowej właściwości obiektu req, przekazywanego od jednego oprogramowania warstwy pośredniej do drugiego.
//#B Wywołanie następnego oprogramowania warstwy pośredniej; framework zapewnia, że oprogramowanie to będzie mieć dostęp do obiektów req (włącznie z właściwością req.result) oraz res.



/*
// Wersja początkowa
var express = require('express'),
  router = express.Router(), //#A
  resources = require('./../resources/model');

router.route('/').get(function (req, res, next) { //#B
  res.send(resources.pi.sensors);  //#C
});

router.route('/pir').get(function (req, res, next) { //#D
  res.send(resources.pi.sensors.pir);
});

router.route('/temperature').get(function (req, res, next) { //#E
  res.send(resources.pi.sensors.temperature);
});

router.route('/humidity').get(function (req, res, next) { //#E
  res.send(resources.pi.sensors.humidity);
});

module.exports = router; //#F

//#A Wczytanie Express i utworzenie obiektu Router w celu zdefiniowania ścieżek od zasobów.
//#B Utworzenie nowej trasy dla żądań GET dla wszystkich czunikow i dołączenie funkcji zwrotnej.
//#C Zwrócenie modelu czujników w przypadku odebrania żądania odwołującego się do tej trasy.
//#D Ta trasa obsługuje pasywny czujnik podczerwieni.
//#E Te trasy obsługują czujnik temperatury i wilgotności.
//#F Wyeksportowanie obiektu router, aby udostępnić go we wszystkich plikach, które wczytają go używając require.
*/