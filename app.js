const express = require('express');
const compression = require('compression');

const { commonErrorHandler } = require('./helpers/common-function.helper');
const routes = require('./routes');

const app = express();
app.use(express.json());

// gzip compression module
app.use(compression());

routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
  const message = 'Invalid endpoint';
  const statusCode = 404;
  commonErrorHandler(req, res, message, statusCode);
});

module.exports = app;
