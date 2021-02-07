const path = require('path');
const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extendedCode: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/doctor', require('./routes/doctor.routes'));

const PORT = config.get('port') || 5000;
const MONGO_URI = config.get('mongoUri');

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'front', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'));
  });
}

let server = null;

const start = async () => {
  //exec(`kill $(lsof -ti:5000,3000)`);
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    server = app.listen(PORT, (err) => {
      console.log(`Сервер стартовал на порту: ${PORT}`);
    });

  } catch (err) {
    console.log('Server error:', err.message);
    process.exit(1);
  }
};

/*process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});*/

/*const stop = () => {
  if (server) {
    server.close(() => console.log('Сервер закрыт'));
    server = null;
  }
};*/

/*const restart = () => {
  stop();
  start();
};*/

/*process.on('uncaughtException', () => {
  process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGTERM', () => {
  process.kill(process.pid, 'SIGUSR2');
});*/
/*process.on('disconnect', stop);
process.on('SIGINT', () => {
  //console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  stop();
});*/

start();
