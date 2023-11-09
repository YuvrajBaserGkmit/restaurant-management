require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');

const startServer = async function () {
  try {
    await sequelize.authenticate();
    const serverPort = process.env.SERVER_PORT || 5000;
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---\n\n`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

startServer();
