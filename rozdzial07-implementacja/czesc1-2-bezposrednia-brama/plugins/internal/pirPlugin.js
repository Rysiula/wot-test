var resources = require('./../../resources/model');

var interval, sensor;
var model = resources.pi.sensors.pir;
var pluginName = resources.pi.sensors.pir.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) { //#A
  localParams = params;
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () { //#A
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    sensor.unexport();
  }
  console.info('Wtyczka %s została zatrzymana!', pluginName);
};

function connectHardware() { //#B
  var Gpio = require('onoff').Gpio;
  sensor = new Gpio(model.gpio, 'in', 'both'); //#C
  sensor.watch(function (err, value) { //#D
    if (err) exit(err);
    model.value = !!value;
    showValue();
  });
  console.info('Uruchomiono sprzętowy czujnik %s!', pluginName);
};

function simulate() { //#E
  interval = setInterval(function () {
    model.value = !model.value;
    showValue();
  }, localParams.frequency);
  console.info('Uruchomiono symulowany czujnik %s!', pluginName);
};

function showValue() {
  console.info(model.value ? 'ktoś tu jest!' : 'już nie ma!');
};

//#A Te funkcje odpowiednio uruchamiają i zatrzymują wtyczkę; powinny być one dostępne w innych plikach Node.js, więc je eksportujemy.
//#B Wczytanie i podłączenie faktycznego sterownika sprzętowego oraz jego konfiguracja.
//#C Konfiguracja portu GPIO, do którego jest podłączony czujnik PIR.
//#D Rozpoczęcie nasłuchiwania na zdarzenia GPIO; zajście zdarzenia spowoduje wywołanie funkcji zwrotnej.
//#E Ta funkcja pozwala wtyczce działać w trybie symulacji czujnika. Jest ona bardzo wygodna na etapie pisania aplikacji lub kiedy chcemy ją przetestować bez podłączania czujników, na przykład na laptopie.
