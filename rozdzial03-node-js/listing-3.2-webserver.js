var http = require("http");
var port = 8686;

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

http.createServer(function(req,res){
  console.log('Nowe żądanie do ' + req.url);
  res.writeHeader(200, {'Content-Type': 'application/json'}); //#A
  switch(req.url) { //#B
    case '/temperature':
      // Zwracamy odpowiedni kod JSON
      res.write('{"temperature" :' + randomInt(1, 40) + '}'); //#C
      break;
    case '/light':
      res.write('{"light" :' + randomInt(1, 100) + '}');
      break;
    default:
      res.write('{"witaj" : "świecie"}');
  }
  res.end();  //#D
}).listen(port);
console.log('Serwer działa na adresie http://localhost:' + port);

//#A Ustawienie nagłówka informującego, że odpowiedź zawiera dane w formacie JSON.
//#B Pobranie adresu URL żądania i przygotowanie odpowiedniej odpowiedzi.
//#C Zapisanie temperatury w formie danych JSON
//#D Przekazanie odpowiedzi do klienta.

