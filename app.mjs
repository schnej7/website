'use strict';

import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { createServer } from "http";
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';

const { WordWizard } = await import('./wordWizard/WordWizard.ts');

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app);

const _filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const _dirname = path.dirname(_filename); // get the name of the directory

const wordWizard = new WordWizard();
wordWizard.resetGame();

const wss = new WebSocketServer({ server: httpServer });
// const wss = new WebSocketServer({ server: app });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);
  });

  ws.send('something');
});

app.use(morgan('tiny'));
app.use(express.json());

app.get('/api/wordWizard', function (req, res) {
  wordWizard.onGet(req, res);
});

app.post('/api/wordWizard', function (req, res) {
  wordWizard.onPost(req, res);
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
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
