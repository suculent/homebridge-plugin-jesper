# Jesper

Sample HomeKit integration as a Homebridge plugin. Contains JesperServer written in LUA for ESP8266 running a NodeMCU firmware. Implements simple JSON-based HTTP protocol to control GPIO and fixtures connected to the ESP board.

### Prerequisites

- Homebridge installation on local WiFi
- ESP8266 with FTDI/USB serial interface
- ESPlorer or any other tool capable of injecting LUA file to ESP8266
- node.js and npm installed

### Files
```
ESP8266/init.lua    - Jesper ESP: server code for the ESP board (inject with e.g. ESPlorer)
http-commands.js    - testing JavaScript code with method calls against the Jesper ESP (run with `node http-commands.js`)
package.json        - npm package descriptor
index.js            - main plugin module code
```

### Installation

Open the plugin folder in terminal and run 'npm install -g' to let Homebridge access the plugin. It should respond with:

    /usr/local/lib
    └── homebridge-thinker@0.0.1 

Edit ~/.homebridge/config.json:
    
    {
      "bridge" : {
        "name" : "Homebridge",
        "username" : "CC:22:3D:E3:CE:31",
        "port" : 51826,
        "pin" : "031-45-155"
      },
      "accessories" : [
        {
          "accessory" : "Jesper-LED",
          "name" : "ADC",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 255
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "GPIO 5",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 5
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "ESP8266",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 4
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "GPIO 3",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 3
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "GPIO 2",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 2
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "GPIO 1",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 1
        },
        {
          "accessory" : "Jesper-LED",
          "name" : "GPIO 0",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 0
        }
      ]
    }
    
### Usage



### Future features

* Use MQTT (and/or UDP) to broadcast new IP address.
* Use MQTT (and/or socket) to listen for changes.


### The Jesper protocol

Jesper ESP is a HTTP-based JSON protocol GPIO server. At the current moment,
supports only minimized JSONs (not pretty-printed).

Encodes values to GPIO PINs as gpio.LOW for 1 and gpio.HIGH for 0 (todo: fact-check)
Values read from ADC are in range 0 .. 1024 (todo: fact-check)
System reboots after any critical failure.

## Connect to WiFi [connect]

Requires existing connection. If you need to connect to specific WiFi network on ESP reset, this will save arguments inside a file named config.lua on your ESP for future use after reset.

The file should contain following globals:

    wifi_ssid = 'ENTER_YOUR_WIFI_SSID'
    wifi_password = 'ENTER_YOUR_WIFI_PASSWORD'
    
Usage:

**HTTP POST** `{"connect":{"ssid":"mywifi","password":"password"}}`


## Write to GPIO [write]

GPIO ports are numbered 0-n, ADC is read-only (write not supported).

**HTTP POST**

`{"write":{"port":4,"value":1}}`

**RESPONSE**

`{"success":true}`


## Read from GPIO/ADC [read]

__Read value from GPIO or ADC.__

GPIO ports are numbered 0-n, ADC uses reserved value of 255.

**HTTP POST**

`{"read":{"port":1}}`

**RESPONSE**

`{"port":1, "value":1}`


## Write to LED [led]

__Write RGB triplet to LED (GPIO PINs 7, 8, 9).__

**HTTP POST**

`{"led":{"red":1,"green":1,"blue":1}}`

**RESPONSE**

`{"success":true}`


## Read from LED [led-status]

Reads RGB triplet from LED (GPIO PINs 7, 8, 9).

**HTTP POST**

`{"led-status":"please"}`

**RESPONSE**

`{"led-status":{"red":1, "green":1, "blue":1}}`
