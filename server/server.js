require('dotenv').config();

const app  = require('./src/app');
const PORT = parseInt(process.env.PORT, 10) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `[server] Running → http://localhost:${PORT}  (${process.env.NODE_ENV || 'development'})`
    );
  });
}

module.exports = app;
