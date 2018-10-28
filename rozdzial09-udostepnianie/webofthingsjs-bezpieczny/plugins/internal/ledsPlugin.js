var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator, model;

var LedsPlugin = exports.LedsPlugin = function (params) { //#A
  CorePlugin.call(this, params, 'leds',
    stop, simulate, ['ledState'], switchOnOff); //#B
  model = this.model;
  this.addValue(false);
};
util.inherits(LedsPlugin, CorePlugin); //#C

function switchOnOff(value) {
  var self = this;
  if (!this.params.simulate) {
    actuator.write(value.state === true ? 1 : 0, function () {
      self.addValue(value.state); //#D
    });
  } else {
    self.addValue(value.state);
  }
  value.status = 'completed'; //#E
  console.info('Zmiana wartości diody %s na %s', self.model.name, value.state);
};

function stop() {
  actuator.unexport();
};

function simulate() {
  this.addValue(false);
};

LedsPlugin.prototype.createValue = function (data){
  return {"1" : data, "2" : false, "timestamp" : utils.isoTimestamp()};
};

LedsPlugin.prototype.connectHardware = function () { //#F
  var Gpio = require('onoff').Gpio; //#G
  var self = this;
  actuator = new Gpio(self.model.values['1'].customFields.gpio, 'out');
  console.info('Sprzętowy element wykonawczy %s został uruchomiony!', self.model.name);
};

//#A Wywołanie funkcji inicjalizującej wtyczki nadrzędnej (corePlugin.js).
//#B W jej wywołaniu przekazywana jest właściwość, która będzie aktualizowana (leds) oraz akcje, które tworzona wtyczka chce obserwować (ledState) wraz z implementacją, którą należy wykonać kiedy wskazana akcja (ledState) zostanie utworzona (switchOnOff).
//#C Zapewnienie, że wtyczka LedPlugin będzie dziedziczyć wszystkie możliwości funkcjonalne z modułu corePlugin.js.
//#D Dodanie nowej danej do właściwości w modelu.
//#E Zmiana statusu na 'completed' (zakończony) kiedy stan diody LED został zmieniony.
//#F Rozszerzenie funkcji connectHardware z modułu corePlugin.js.
//#G Zmiana stanu diody LED przy użyciu możliwości biblioteki onoff.

