
const initializeWebClientConnection = (wss) => {
    console.log('Web client connected');

    wss.on('connection', (ws) => {
        console.log('Web client connected');
    });

    wss.getClients = () => [...wss.clients].filter(client => client.readyState === WebSocket.OPEN);
}

module.exports = {
    initializeWebClientConnection
}