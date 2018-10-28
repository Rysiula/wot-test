var gpio = require("pi-gpio");

pin = 11;

function readProximity() {
  gpio.open(pin, "input", function (err) { //#A
    gpio.read(pin, function (err, value) { //#B
      if (err) exit(err);
      console.log(value ? 'Ktoś tu jest!' : 'Już nie!'); //#C
      readProximity();
    });
  });
}

function exit(err) {
  gpio.close(pin);
  if (err) console.log('Wystąpił błąd: ' + err);
  console.log('Do zobaczenia!')
  process.exit();
}
process.on('SIGINT', exit);

readProximity();

// #A Otworzenie GPIO w trybie odczytu
// #B Odczytanie z pinu wartości liczbowej (0 lub 1)
// #C Jeśli czujnik PIR wykryje ciepłe ciało, to zwróconą wrtością będzie 1, w przeciwnym razie wartością bęzie 0