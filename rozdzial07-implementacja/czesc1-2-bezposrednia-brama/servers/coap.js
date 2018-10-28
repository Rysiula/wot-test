var coap = require('coap'),  //#A
  utils = require('./../utils/utils');

var port = 5683;

coap.createServer(function (req, res) {
  console.info('Urządzenie CoAP odebrało żądanie przesłane na adres %s', req.url);
  if (req.headers['Accept'] != 'application/json') {
    res.code = '4.06'; //#B
    return res.end();
  }
  switch (req.url) { //#C
    case "/co2":
      respond(res, {'co2': utils.randomInt(0, 1000)}); //#D
      break;
    case "/temp":
      respond(res, {'temp': utils.randomInt(0, 40)});
      break;
    default:
      respond(res);
  }
}).listen(port, function () {
  console.log("Serwer CoAP uruchomiony na porcie %s", port)
});//#E

function respond(res, content) { //#F
  if (content) {
    res.setOption('Content-Format', 'application/json');
    res.code = '2.05';
    res.end(JSON.stringify(content));
  } else {
    res.code = '4.04';
    res.end();
  }
};

//#A Wczytanie zainstalowanego modułu CoAP dla Node.js
//#B Obsługujemy jedynie format JSON, więc w innym przypadku zwracana jest odpowiedź z kodem 4.06 (odpowiadającym kodowi statusu HTTP 406: Not acceptable)
//#C Obsługa różnych dostępnych zasobów.
//#D Zasób CO2; wygenerowanie i zwrócenie wartości losowej.
//#E Uruchomienie serwera CoAP na porcie 5683 (domyślnym porcie CoAP).
//#F Przesłanie danych JSON lub odpowiedzi z kodem 4.04 (odpowiadającym kodowi statusu HTTP 404: Not Found)
