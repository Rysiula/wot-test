var sensorLib = require('node-dht-sensor');

sensorLib.initialize(22, 12); //#A
var interval = setInterval(function () { //#B
  read();
}, 2000);

function read() {
  var readout = sensorLib.read(); //#C
  console.log('Temperatura: ' + readout.temperature.toFixed(2) + 'C, ' + //#D
    'wilgotność: ' + readout.humidity.toFixed(2) + '%');
};

process.on('SIGINT', function () {
  clearInterval(interval);
  console.log('Do zobaczenia!');
  process.exit();
});

//#A 22 oznacza DHT22/AM2302, 12 to numer GPIO Pi, do którego czujnik został podłączony.
//#B Utworzenie czasomierza, który będzie odczytywał wartości z czujnika co dwie sekundy.
//#C Odczyt wartości czujnika.
//#D Odczyt zawiera dwie wartości: temperaturę oraz wilgotność.
