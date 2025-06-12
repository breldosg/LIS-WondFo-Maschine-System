const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const tcpListener = require('./tcp/listener');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Express configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.use('/', routes);

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Web client connected');
    
    ws.on('close', () => {
        console.log('Web client disconnected');
    });
});

// Keep track of all connected clients
wss.getClients = () => [...wss.clients].filter(client => client.readyState === WebSocket.OPEN);

// Configuration
const TCP_PORT = 8001;
const HOST_IP = '192.168.1.145';  // Your computer's Ethernet IP

// Start TCP server with machine IP
tcpListener.start(TCP_PORT, HOST_IP, wss);

// Start Express server
const EXPRESS_PORT = 4001;
server.listen(EXPRESS_PORT, () => {
    console.log(`Express server running on port ${EXPRESS_PORT}`);
    console.log(`TCP Server listening on ${HOST_IP}:${TCP_PORT}`);
}); 