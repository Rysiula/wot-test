var WebSocketServer = require('ws').Server,
  url = require('url'),
  resources = require('./../resources/model'),
  utils = require('./../utils/utils');

exports.listen = function (server) {
  var wss = new WebSocketServer({server: server}); //#A
  console.info('WebSocket server started...');
  wss.on('connection', function (ws) { //#B
    var reqUrl = url.parse(ws.upgradeReq.url, true);
    if (!utils.isTokenValid(reqUrl.query.token)) {
      ws.send(JSON.stringify({'error': 'Invalid access token.'}));
    } else {
      try {
        Array.observe(selectResouce(reqUrl.pathname), function (changes) { //#C
          ws.send(JSON.stringify(changes[0].object[changes[0].object.length - 1]), function () {
          });
        }, ['add'])
      } catch (e) { //#D
        console.log('Nie można obserwować zasobu %s!', url);
      }
    }
  });
};

function selectResouce(url) { //#E
  var parts = url.split('/');
  parts.shift();
  var result;
  if (parts[0] === 'actions') {
    result = resources.links.actions.resources[parts[1]].data;
  } else {
    result = resources.links.properties.resources[parts[1]].data;
  }
  return result;
}

//#A Utworzenie serwera WebSocket poprzez przekazanie do niego serwera Express.
//#B Ta funkcja anonimowa jest wywoływana po przełączeniu protokołu, kiedy zostanie nawiązane połączenie z klientem.
//#C Rejestracja obserwatora odpowiadającego zasobowi określonemu w adresie URL żądania przełączenia protokołu.
//#D Instrukcja try/catch pozwala na przechwytywanie i obsługę błędów (takich jak nieprawidłowe lub nieobsługiwane adresy URL).
//#E Ta funkcja pobiera adres URL z żądania i zwraca odpowiadający mu zasób.


