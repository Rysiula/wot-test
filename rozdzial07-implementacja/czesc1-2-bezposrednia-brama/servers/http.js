// Final version
var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  thingsRoutes = require('./../routes/things'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  cors = require('cors'),
  bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);
app.use('/things', thingsRoutes);

app.get('/pi', function (req, res) {
  res.send('To jest webowe Pi!')
});

app.use(converter());
module.exports = app;


/*
 //Wersja początkowa:

var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  resources = require('./../resources/model'), //#A
  cors = require('cors'); 

var app = express(); //#B

app.use(cors()); //#C

app.use('/pi/actuators', actuatorsRoutes); //#D
app.use('/pi/sensors', sensorRoutes);

app.get('/pi', function (req, res) { //#E
  res.send('To jest webowe Pi!')
});

module.exports = app;

//#A Wczytanie frameworku Express, zdefiniowanych wcześniej tras oraz modelu.
//#B Utworzenie aplikacji frameworku Express; zawiera ona implementację możliwości serwera HTTP.
//#C Włączenie wsparcia dla CORS (patrz punkt 6.1.5).
//#D Powiązanie tras z aplikacją Express; skojarzenie ich z /pi/actuators/... oraz /pi/sensors/...
//#E Utworzenie trasy domyślnej: /pi

*/