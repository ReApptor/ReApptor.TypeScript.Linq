'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Public directory
app.use(express.static('docs'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
