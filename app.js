'use strict';

const express = require('express');
const path = require('path');
const app = express();
const wordWizard = require('./wordWizard/WordWizard.ts');

app.get('/api/test', function (req, res) {
  wordWizard.handleRequest(req, res);
});

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    }
});

app.use(express.static(path.join(__dirname, './client/dist')));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
