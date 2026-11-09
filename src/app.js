const express = require('express');

const app = express();

// Allows the server to read JSON request bodies
app.use(express.json());

// Checks whether the backend server is working
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

module.exports = app;