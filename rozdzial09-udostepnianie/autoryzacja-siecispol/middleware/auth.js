var acl = require('../config/acl.json'), //#A
  https = require('https'),
  fs = require('fs');

exports.socialTokenAuth = function () {
  return function (req, res, next) {
    if (isOpen(req.path)) { //#B
      next();
    } else {
      var token = req.body.token || req.get('authorization') || req.query.token;
      if (!token) {
        return res.status(401).send({success: false, message: 'Brak żetonu API.'});
      } else {
        checkUserAcl(token, req.path, function (err, user) { //#C
          if (err) {
            return res.status(403).send({success: false, message: err}); //#D
          }
          next(); //#E
        });
      }
    }
  }
};

function checkUserAcl(token, path, callback) { //#F
  var userAcl = findInAcl(function (current) {
    return current.token === token && current.resources.indexOf(path) !== -1;
  });
  if (userAcl) {
    callback(null, userAcl);
  } else {
    callback('Brak uprawnień dostępu do tego zasobu!', null);
  }
};
function findInAcl(filter) {
  return acl.protected.filter(filter)[0];
};


function isOpen(path) { //#G
  // Dostęp do wszystkich plików CSS jest otwarty...
  if (path.substring(0, 5) === "/css/") return true;

  // Czy ścieżka jest otwarta?
  if (acl.open.indexOf(path) !== -1) return true;
}

exports.checkUser = checkUser;
function checkUser(socialUserId, token, callback) { //#H
  var result = findInAcl(function (current) {
    return current.uid === socialUserId; //#I
  });
  if (result) {
    result.token = token; //#J
    callback(null, result);
  } else {
    callback('Nie znaleziono użytkownika <b>' + socialUserId + '</b>! Czy dodałeś go do pliku acl.json?', null);
  }
};

exports.getToken = getToken;
function getToken(socialUserId, callback) {
  var result = findInAcl(function (current) {
    return current.uid === socialUserId;
  });
  if (result) {
    callback(null, result);
  } else {
    callback('Nie znaleziono użytkownika <b>' + socialUserId + '</b>! Czy dodałeś go do pliku acl.json?', null);
  }
};


//#A Wczytanie pliku konfiguracyjnego z listą kontroli dostępu.
//#B Jeśli żądanie dotyczy ścieżki otwartej wywoływane jest następne oprogramowanie warstwy pośredniej.
//#C W przeciwnym razie zostaje pobrany żeton dostępu, który następnie jest sprawdzany przy użyciu listy kontroli dostępu.
//#D W razie wystąpienia błędu zwracany jest kod statusu HTTP 403 Forbidden.
//#E W przeciwnym razie, czyli gdy wszystko jest w porządku, zostaje wywołane następne oprogramowanie warstwy pośredniej.
//#F Czy można znaleźć użytkownika o podanym żetonie i określonej ścieżki, na przykład, /temp?
//#G Obsługa otwartych zasobów.
//#H Funkcja wywoływana przez facebook.js po uwierzytelnieniu użytkownika.
//#I Jeśli identyfikator użytkownika zwrócony przez Facebook jest dostępny na liście kontroli dostępu, mamy zwycięzcę!
//#J Zapisanie żetonu użytkownika, by pozwolić mu na wykonywanie kolejnych żądań do zasobów, do którym ma dostęp.
