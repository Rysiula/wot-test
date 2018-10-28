var WebSocketServer = require('ws').Server,
  resources = require('./../resources/model');

exports.listen = function(server) {
  var wss = new WebSocketServer({server: server}); //#A
  console.info('Uruchomiono serwer WebSocket...');
  wss.on('connection', function (ws) { //#B
    var url = ws.upgradeReq.url;
    console.info(url);
    try {
      Object.observe(selectResouce(url), function (changes) { //#C
        ws.send(JSON.stringify(changes[0].object), function () {
        });
      })
    }
    catch (e) { //#D
      console.log('Nie można obserwować zasobu %s!', url);
    };
  });
};

function selectResouce(url) { //#E
  var parts = url.split('/');
  parts.shift();
  var result = resources;
  for (var i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  return result;
}


//#A Utworzenie serwera WebSocket poprzez przekazanie do niego serwera Express.
//#B Ta funkcja anonimowa jest wywoływana po przełączeniu protokołu, kiedy zostanie nawiązane połączenie z klientem. 
//#C Rejestracja obserwatora odpowiadającego zasobowi określonemu w adresie URL żądania zawierającego prośbę o przełączenie protokołu.
//#D Instrukcja try/catch pozwala na przechwytywanie i obsługę błędów (takich jak nieprawidłowe lub nieobsługiwane adresy URL).
//#E Ta funkcja pobiera adres URL z żądania i zwraca odpowiadający mu zasób.

