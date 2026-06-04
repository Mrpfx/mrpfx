const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

// The standalone build generates a server.js in the app folder
// We require it here to act as the entry point for cPanel
require('./mrp_frontend/server.js');
