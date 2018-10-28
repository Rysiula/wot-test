var express = require('express'),
  routesCreator = require('./../routes/routesCreator'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  auth = require('./../middleware/auth'),
  keys = require('../resources/auth'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  utils = require('./../utils/utils'),
  cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(cors());

// Włączenie API uwierzytelniania
// Służy do wygenerowania nowego żetonu API:
// console.info('Oto nowy, kryptograficznie bezpieczny klucz API: ' + utils.generateApiToken());
if(resources.customFields.secure === true) {
  console.info('My API Token is: ' + keys.apiToken);
  app.use(auth()); // usunąć komentarz, aby włączyć oprogramownaie warstwy pośredniej służące do uwierzytelniania
}


// Utworzenie tras
app.use('/', routesCreator.create(resources));

// Mechanizm obsługi szablonów
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
// Określenie publicznego katalogu serwea (zawierającego treści statyczne, takie jak pliki .css, itd.)
app.use(express.static(__dirname + '/../public'));

app.use(converter());

module.exports = app;