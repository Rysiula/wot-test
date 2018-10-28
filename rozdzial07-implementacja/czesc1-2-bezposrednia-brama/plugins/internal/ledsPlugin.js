var resources = require('./../../resources/model');

var actuator, interval;
var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  observe(model); //#A

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('Wtyczka %s została zatrzymana!', pluginName);
};

function observe(what) {
  Object.observe(what, function (changes) {
    console.info('Wtyczka wykryła zmianę %s...', pluginName);
    switchOnOff(model.value); //#B
  });
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Zmieniono wartość %s na %s', pluginName, value);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(model.gpio, 'out'); //#D
  console.info('Uruchomiono sprzętowy sygnalizator %s!', pluginName);
};

function simulate() {
  interval = setInterval(function () {
    // Cyklicznie zmieniamy wartość na przeciwną.
    if (model.value) {
      model.value = false;
    } else {
      model.value = true;
    }
  }, localParams.frequency);
  console.info('Uruchomiono symulowany sygnalizator %s!', pluginName);
};

//#A To wywołanie inicjuje obserwację modelu dla diody LED.
//#B Ta funkcja nasłuchuje zmian modelu, a w przypadku ich wykrycia wywołuje funkcję switchOnOff.
//#C Zmiana stanu diody LED poprzez zmianę stanu portu GPIO.
//#D Nawiązanie połączenia z portem GPIO w trybie zapisu (wyjściowym).
