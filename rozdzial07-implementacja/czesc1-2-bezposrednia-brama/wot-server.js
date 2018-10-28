// wersja ostateczna
var httpServer = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model');

// wtyczki wewnętrzne
var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  pirPlugin = require('./plugins/internal/pirPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'); //#A

// Wtyczki wewnętrzne dla czujników/sygnalizatorów/aktuatorów podłączonych do portów GPIO Pi.
// W razie testowania kodu z użyciem rzeczywistych czujników, koniecznie należy zmienić 
// wartość 'simulate' na 'false'.
pirPlugin.start({'simulate': true, 'frequency': 2000}); //#B
ledsPlugin.start({'simulate': true, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': true, 'frequency': 10000}); //#B

// wtyczki zewnętrzne
var coapPlugin = require('./plugins/external/coapPlugin');
coapPlugin.start({'simulate': false, 'frequency': 10000});

// serwer HTTP 
var server = httpServer.listen(resources.pi.port, function () {
  console.log('Uruchomiono serwer HTTP...');

  // serwer Websocket
  wsServer.listen(server);

  console.info('Twoje webowe Pi jest skonfigurowane i działa na porcie %s', resources.pi.port);
});
//#A Wczytanie wszystkich niezbędnych wtyczek.
//#B Uruchomienie wtyczek z użyciem obiektów zawierających odpowiednie parametry, w tym przypadku uruchamiany je na laptopie, więc wtyczki mają działać w trybie symulacji.



/*
 // wersja początkowa:
 var httpServer = require('./servers/http'), //#A
 resources = require('./resources/model');

 var server = httpServer.listen(resources.pi.port, function () { //#B
  console.info('Twoje webowe Pi jest uruchomione i działa na porcie %s', resources.pi.port); //#C
 });

 //#A Wczytanie serwera HTTP i modelu.
 //#B Uruchomienie serwera HTTP poprzez wywołanie funkcji listen() obiektu aplikcji Express.
 //#C Po uruchomieniu serwera zostanie wywołana funkcja zwrotna.
 */

