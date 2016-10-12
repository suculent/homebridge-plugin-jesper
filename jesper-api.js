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
  
  setFixtureState(identifier, state, jesper_callback) {
    var value = 0
    if (state == true) { 
      value = 1 
    } else if (state == false) { 
      value = 0 
    } else {
      value = state
    }
    this.POST('{"write":{"gpio":' + identifier + ',"state":' + value + '}}', jesper_callback);
  }

  setFixtureRGB(red, green, blue, jesper_callback) {  
    var data = '{"led":{"red":'+red+',"green":'+green+',"blue":'+blue+'}}';  
    this.POST(data, jesper_callback);
  }

  getFixtureState(identifier, jesper_callback) {  
    var data = '{"read":{"gpio":' + identifier + '}}';
    this.POST(data, jesper_callback);  
  }

  POST(data, jesper_callback) {
    //console.log("HTTP POST:"+data);
    var req = http.request(this.options, function (res) {
           var response = ""
           res.on('data', function (body) {
               response += body;
               //console.log("response-body:"+body);
               if (jesper_callback != null) {
                  jesper_callback(body)
               }
           });
           res.on('error', function (err) {
               console.log("[jesper-api] error:"+err);
           });
           res.on('end', function () {
            
            if (jesper_callback != null) {
                return jesper_callback(response)
            } else return function(){};
           });
      });
    req.write(data);
    req.end();
  }
}

module.exports = JesperAPI;