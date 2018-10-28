var utils = require('./../utils/utils.js'),
  util = require('util'),
  _ = require('lodash/collection'),
  resources = require('./../resources/model');

/**
 * params: na przykład, {'simulate': false, 'frequency': 5000};
 * propertyId: nazwa właściwości modelu Web Thing Model skonwertowana przez czujnik/urządzenie wykonawcze
 * doStop: funkcja wywyływana w celu zatrzymania wtyczki, przesłaniająca tę udostępnianą przez Core Plugin 
 * doSimulate: function to invoke to simulate a new value, przesłaniająca tę udostępnianą przez Core Plugin 
 * actionIds: tablica akcji, które należy obserwować, na przykład, ['ledState'], dostępna tylko dla urządzeń wykonawczych
 * doAction: ta funkcja zostanie wywołana, gdy zajdzie obserwowana akcja, dostępna tylko dla urządzeń wykonawczych
 * @type {exports.CorePlugin}
 */
var CorePlugin = exports.CorePlugin = function (params, propertyId, doStop, doSimulate, actionsIds, doAction) {
  if (params) { //#A
    this.params = params;
  } else {
    this.params = {'simulate': false, 'frequency': 5000};
  }

  this.doAction = doAction; //#B
  this.doStop = doStop;
  this.doSimulate = doSimulate;
  this.actions = actionsIds; //#C
  this.model = utils.findProperty(propertyId); //#D
};

CorePlugin.prototype.start = function () {
  if (this.actions) this.observeActions(); //#E
  if (this.params.simulate) {
    this.simulate();
  } else {
    this.connectHardware();
  }
  console.info('[plugin started] %s', this.model.name);
};

CorePlugin.prototype.stop = function () {
  if (this.params.simulate) {
    clearInterval(this.interval);
  } else {
    if (this.doStop) this.doStop();
  }
  console.info('[plugin stopped] %s', this.model.name);
};

CorePlugin.prototype.simulate = function () {
  var self = this;
  this.interval = setInterval(function () {
    self.doSimulate();
    self.showValue();
  }, self.params.frequency);
  console.info('[simulator started] %s', this.model.name);
};

CorePlugin.prototype.connectHardware = function () {
  throw new Error('connectedHardware() powinna być zaimplementowana przez wtyczkę');
};

CorePlugin.prototype.showValue = function () {
  console.info('Bieżąca wartość %s to %s', this.model.name, util.inspect(this.model.data[this.model.data.length-1]));
};

CorePlugin.prototype.observeActions = function () {
  var self = this;
  _.forEach(self.actions, function (actionId) { //#F
    Object.observe(resources.links.actions.resources[actionId].data, function (changes) {
      var action = changes[0].object[changes[0].object.length -1];
      console.info('[plugin action detected] %s', actionId);
      if (self.doAction) self.doAction(action);
    }, ['add']);
  });
};

CorePlugin.prototype.createValue = function (data) {
  throw new Error('createValue(data) powinna być zaimplementowana przez wtyczkę');
};

CorePlugin.prototype.addValue = function(data) {
  utils.cappedPush(this.model.data, this.createValue(data));
};

//#A Inicjalizacja nowej, konkretnej wtyczki o określonych parametrach i funkcjach.
//#B Właściwość doAction jest określana przez konkretną wtyczkę i zawiera informacje o tym, co należy zrobić po odebraniu akcji.
//#C Ta właściwość zawiera listę identyfikatorów akcji, które należy obserwować.
//#D Ta funkcja pomocnicza zwraca właściwość danej wtyczki.
//#E Rozpoczęcie obserwowania akcji.
//#F Dla każdego identyfikatora akcji odnajdujemy daną akcję w modelu i rejestrujemy wywołanie zwrotne do doAction.
