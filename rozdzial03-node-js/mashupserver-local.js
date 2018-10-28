var http = require("http"),
	request = require('request'),
	fs = require('fs');


var serviceRootUrl = 'http://localhost:8686';

http.createServer(function(servReq, servResp){  
	console.log('New incoming client request...');

	if (servReq.url == '/log') {
		// 1) Pobranie termperatury
		request({url: serviceRootUrl + '/temperature', json: true}, 
			function (err, resp, body) {
				if (!err && resp.statusCode == 200) {
		    	console.log(body);
		    	var temperature = body.temperature;

	      	// 2) Pobranie poziomu oświetlenia
					request({url: serviceRootUrl + '/light', json: true}, 
						function (err, resp, body) {
							if (!err && resp.statusCode == 200) {
				   			console.log(body);
				   			var light = body.light;

			       		// 3) Rejestracja wartości
								var logEntry = 'Temperatura: ' + temperature + ' Oświetlenie: ' + light;
								fs.appendFile('log.txt', logEntry + ' - ', encoding='utf8', 
									function (err) {
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
		servResp.write('Proszę użyć ścieżki /log');  
		servResp.end();  
	}

}).listen(8787); 


