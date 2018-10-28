var mqtt = require('mqtt');

var config = require('./config.json'); // #A 
var thngId=config.thngId; 
var thngUrl='/thngs/'+thngId;
var thngApiKey=config.thngApiKey;
var interval;

console.log('Używane urządzenie Thng #'+thngId+' o kluczu API: '+ thngApiKey);

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {// #B
  username: 'authorization',
  password: thngApiKey 
});

client.on('connect', function () { // #C
  client.subscribe(thngUrl+'/properties/'); //#D
  updateProperty('livenow', true); //#E

  if (!interval) interval = setInterval(updateProperties, 5000); //#F
});

client.on('message', function (topic, message) { // #G
  console.log(message.toString());
});


function updateProperties () {
  var voltage = (219.5 + Math.random()).toFixed(3); // #H
  updateProperty ('voltage',voltage);

  var current = (Math.random()*10).toFixed(3); // #I
  updateProperty ('current',current);

  var power = (voltage * current * (0.6+Math.random()/10)).toFixed(3); // #J
  updateProperty ('power',power);
}

function updateProperty (property,value) {
  client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
}

// prawidłowe zamknięcie połączenia
process.on('SIGINT', function() { // #K
  clearInterval(interval);
  updateProperty ('livenow', false);
  client.end();
  process.exit();
});

//#A Wczytanie danych konfiguracyjnych z pliku (identyfikator urządzenia Thng ID i jego klucz API).
//#B Nawiązanie połączenia z bezpiecznym serwerem MQTT na platformie EVRYTHNG.
//#C Funkcja zwrotna wywoływana po udanym nawiązaniu połączenia MQTT.
//#D Utworzenie subskrypcji wszystkich właściwości.
//#E Przypisanie właściwości livenow wartości true.
//#F Wywołanie funkcji updateProperties() po upłynięciu 5 sekund.
//#G Ta funkcja jest wywoływana za każdym razem gdy zostanie odebrana wiadomość MQTT nadesłana przez brokera.
//#H Pomiar napięcia (oscyluje w okolicach 220 woltów).
//#I Pomiar natężenia prądu (waha się w granicach 0–10 amperów).
//#J Pomiar mocy z użyciem wzrocu P=U*I*PF (PF=współczynnik mocy zmienia się w granicach 60–70%).
//#K Prawidłowe zamknięcie połączenia z jednoczesnym przypisaniem właściwości livenow wartości false.
