var http = require("http"),
  request = require('request'),
  fs = require('fs');


var location = 'London, GB';
var piRootUrl = 'http://localhost:3000/pi/';
var name = 'Dom'

http.createServer(function(webReq, webResp){  

  // 1) Pobranie danych z serwisu Yahoo Weather
  request({
        url: prepareYahooWeatherUrl(location),
        json: true}, 
      function (err, resp, yahooResult) {
        if (!err && resp.statusCode == 200) {

          console.log(yahooResult);
          var localTemp = yahooResult.query.results.channel.item.condition.temp;
          console.log('Local @ ' + location + ': ' + localTemp);

          // 2) Wywołanie Pi
          request({
            url: piRootUrl + 'sensors/temperature',
            json: true}, function (err, resp, piResult) {
              if (!err && resp.statusCode == 200) {

                console.log(piResult);
                var piTemp = piResult.value;
                console.log('Pi @ London: ' + piTemp);

                // 3) Porównanie wyników i zarejestrowanie komunikatu
                var message = prepareMessage(name, location, localTemp, piTemp);
                fs.appendFile('log.txt', message, encoding='utf8', function (err) {
                    if (err) throw err;             
                    webResp.writeHeader(200, {"Content-Type": "text/plain"});  
                    webResp.write(message);  
                    webResp.end();  
                });
              }
            });
        }
      });

}).listen(8080); 

function prepareYahooWeatherUrl(location) {
  return "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + location + "') and u='c'&format=json";
}

function prepareMessage(name, location, localTemp, piTemp) {
    var diff = localTemp - piTemp;
    var qualifier = ' wyższa '; 
    if(diff < 0) {
      qualifier = ' niższa '; 
    }
    var result = 'Cześć, mam na imię ' + name + ' i pochodzę z ' + location;
    result += ' temperatura u mnie jest o '  + Math.abs(diff) + ' stopni';
    result += qualifier + 'niż u Ciebie!';
    return result;
  }

