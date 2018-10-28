var keys = require('../resources/auth');

module.exports = function() {
  return function (req, res, next) {
    console.log(req.method + " " + req.path);
    if (req.path.substring(0, 5) === "/css/") {
      next(); //#A

    } else {
      var token = req.body.token || req.get('authorization') || req.query.token; //#B
      console.log(req.params);
      if (!token) { //#C
        return res.status(401).send({success: false, message: 'Brak żetonu API.'});
      } else {
        if (token != keys.apiToken) { //#D
          return res.status(403).send({success: false, message: 'Żeton API jest nieprawidłowy.'});
        } else { //#E
          next();
        }
      }
    }
  }
};
//#A Dostęp do katalogu css będzie możliwy bez uwierzytelniania
//#B Sprawdzenie czy żeton jest dostępny w nagłówku, parametrach adresu URL lub parametrach żądania POST.
//#C W razie braku żetonu zwracany jest kod HTTP 401 UNAUTHORIZED.
//#D W razie podania nieprawidłowego żetonu zwracany jest kod HTTP 403 FORBIDDEN.
//#E Jeśli wszystko jest w porządku, to żądanie zostaje zapisane w celu użycia w innych trasach.