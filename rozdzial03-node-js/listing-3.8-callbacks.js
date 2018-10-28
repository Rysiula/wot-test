var http = require('http'),
  request = require('request'),
  fs = require('fs');

var port = 8787;
var serviceRootUrl = 'http://localhost:8686';


http.createServer(function (servReq, servResp) {
  console.log('Nowe żądanie od klienta...');
  if (servReq.url === '/log') {
    request({url: serviceRootUrl + '/temperature', json: true},  //#A
      function (err, resp, body) {
        if (err) throw err;
        if (resp.statusCode === 200) {
          console.log(body);
          var temperature = body.temperature;

          request({url: serviceRootUrl + '/light', json: true}, //#B
            function (err, resp, body) {
              if (err) throw err;
              if (resp.statusCode === 200) {
                console.log(body);
                var light = body.light;
                var logEntry = 'Temperatura: ' + temperature + ' Oświetlenie: ' + light;
                fs.appendFile('log.txt', logEntry + '\n', encoding = 'utf8', function (err) { //#C
                  if (err) throw err;
                  servResp.writeHeader(200, {"Content-Type": "text/plain"});
                  servResp.write(logEntry);
                  servResp.end();
                });
              }
            });
        }
      });
  } else {
    servResp.writeHeader(200, {"Content-Type": "text/plain"});
    servResp.write('Proszę użyć ścieżki: /log');
    servResp.end();
  }

}).listen(port);
console.log('Serwer działa na adresie http://localhost:' + port);
