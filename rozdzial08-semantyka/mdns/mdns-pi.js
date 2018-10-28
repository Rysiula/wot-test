var mdns = require('mdns');

// rozgłoszenie informacji o serwerze HTTP na porcie 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();

// obserwowanie wszystkich serwerów HTTP
var browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});
browser.start();

// wykrycie wszystkich dostępnych typów usług
var all_the_types = mdns.browseThemAll();