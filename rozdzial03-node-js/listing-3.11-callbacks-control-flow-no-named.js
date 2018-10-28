var http = require("http"),
  request = require('request'),
  fs = require('fs'),
  async = require('async');

var port = 8787;
var serviceRootUrl = 'http://localhost:8686';

http.createServer(function (req, res) {
  console.log('Nowe żądanie od klienta...');
  if (req.url === '/log') {
    async.series([  //#A
        function (callback) {
          request({url: serviceRootUrl + '/temperature', json: true}, function (err, res, body) {
            if (err) callback(err);
            if (res && res.statusCode === 200) {
              console.log(body);
              var temp = body.temperature;
              callback(null, temp); //#B
            } else callback(null, null);
          });
        },
        function (callback) {
          request({url: serviceRootUrl + '/light', json: true}, function (err, res, body) {
            if (err) callback(err);
            if (res && res.statusCode === 200) {
              console.log(body);
              var light = body.light;
              callback(null, light);
            } else callback(null, null);
          });
        }],
      function (err, results) { //#C
        console.log(results);   //#D
        var logEntry = 'Temperatura: ' + results[0] + ' Oświetlenie: ' + results[1];
        fs.appendFile('log.txt', logEntry + '\n', encoding = 'utf8', function (err) {
          if (err) throw err;
          res.writeHeader(200, {"Content-Type": "text/plain"});
          res.write(logEntry);
          res.end();
        });
      });

  } else {
    res.writeHeader(200, {"Content-Type": "text/plain"});
    res.write('Proszę użyć ścieżki /log');
    res.end();
  }
}).listen(port);
console.log('Serwer działa na adresie http://localhost:' + port);

//#A Tworzymy tablicę funkcji, które mają być wywołane w sekwencji.
//#B Wywołanie następnej funkcji w sekwencji.
//#C Ta funkcja zostanie wywołana po zakończeniu wykonywania ostatniej funkcji w sekwencji.
//#D Parametr results zawiera teraz tablicę [temperatura, oświetlenie].
