"use strict";

var http = require('http');

class JesperAPI {

  constructor() {    
    this.options = {
      host: '192.168.1.8',
      path: '/',
      port: '80',
      method: 'POST'
    };
  };
  
  setFixtureState(identifier, state) {
    var value = 0
    if (state == true) { 
      value = 1 
    } else if (state == false) { 
      value = 0 
    } else {
      value = state
    }
    this.POST('{"write":{"gpio":' + identifier + ',"state":' + value + '}}');
  }

  setFixtureRGB(red, green, blue) {  
    var data = '{"led":{"red":'+red+',"green":'+green+',"blue":'+blue+'}}';  
    this.POST(data);
  }

  getFixtureState(identifier) {  
    var data = '{"read":{"gpio":' + identifier + '}}';
    this.POST(data);  
  }

  POST(data) {
    console.log("HTTP POST:"+data);
    var req = http.request(this.options, function (res) {
           var response = ""
           res.on('data', function (body) {
               response += body;
               console.log("response-body:"+body);
           });
           res.on('error', function (err) {
               console.log("error:"+err);
           });
           res.on('end', function () {
               return callback(response);
           });
      });
    req.write(data);
    req.end();
  }
}

module.exports = JesperAPI;