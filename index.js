"use strict";

var HAL = require("./jesper-api.js");

var testing = false;
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-jesper", "Jesper-LED", JesperAccessory);
}

function JesperAccessory(log, config) {
  this.hpi = new HAL();
  this.log = log;
  this.config = config;
  this.name = config["name"];
  this.address = config["gpio"];
  this.ip = config["ip_address"];

  if (this.name == "ADC") {
    this.service = new Service.TemperatureSensor(this.name);
    this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getOn.bind(this))
    ;

  } else {  
    this.service = new Service.Lightbulb(this.name);
    this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getOn.bind(this))
    .on('set', this.setOn.bind(this));
  }
}

JesperAccessory.prototype.getOn = function(callback) {    
  this.hpi.getFixtureState(this.address, function (status) {
    var fixtureStatus = (status.value == 1) ? 1 : 0;
    console.log("getFixtureState: "+fixtureStatus);  
    callback(null, fixtureStatus); 
  });  
}

JesperAccessory.prototype.setOn = function(on, callback) {
  var fixtureState = on ? 1 : 0;
  this.hpi.setFixtureState(this.address, fixtureState, function (status) {
    var fixtureStatus = (status.success == true) ? 1 : 0;  
    console.log("setFixtureState: "+fixtureStatus);  
    callback(null, fixtureStatus);  
  });  
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
    console.log('testing: getFixtureState(5)');
    hpi.getFixtureState(4, function (state) {
      console.log("getFixtureState response:"+state.toString());
    });
  }, 10000);

  setTimeout(function() {
    console.log('testing: setFixtureState(on)');
    hpi.setFixtureState(4, 1);
  }, 3000);

  setTimeout(function() {
    console.log('testing: setFixtureState(off)');
    hpi.setFixtureState(4, 0);
  }, 6000);
  
  /*
  setTimeout(function() {
      console.log('testing: setFixtureRGB(1, 0, 0)');
      hpi.setFixtureRGB(1, 0, 0);
  }, 6000);

  setTimeout(function() {
      console.log('testing: setFixtureRGB(0, 1, 0)');
      hpi.setFixtureRGB(0, 1, 0);
  }, 9000);

  setTimeout(function() {
      console.log('testing: setFixtureRGB(0, 0, 1)');
      hpi.setFixtureRGB(0, 0, 1);
  }, 12000);

  setTimeout(function() {
      console.log('testing: setFixtureRGB(0, 0, 0)');
      hpi.setFixtureRGB(0, 0, 0);
  }, 15000);

  setTimeout(function() {
      console.log('testing: getFixtureState(4)');
      hpi.getFixtureState(5, function (state) {
        console.log(state.toString());
      });
  }, 18000);
  */

}