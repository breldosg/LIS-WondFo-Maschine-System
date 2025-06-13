const {initializeWondfoLabConnection} = require('./wondfo_lab_connection');
const {initializeWebClientConnection} = require('./web_client_connection/webClient');



module.exports = {
    initializeWondfoLabConnection,
    initializeWebClientConnection
}