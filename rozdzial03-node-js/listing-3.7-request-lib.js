var request = require('request');
request('http://webofthings.org', function (error, response, body) {  //#A
  if (!error && response.statusCode === 200) {
    console.log(body); //#B
  }
});

//#A Anonimowa funkcja zwrotna, która zostanie wywołana gdy biblioteka request pobierze wskazaną stronę z internetu.
//#B Wyświetlenie kodu HTML strony.
