var msgpack = require('msgpack5')(),
  encode = msgpack.encode, //#A
  json2html = require('node-json2html');

module.exports = function() { //#B
  return function (req, res, next) {
    console.info('Wywołano konwerter reprezentacji!');

    if (req.result) { //#C
      if (req.accepts('json')) { //#D
        console.info('Wybrano reprezentację JSON!');
        res.send(req.result);
        return;
      }

      if (req.accepts('html')) {
        console.info('Wybrano reprezentację HTML!');
        var transform = {'tag': 'div', 'html': '${name} : ${value}'};
        res.send(json2html.transform(req.result, transform)); //#E
        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('Wybrano reprezentację MessagePack!');
        res.type('application/x-msgpack');
        res.send(encode(req.result)); //#F
        return;
      }

      console.info('Zostanie użyta reprezentacja domyślna - JSON!');
      res.send(req.result); //#G
      return;

    }
    else {
      next(); //#H
    }
  }
};
//#A Wczytanie dwóch modułów i utworzenie instancji MessagePack.
//#B We frameworku Express, oprogramowanie warstwy pośredniej jest zazwyczaj funkcją, która zwraca inną funkcję.
//#C Sprawdzenie czy poprzednie oprogramowanie warstwy pośredniej nie zostawiło w req.result jakiegoś wyniku.
//#D Odczyt nagłówka żądania i sprawdzenie czy klient zażądał formatu HTML.
//#E Jeśli klient zażądał formatu HTML, dane JSON są przekształcane na kod HTML przy użyciu biblioteki json2html.
//#F Zakodowanie danych JSON w formacie MessagePack przy użyciu obiektu kodującego i zwrócenie wyników klientowi.
//#G W razie użycia jakiegokolwiek innego formatu, zostanie użyty domyślny format JSON.
//#H Jeśli w req.result nie było żadnych wyników, to nie mamy zbyt wiele do roboty — pozostaje jedynie wywołać następne oprogramowanie warstwy pośredniej.
