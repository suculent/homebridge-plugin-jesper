# Jesper

[![Greenkeeper badge](https://badges.greenkeeper.io/suculent/homebridge-plugin-jesper.svg)](https://greenkeeper.io/)

Sample HomeKit integration as a Homebridge plugin. Requires [Jesper Server for ESP8266](https://github.com/suculent/esp8266-jesper) written in LUA for ESP8266 running a NodeMCU firmware. 

### Prerequisites

- Homebridge installation on local WiFi
- ESP8266 on local WiFi with Jesper Server installed
- node.js and npm installed

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
          "accessory" : "Jesper",
          "name" : "ADC",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 255
        },
        {
          "accessory" : "Jesper",
          "name" : "GPIO 5",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 5
        },
        {
          "accessory" : "Jesper",
          "name" : "ESP8266",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 4
        },
        {
          "accessory" : "Jesper",
          "name" : "GPIO 3",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 3
        },
        {
          "accessory" : "Jesper",
          "name" : "GPIO 2",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 2
        },
        {
          "accessory" : "Jesper",
          "name" : "GPIO 1",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 1
        },
        {
          "accessory" : "Jesper",
          "name" : "GPIO 0",
          "description" : "ESP8266 Microcontroller",
          "ip_address" : "192.168.1.8",
          "gpio" : 0
        }
      ]
    }
    
### Usage

Setup the homebridge's config with `ip_address` of your ESP8266 with [Jesper Server for ESP8266](https://github.com/suculent/esp8266-jesper) installed.
Add the homebridge/accessory with your iOS HomeKit application.

### Future features

* Use MQTT (and/or UDP) to broadcast new IP address.
* Use MQTT (and/or socket) to listen for changes.

