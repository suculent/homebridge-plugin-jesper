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
  this.hal.getFixtureState(address, function (status) {
    console.log("getFixtureState response:"+status.toString());
    if (callback) {
      callback(null, status);
    }
  });  
}

JesperAccessory.prototype.setOn = function(on, callback) {
  var fixtureState = on ? 1 : 0;
  this.hal.setFixtureState(address, fixtureState);
  if (callback) {
    callback(null, on);
  }
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