var express = require('express'),
  router = express.Router(),
  resources = require('./../resources/model');

router.route('/').get(function (req, res, next) {
  req.result = resources.pi.actuators;
  next();
});

router.route('/leds').get(function (req, res, next) {
  req.result = resources.pi.actuators.leds;
  next();
});

router.route('/leds/:id').get(function (req, res, next) { //#A
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put(function(req, res, next) { //#B
  var selectedLed = resources.pi.actuators.leds[req.params.id];
  selectedLed.value = req.body.value; //#C
  req.result = selectedLed;
  next();
});

module.exports = router;

//#A Funkcja zwrotna obsługująca żądania GET skierowane do diody LED.
//#B Funkcja zwrotna obsługująca żądania PUT skierowane do diody LED.
//#C Aktualizacja wartości wybranej diody LED w modelu.


/*
//wersja początkowa:

var express = require('express'),
router = express.Router(),
resources = require('./../resources/model');

router.route('/').get(function (req, res, next) { // #A
 res.send(resources.pi.actuators); // #B
});

router.route('/leds').get(function (req, res, next) { // #C
  res.send(resources.pi.actuators.leds);
});

router.route('/leds/:id').get(function (req, res, next) { //#D
  res.send(resources.pi.actuators.leds[req.params.id]); //#E
});

module.exports = router;

//#A Utworzenie nowej trasy dla żądań GET.
//#B Zwrócenie modelu czujników w przypadku odebrania żądania odwołującego się do tej trasy.
//#C Ta trasa obsługuje listę diod LED.
//#D Przy użyciu :id wstrzykujemy do ścieżki zmienną z numerem diody LED.
//#E Zmienne ścieżki są dostępne przy użyciu req.params.id, używamy tej wartości by wybrać z modelu odpowiedni model i zwrócić go.

*/