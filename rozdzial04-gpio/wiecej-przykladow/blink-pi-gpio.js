var gpio = require('pi-gpio'); //#A
var pin = 7;

function blink(outPin, frequency, status) { //#B
  gpio.write(outPin, status, function () { //#D
  console.log('Setting GPIO to: ' + status);
    setTimeout(function () { //#E
      status = (status + 1) % 2;
      blink(outPin, frequency, status);
    }, frequency);
  });
}

process.on('SIGINT', function () { //#F
  gpio.write(pin, 0, function () {
    gpio.close(pin); //#G
    console.log('Bye, bye!');
    process.exit();
  });
});

gpio.open(pin, "output", function (err) { //#C
  if (err) exit(err);
  blink(pin, 2000,1); //#H
});

// #A Zamiportowanie biblioteki do obsługi portów 
// #B Funkcja blink z parametrami określającymi pin który należy aktywować, częstotliwością błyskania oraz początkowym stanem diody
// #C Zainicjowanie pinu w trybie wyjściowym, po zakończeniu operacji zostanie wywołana funkcja anonimowa
// #D Zapis bieżącego stanu pinu
// #E Po zapisaniu stanu ustawiamy licznik czasu, który rekurencyjnie wywoła funkcję blink
// #F Nasłuchiwanie zdarzenia wyzwalanego gdy program ma zostać zakończony
// #G Zamknięcie portu GPIO przed zakończeniem programu
// #H Wywołanie funkcji blink dla pinu numer 7, z częstotliwością błyskania wynoszącą 2 sekundy
