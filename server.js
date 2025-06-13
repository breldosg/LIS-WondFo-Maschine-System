const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const {initializeWondfoLabConnection} = require('./websockets/wondfo_lab_connection');
const {initializeWebClientConnection} = require('./websockets/web_client_connection/webClient');
const {wondfoTCPPort, wondfoMachineIp, serverIp, serverPort} = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Express configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start TCP server with machine IP
initializeWebClientConnection(wss);
initializeWondfoLabConnection(wondfoTCPPort, wondfoMachineIp, wss);

// Start Express server
server.listen(serverPort, () => {
    console.log(`Express server running on port ${serverPort}`);
    console.log(`TCP Server listening on ${wondfoMachineIp}:${wondfoTCPPort}`);
}); 