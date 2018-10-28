var onoff = require('onoff'); //#A

var Gpio = onoff.Gpio,
  led = new Gpio(4, 'out'), //#B
  interval;

interval = setInterval(function () { //#C
  var value = (led.readSync() + 1) % 2; //#D
  led.write(value, function() { //#E
    console.log("Stan diody LED został zmieniony na: " + value);
  });
}, 2000);

process.on('SIGINT', function () { //#F
  clearInterval(interval);
  led.writeSync(0); //#G
  led.unexport();
  console.log('Do zobaczenia!');
  process.exit();
});

// #A Zaimportowanie biblioteki onoff.
// #B Inicjalizacja pinu 4. jako pinu wyjściowego.
// #C Ta funkcja czasomierza będzie wywoływana co każde 2 sekundy.
// #D Synchroniczny odczyt wartości pinu 4. i przekształcenie 1 na 0 lub 0 na 1.
// #E Asynchroniczny zapis nowej wartości na pinie 4.
// #F Nasłuchiwanie na zdarzenie generowane przez naciśnięcie kombinacji Ctrl+C.
// #G Prawidłowe zamknięcie pinu GPIO przed zakończeniem programu.