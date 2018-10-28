var Gpio = require('onoff').Gpio,
  sensor = new Gpio(17, 'in', 'both');    //#A

sensor.watch(function (err, value) { //#B
  if (err) exit(err);
  console.log(value ? 'ktoś tu jest!' : 'już nie ma!');
});

function exit(err) {
  if (err) console.log('Wystąpił błąd: ' + err);
  sensor.unexport();
  console.log('Do zobaczenia!')
  process.exit();
}
process.on('SIGINT', exit);

// #A Inicjalizacja pinu 17. w trybie wejściowym, zastosowanie wartości 'both' oznacza, że interesują nas przerwania związane zarówno ze zmianą wartości na większą, jak i mniejszą.
// #B Nasłuchiwanie na zmiany wartości pinu 17., w momencie wykrycia zmiany zostaje wywołana anonimowa funkcja zwrotna, a do niej zostanie przekazana nowa wartość pinu.
