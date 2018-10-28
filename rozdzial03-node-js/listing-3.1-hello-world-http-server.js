var http = require("http"); //#A
http.createServer(function(req,res){ //#B
  res.writeHeader(200, {'Content-Type': 'text/plain'}); //#C
  res.end('Witaj, świecie');
}).listen(8585); //#D
console.log('Uruchomiono serwer!');

//#A "require" służy do "importowania" bibliotek.
//#B Utworzenie nowego serwera HTTP i przekazanie do niego funkcji, która będzie wywoływana po odebraniu każdego żądania przesłanego przez klienta.
//#C Rozpoczęcie zapisu odpowiedzi, zaczynając od nagłówków HTTP.
//#D Uruchomienie serwera HTTP działającego na porcie 8585.
