-- HTTP JSON Command Interpreter (one-line JSON, no pretties, should allow batches)
function gpio_eval(payload)

    local GREEN = 6;
    local RED = 8;
    local BLUE = 7;

    local lines = split(payload, "\n")
    local result = ""
    for k, line in pairs(lines) do
        if line == nil then break end
        if string.find(line, '{"') then
            local command = cjson.decode(line)   
            
            -- GPIO write
            local writeCommand = (command["write"])    
            if writeCommand then
                local port = (writeCommand["gpio"])
                local value = (writeCommand["state"])                
                result = result .. gpio_write(tonumber(port),tonumber(value))
            end

            -- RGB write
        
            if ledCommand then
                local red = tonumber(ledCommand["red"])
                local green = tonumber(ledCommand["green"])
                local blue = tonumber(ledCommand["blue"])                                
                gpio.write(RED, (red))
                gpio.write(GREEN, green)
                gpio.write(BLUE, blue)                
                red = gpio.read(RED);
                green = gpio.read(GREEN);
                blue = gpio.blue(BLUE);
                result = result ..  '{"led-status":{"red":' .. red .. ', "green":' .. green .. ', "blue":' .. blue .. '}}'
            end

            -- RGB read
            local rgbCommand = (command["led-status"])    
            if rgbCommand then
                local red = gpio.read(RED);
                local green = gpio.read(GREEN);
                local blue = gpio.blue(BLUE);
                result = result ..  '{"led-status":{"red":' .. red .. ', "green":' .. green .. ', "blue":' .. blue .. '}}'
            end

            -- GPIO read
            local readCommand = (command["read"])
            if readCommand then
                local port = (readCommand["gpio"])
                result = result ..  gpio_read(port)
            end
            
            -- connect to different SSID
            local connectCommand = (command["connect"])    
            if connectCommand then
                local ssid = (ledCommand["ssid"])
                local password = (ledCommand["password"])

                -- update config
                file.open("config.lua","w+")
                file.writeline("wifi_ssid = " .. ssid)
                file.writeline("wifi_password = " .. password)

                result = result ..  '{"success":true}'                
                connect(ssid, password)
            end
        end 
    end
    return result
end

-- HAL - hardware abstraction layer
function gpio_write(port, value)  
    --print("gpio_write:" .. port .. ":" .. value)
    local out = gpio.LOW
    local result = '{"success":false}'
    if value == 1 then out = gpio.LOW end
    if value == 0 then out = gpio.HIGH end

    if port == 255 then
        print("gpio_write: Writing to ADC is not possible. No operation.")
    else
        gpio.mode(port,gpio.OUTPUT)
        gpio.write(tonumber(port), out)
        result = '{"success":true}'
    end
    return result
end

function gpio_read(port)
    local value = 0
    if port == 255 then
        print("ADC Selected.")
        value = adc.read(0)
    else
    -- gpio.mode(port,gpio.INPUT)
        value = gpio.read(port)    
    end
    print("gpio_read: Read " .. value .. " from port " .. port)      
    return '{"port": ' .. port .. ',"value": ' .. value .. '}';
end

function gpio_status(port)
    -- gpio.mode(port,gpio.OUTPUT))
    local value = gpio.read(port)
    print("gpio_read: Read status " .. value .. " from port " .. port)      
    return '{"port": '+port+',"value": '+value'}';
end

-- Tools
function split(str, delim)
    local result,pat,lastPos = {},"(.-)" .. delim .. "()",1
    for part, pos in string.gfind(str, pat) do
        table.insert(result, part); lastPos = pos
    end
    table.insert(result, string.sub(str, lastPos))
    return result
end

-- Server and Connectivity
function connect(ssid, password)
    wifi.setmode(wifi.STATION)
    wifi.sta.config(ssid, password)
    wifi.sta.connect()
    tmr.alarm(1, 1000, 1, function()
        if wifi.sta.getip() == nil then
            print("Connecting " .. ssid .. "...")
        else
            tmr.stop(1)
            print("Connected to " .. ssid .. ", IP is "..wifi.sta.getip())
        end
    end)
end

function server()
    server=net.createServer(net.TCP)
    server:listen(80,function(conn) 
        print('Listening on IP ' .. wifi.sta.getip() .. ':80') 
        conn:on('receive',function(client,payload)
            local result = gpio_eval(payload)
            local text = tostring(result)
            print('end-result: ' .. text)
            local response = 'HTTP/1.0 200 OK\r\nContent-Type: application/json\r\n\r\n' .. text .. '\n'
            print('response: ' .. response)
            client:send(response)            
            end)
        end)

        conn:on("sent", function(sck) 
            sck:close() 
            print('connection closed.\n\n')
        end)
        
    return server
end

-- import configuration
dofile("config.lua")
connect(wifi_ssid, wifi_password)
Server = server()
