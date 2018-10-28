var msgpack = require('msgpack5')(),
  encode = msgpack.encode,
  jsonld = require('./../resources/piJsonLd.json');

module.exports = function () {
  return function (req, res, next) {
    if (req.result) {

      req.rooturl = req.headers.host;
      req.qp = req._parsedUrl.search;

      if (req.accepts('html')) {

        var helpers = {
          json: function (object) {
            return JSON.stringify(object);
          },
          getById: function (object, id) {
            return object[id];
          }
        };

        // Sprawdzenie czy jest dostępny niestandardowy mechanizm generujący dla danego typu mediów oraz zasobu.
        if (req.type) res.render(req.type, {req: req, helpers: helpers});
        else res.render('default', {req: req, helpers: helpers});

        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('Wybrano reprezentację MessagePack!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      if (req.accepts('application/ld+json')) {
        console.info('Wybrano reprezentację JSON-LD!');
        res.send(jsonld);
        return;
      }

      console.info('Użycie domyślnej reprezentacji JSON!');
      res.send(req.result);
      return;

    }
    else if (res.location) {
      res.status(204).send();
      return;
    } else {
      next();
    }
  }
};

