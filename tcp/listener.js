const net = require('net');
const WebSocket = require('ws');

let currentTest = {
    username: '',
    sampleNumber: '',
    rawData: [],
    parsedData: []
};

function parseHL7Message(data) {
    const message = data.toString().trim();
    console.log('Parsing message:', message);  // Debug log
    
    // Split by segments - the machine might use \r or \r\n
    const segments = message.split(/\r\n|\n|\r/);
    console.log('Found segments:', segments);  // Debug log

    const results = {
        timestamp: new Date().toISOString(),
        measurements: []
    };

    segments.forEach(segment => {
        console.log('Processing segment:', segment);  // Debug log
        if (segment.startsWith('OBX|')) {
            const fields = segment.split('|');
            console.log('OBX fields:', fields);  // Debug log
            if (fields.length >= 6) {
                const testName = fields[4]; // Test name (CRP or hsCRP)
                const value = fields[5];    // Result value
                const unit = fields[6];     // Unit (mg/L)
                const refRange = fields[7]; // Reference range

                results.measurements.push({
                    test: testName,
                    value: value,
                    unit: unit.split('^')[0], // Take only the unit part
                    refRange: refRange.split('^')[0] // Take only the range part
                });
            }
        }
    });

    console.log('Parsed results:', results);  // Debug log
    return results;
}

function start(port, machineIp, wss) {
    const server = net.createServer((socket) => {
        console.log(`Wondfo machine connected from ${socket.remoteAddress}`);

        socket.on('data', (data) => {

            console.log(data);
            
            const rawData = data.toString().trim();
            console.log('Received raw data:', rawData);

            // Store raw data
            currentTest.rawData.push(rawData);

            // Parse and store processed data
            const parsedData = parseHL7Message(data);
            currentTest.parsedData.push(parsedData);

            // Create the message to send to clients
            const message = JSON.stringify({
                type: 'tcpData',
                data: {
                    raw: rawData,
                    parsed: parsedData,
                    testInfo: {
                        username: currentTest.username,
                        sampleNumber: currentTest.sampleNumber
                    }
                }
            });

            // Broadcast to all connected web clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        socket.on('end', () => {
            console.log('Wondfo machine disconnected');
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });

    server.listen(port, machineIp, () => {
        console.log(`TCP Server listening on ${machineIp}:${port}`);
    });

    return server;
}

function setTestInfo(username, sampleNumber) {
    currentTest = {
        username,
        sampleNumber,
        rawData: [],
        parsedData: []
    };
}

module.exports = {
    start,
    setTestInfo
}; 