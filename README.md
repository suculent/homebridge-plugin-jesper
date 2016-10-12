# Jesper

ESP8266 HomeKit integration as a Homebridge plugin.

Prerequisites:

- Homebridge installation on local WiFi
- ESP8266 with FTDI/USB serial interface
- ESPlorer or any other tool capable of injecting LUA file to ESP8266
- node.js and npm installed

Files:

ESP8266/init.lua    - Jesper ESP: server code for the ESP board (inject with e.g. ESPlorer)
http-commands.js    - testing JavaScript code with method calls against the Jesper ESP (run with `node http-commands.js`)
package.json        - npm package descriptor
index.js            - main plugin module code


Jesper protocol:

Jesper ESP is a HTTP-based JSON protocol GPIO server. At the current moment,
supports only minimized JSONs (not pretty-printed).

Encodes values to GPIO PINs as gpio.LOW for 1 and gpio.HIGH for 0 (todo: fact-check)
Values read from ADC are in range 0 .. 1024 (todo: fact-check)
System reboots after any critical failure.

Jesper currently defines following commands:

### Connect

__Connect to different WiFi__

Requires existing connection. If you need to connect to specific WiFi network on ESP reset, edit arguments on the `connect()` line at the end of init.lua.

TODO: Extract configuration to separate file, enable persistence.
TODO: Use MQTT (UDP?) to broadcast new IP address.

**Example**

{"connect":{"ssid":"mywifi","password":"password"}}


### Write

__Write value to GPIO.__

GPIO ports are numbered 0-n, ADC is read-only (write not supported).

**Example**

REQUEST
`{"write":{"port":4,"value":1}}`

RESPONSE
`{"success":true}`


### Read

__Read value from GPIO or ADC.__

GPIO ports are numbered 0-n, ADC uses reserved value of 255.

**Example**

REQUEST
`{"read":{"port":1}}`

RESPONSE
`{"port":1, "value":1}`


### LED

__Write RGB triplet to LED (GPIO PINs 7, 8, 9).__

REQUEST
`{"led":{"red":1,"green":1,"blue":1}}`
