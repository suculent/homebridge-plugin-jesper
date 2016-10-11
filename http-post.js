var http = require('http');

var options = {
  host: '192.168.1.8',
  path: '/',
  port: '80',
  method: 'POST'
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log('callback end: '+str);
  });
}

function setFixtureState(identifier, state) {
  var value = 0
  if (state == true) { 
    value = 1 
  } else if (state == false) { 
    value = 0 
  } else {
    value = state
  }
  POST('{"write":{"gpio":' + identifier + ',"state":' + value + '}}');
}

function setFixtureRGB(red, green, blue) {  
  var data = '{"led":{"red":'+red+',"green":'+green+',"blue":'+blue+'}}';  
  POST(data);
}

function getFixtureState(identifier) {  
  var data = '{"read":{"gpio":' + identifier + '}}';
  POST(data);  
}

function POST(data) {
  console.log("HTTP POST:"+data);
  var req = http.request(options, function (res) {
         var str = ""
         res.on('data', function (body) {
             str += body;
             console.log("response-body:"+body);
         });
         res.on('error', function (err) {
             console.log("error:"+err);
         });
         res.on('end', function () {
             return callback(str);
         });
    });
  req.write(data);
  req.end();
}

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

//

setTimeout(function() {
    console.log('testing: getFixtureState(4, 0)');
    getFixtureState(9);
}, 0);

setTimeout(function() {
    console.log('testing: setFixtureState(4, 1)');
    setFixtureState(4, 1);
}, 1000);

setTimeout(function() {
    console.log('testing: setFixtureRGB(0, 1, 0)');
    setFixtureRGB(0, 1, 0);
}, 2000);

setTimeout(function() {
    console.log('testing: setFixtureRGB(1, 0, 0)');
setFixtureRGB(1, 0, 0);
}, 4000);

setTimeout(function() {
    console.log('testing: setFixtureRGB(0, 0, 1)');
    setFixtureRGB(0, 0, 1);
}, 6000);

setTimeout(function() {
    console.log('testing: setFixtureState(4, 0)');
    setFixtureState(4, 0);
}, 0);

setTimeout(function() {
    console.log('testing: getFixtureState(4, 0)');
    getFixtureState(4);
}, 10000);


// OK for node.js example
setTimeout(function() {
    process.exit();
}, 20000);

