var https = require('https'),
  fs = require('fs'),
  config = require('../config/acl.json').things[0], //#A
  httpProxy = require('http-proxy');

var proxyServer = httpProxy.createProxyServer({ //#B
  ssl: {
    key: fs.readFileSync('./config/change_me_privateKey.pem', 'utf8'),
    cert: fs.readFileSync('./config/change_me_caCert.pem', 'utf8'),
    passphrase: 'webofthings'
  },
  secure: false //#C
});

module.exports = function() {
  return function proxy(req, res, next) {
    req.headers['authorization'] = config.token; //#D
    proxyServer.web(req, res, {target: config.url}); //#E
  }
};

//#A Wczytanie rzeczy do których mogą być przekazywane żądania (w tym przykładzie jest tylko jedna).
//#B Inicjalizacja serwera przekazującego żądania - będzie to serwer używający HTTPS, by zapewnić szyfrowanie całego kanału komunikacyjnego.
//#C Certyfikaty nie będą weryfikowane (użycie true spowodowałoby odrzucenie lokalnych certyfikatów).
//#D Funkcja przekazująca żądania; do żadania jest dodawany tajny żeton rzeczy.
//#E Przekazanie żądania; warto zwrócić uwagę, że to oprogramowanie warstwy pośredniej nie wywołuje funkcji next(), ponieważ powinno być ostatnim w łańcuchu.
