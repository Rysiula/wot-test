var mqtt = require('mqtt');
var config = require('./config.json'); 

var thngId=config.thngId; 
var thngUrl='/thngs/'+thngId;
var thngApiKey=config.thngApiKey; 

var status=false;
var updateInterval;

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {
  username: 'authorization',
  password: thngApiKey 
});

client.on('connect', function () {
  client.subscribe(thngUrl+'/properties/');
  client.subscribe(thngUrl+'/actions/all'); // #A
  updateProperty('livenow',true);
  if (! updateInterval) updateInterval = setInterval(updateProperties, 5000);
});

client.on('message', function(topic, message) {
  var resources = topic.split('/');
  if (resources[1] && resources[1] === "thngs"){ // #B
    if (resources[2] && resources[2] === thngId){  // #C
      if (resources[3] && resources[3] === "properties"){ // #D
        var property = JSON.parse(message);
        console.log('Property was updated: '+property[0].key+'='+property[0].value); 
      } else if (resources[3] && resources[3] === "actions"){ // #E
        var action = JSON.parse(message);
        handleAction(action); 
      }
    }
  }
});

function handleAction(action) {
  switch(action.type) { // #F
    case '_setStatus':
      console.log('ACTION: zmiana wartości _setStatus na: '+action.customFields.status); // #G
      status=Boolean(action.customFields.status);
      updateProperty ('status',status);
      /* Wykonanie jakichś innych czynności. */
      break;
    case '_setLevel':
      console.log('ACTION: zmiana wartości _setLevel na: '+action.customFields.level);
      break;
    default:
      console.log('ACTION: Nie znany typ akcji: '+action.type);
      break;
  }
}

//#A Utworzenie subskrypcji wszystkich akcji w danej rzeczy.
//#B Sprawdzenie czy komunikat MQTT jest na urządzeniu Thng
//#C Sprawdzenie czy komunikat jest przeznaczony do danego urządzenia Thng
//#D Sprawdzenie czy wartość właściwości legła zmianie; jeśli tak to zostanie ona wyświetlona.
//#E Czy to była akcja? Jeśli tak to zostaje wywołana funkcja handleAction()
//#F Sprawdzenie typu akcji.
//#G Jeśli akcji jest typu _setStatus, to zostaje wyświetlona nowa wartość i wykonane jakieś dodatkowe operacje na niej.


function updateProperties() {
  var voltage = (219.5 + Math.random()).toFixed(3); // #H
  updateProperty ('voltage',voltage);

  var current = (Math.random()*10).toFixed(3); // #I
  if (status==false) current = 0.001;
  updateProperty ('current',current);

  var power = (voltage * current * (0.6+Math.random()/10)).toFixed(3); // #J
  updateProperty ('power',power);
}

function updateProperty(property,value) {
  client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
}

process.on('SIGINT', function() { 
  updateProperty('livenow',false);
  clearInterval(updateInterval);
	client.end();
  process.exit();
});