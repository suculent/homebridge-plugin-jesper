-- library functions
function gpio_write(port, value)    
    local out = 0
    local result = 0
    if value == 1 then out = gpio.LOW end
    if value == 0 then out = gpio.HIGH end
    if port == 255 then
        print("gpio_write: Writing to ADC is not possible. No operation.")
        result = 1
    else
        gpio.mode(port,gpio.OUTPUT)
        print("gpio_write: Writing " .. out .. " to port " .. port)
        result = gpio.write(tonumber(port), tonumber(out))
    end
    return result
end

function gpio_read(port)
    local value = 0
    if port == 255 then
        print("ADC Selected.")
        value = adc.read(0)
    else
        value = gpio.read(port)    
    end
    -- gpio.mode(port,gpio.INPUT)
    print("gpio_read: Read " .. value .. " from port " .. port)      
    return value
end

function gpio_status(port)
    -- gpio.mode(port,gpio.OUTPUT))
    local value = gpio.read(port)
    print("gpio_read: Read status " .. value .. " from port " .. port)      
    return value  
end

function split(str, delim)
    print(str)
    local result,pat,lastPos = {},"(.-)" .. delim .. "()",1
    for part, pos in string.gfind(str, pat) do
        table.insert(result, part); lastPos = pos
    end
    table.insert(result, string.sub(str, lastPos))
    return result
end

function gpio_eval(payload)
    -- requires one-line JSON, no pretties...
    local lines = split(payload, "\n")
    for k, line in pairs(lines) do

        if line == nil then break end

        if string.find(line, '{"') then
            --print("Found command line: '" .. tostring(line) .. "'")
            local command = cjson.decode(line)   

            -- write first so the consequent batch read would return valid values
            local writeCommand = (command["write"])    
            if writeCommand then
                print("Decode write command:")
                local port = (writeCommand["gpio"])
                local value = (writeCommand["state"])
                print("Write command for port " .. port)
                print("-- with value " .. value)
                return gpio_write(tonumber(port),tonumber(value))    
            end

             local writeCommand = (command["led"])    
            if writeCommand then
                print("Decode led command:")
                local red = (writeCommand["red"])
                local green = (writeCommand["green"])
                local blue = (writeCommand["blue"])                
                gpio.write(6, tonumber(green))
                gpio.write(8, tonumber(red))
                gpio.write(7, tonumber(blue))
                return ""
            end

            local readCommand = (command["read"])
            if readCommand then
                print("Decode read command:")
                local port = (readCommand["gpio"])
                print("Reading port " .. port)
                print("--" .. port)
                value = gpio_read(port)
                return '{"port":' .. port .. ', "value":' .. value .. '}'
            end
        end 
    end
end

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
            print(text)
            client:send(text)
            client:close()
            end)
        end)
    return server
end

connect("<SSID>","<PASSWORD>")
Server = server()
