var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs');


var createServer = function (port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;
  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins(); //#A

  if(secure) {
    var https = require('https'); //#B
    var certFile = './resources/change_me_caCert.pem'; //#C
    var keyFile = './resources/change_me_privateKey.pem'; //#D
    var passphrase = 'webofthings'; //#E

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };

    return server = https.createServer(config, restApp) //#F
      .listen(port, function () {
        wsServer.listen(server); //#G
        console.log('Bezpieczny serwer WoT uruchomiony na porcie %s', port);
    })
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(process.env.PORT || port, function () {
        wsServer.listen(server);
        console.log('Niebezpieczny serwer WoT uruchomiony na porcie %s', port);
    })
  }
};

function initPlugins() {
  var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
  var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

  pirPlugin = new PirPlugin({'simulate': true, 'frequency': 5000});
  pirPlugin.start();

  ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 5000});
  ledsPlugin.start();

  dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 5000});
  dht22Plugin.start();
}

module.exports = createServer;

process.on('SIGINT', function () {
  ledsPlugin.stop();
  pirPlugin.stop();
  dht22Plugin.stop();
  console.log('Do zobaczenia!');
  process.exit();
});

//#A Włączenie wewnętrznych wtyczek sprzętowych.
//#B Jeśli serwer działa w trybie bezpiecznym, to importowany jest moduł HTTPS.
//#C Faktyczny plik certyfikatu serwera.
//#D Wygenerowany wcześniej prywatny klucz serwera.
//#E Hasło klucza prywatnego.
//#F Utworzenie serwera HTTPS przy użyciu obiektu config.
//#G Poprzez przekazanie do biblioteki WebSocket utworzonego wcześniej serwera biblioteka ta automatycznie wykryje i włączy obsługę TLS.
