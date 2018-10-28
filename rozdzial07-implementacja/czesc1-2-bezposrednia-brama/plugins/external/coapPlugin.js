var utils = require('./../../utils/utils.js'),
  resources = require('./../../resources/model');

var interval, me, pluginName, pollInterval;
var localParams = {'simulate': false, 'frequency': 5000};

function connectHardware() {
  var coap = require('coap'),
    bl = require('bl'); //#A

  var sensor = {
    read: function () { //#B
      coap
        .request({ //#C
          host: 'localhost',
          port: 5683,
          pathname: '/co2',
          options: {'Accept': 'application/json'}
        })
        .on('response', function (res) { //#D
          console.info('Kod odpowiedzi CoAP', res.code);
          if (res.code !== '2.05')
            console.log("Błąd komunikacji z usługą CoAP: %s", res.code);
          res.pipe(bl(function (err, data) { //#E
            var json = JSON.parse(data);
            me.value = json.co2;
            showValue();
          }));
        })
        .end();
    }
  };
  pollInterval = setInterval(function () { //#F
    sensor.read();
  }, localParams.frequency);
};

function configure() { //#G
  utils.addDevice('coapDevice', 'Urządzenie CoAP',
    'Urządzenie CoAP',
    {
      'co2': {
        'name': 'Czujnik CO2',
        'description' : 'Czujnik CO2 w powietrzu',
        'unit': 'ppm',
        'value': 0
      }
    });
  me = resources.things.coapDevice.sensors.co2;
  pluginName = resources.things.coapDevice.name;
};

//#A Wczytanie bibliotek CoAP i BL (biblioteki pomocniczej Buffer).
//#B Utworzenie obiektu czujnika posiadającego funkcję read.
//#C Funkcja read wykonuje żądanie UDP, wywołując funkcję coap i przekazując do niej odpowiednie parametry; ‘localhost’ należy zastąpić adresem IP komputera symulującego urządzenie CoAP (na przykład używanego laptopa).
//#D Kiedy urządzenie CoAP przesyła wynik, generowane jest zdarzenie ‘response’.
//#E Pobranie wyników i aktualizacja modelu.
//#F Rozpoczęcie regularnego odpytywania urządzenia CoAP i pobieranie wyników pomiaru CO2.
//#G Dodanie zasobów zarządzanych przez tę wtyczkę do modelu.


exports.start = function (params, app) {
  localParams = params;
  configure(app);

  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    clearInterval(pollInterval);
  }
  console.info('Zatrzymano czujnik %s!', pluginName);
};

function simulate() {
  interval = setInterval(function () {
    me.co2 = utils.randomInt(0, 1000);
    showValue();
  }, localParams.frequency);
  console.info('Uruchomiono symulowany czujnik %s!', pluginName);
};

function showValue() {
  console.info('Poziom CO2: %s ppm', me.value);
};