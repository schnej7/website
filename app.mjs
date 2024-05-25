'use strict';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const { WordWizard } = await import('./wordWizard/WordWizard.ts');

const app = express();

const _filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const _dirname = path.dirname(_filename); // get the name of the directory

const wordWizard = new WordWizard();
wordWizard.reset();

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
    res.sendFile(path.join(_dirname, 'client/dist', 'index.html'));
  }
});

app.use(express.static(path.join(_dirname, './client/dist')));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
