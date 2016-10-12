"use strict";

var HAL = require("./jesper-api.js");

var testing = true;
var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-led", "Jesper-LED", JesperAccessory);
}

function JesperAccessory(log, config) {
    this.hpi = new HAL();
    this.log = log;
    this.config = config;
    this.name = config["name"];
    this.address = 4;
    
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

JesperAccessory.prototype.getOn = function(callback) {    
  var status = this.hal.getFixtureState(address);
  callback(null, status);
}

JesperAccessory.prototype.setOn = function(on, callback) {
    var fixtureState = on ? 1 : 0;
    this.hal.setFixtureState(address, fixtureState);

    callback(null, on);
}

JesperAccessory.prototype.getServices = function() {
    return [this.service];
}

/// HANDLERS

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

/// TESTS

if (testing) { 

  var hpi = new HAL(); 

  setTimeout(function() {
      console.log('testing: getFixtureState(4, 0)');
      hpi.getFixtureState(9);
  }, 0);

  setTimeout(function() {
      console.log('testing: setFixtureState(4, 1)');
      hpi.setFixtureState(4, 1);
  }, 1000);

  /*
  setTimeout(function() {
      console.log('testing: setFixtureRGB(0, 1, 0)');
      hpi.setFixtureRGB(0, 1, 0);
  }, 2000);

  setTimeout(function() {
      console.log('testing: setFixtureRGB(1, 0, 0)');
      hpi.setFixtureRGB(1, 0, 0);
  }, 4000);

  setTimeout(function() {
      console.log('testing: setFixtureRGB(0, 0, 1)');
      hpi.setFixtureRGB(0, 0, 1);
  }, 6000);

  setTimeout(function() {
      console.log('testing: setFixtureState(4, 0)');
      hpi.setFixtureState(4, 0);
  }, 0);

  setTimeout(function() {
      console.log('testing: getFixtureState(4, 0)');
      hpi.getFixtureState(4);
  }, 10000);

  */
}