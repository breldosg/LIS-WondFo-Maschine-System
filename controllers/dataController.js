const tcpListener = require('../tcp/listener');

let currentTest = {
    username: '',
    sampleNumber: '',
    rawData: [],
    parsedData: []
};

exports.startTest = (req, res) => {
    const { username, sampleNumber } = req.body;
    
    if (!username || !sampleNumber) {
        return res.status(400).json({
            error: 'Username and sample number are required'
        });
    }

    // Update test information
    currentTest = {
        username,
        sampleNumber,
        rawData: [],
        parsedData: []
    };

    // Update TCP listener with new test info
    tcpListener.setTestInfo(username, sampleNumber);

    res.json({
        message: 'Test started successfully',
        testInfo: { username, sampleNumber }
    });
};

exports.getTestData = (req, res) => {
    res.json(currentTest);
}; 