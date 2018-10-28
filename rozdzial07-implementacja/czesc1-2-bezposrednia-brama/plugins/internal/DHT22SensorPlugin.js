var resources = require('./../../resources/model'),
  utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Temperatura i wilgoność';
var localParams = {'simulate': false, 'frequency': 5000};

exports.start = function (params) {
  localParams = params;
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
    sensor.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
 var sensorDriver = require('node-dht-sensor');
  var sensor = {
    initialize: function () {
      return sensorDriver.initialize(22, model.temperature.gpio); //#A
    },
    read: function () {
      var readout = sensorDriver.read(); //#B
      model.temperature.value = parseFloat(readout.temperature.toFixed(2));
      model.humidity.value = parseFloat(readout.humidity.toFixed(2)); //#C
      showValue();

      setTimeout(function () {
        sensor.read(); //#D
      }, localParams.frequency);
    }
  };
  if (sensor.initialize()) {
    console.info('Uruchomiono sprzętowy czujnik %s!', pluginName);
    sensor.read();
  } else {
    console.warn('Nie udało się zainicjować czujnika!');
  }
};

function simulate() {
  interval = setInterval(function () {
    model.temperature.value = utils.randomInt(0, 40);
    model.humidity.value = utils.randomInt(0, 100);
    showValue();
  }, localParams.frequency);
  console.info('Uruchomiono symulowany czujnik %s!', pluginName);
};

function showValue() {
  console.info('Temperatura: %s C, wilgotność %s \%',
    model.temperature.value, model.humidity.value);
};

//#A Inicjalizacja sterownika dla DHT22 działającego na porcie GPIO 12 (zgodnie z tym co podano w modelu)
//#B Wczytanie wartości z czujników.
//#C Aktualizacja modelu poprzez zapisanie w nim nowych wartości temperatury i wilgotności; trzeba zwrócić uwagę na to, że przy okazji zostaną powiadomieni wszyscy obserwatorzy.
//#D Sterownik nie udostępnia przerwań, dlatego też wartości odczytujemy z czujników cyklicznie, co określony czas, używając do tego zwyczajnej funkcji timeout oraz sensor.read() jako funkcji zwrotnej.
