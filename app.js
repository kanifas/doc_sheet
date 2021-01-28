const path = require('path');
const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extendedCode: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));

const PORT = config.get('port') || 5000;
const MONGO_URI = config.get('mongoUri');

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'front', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'));
  });
}

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port: ${PORT}`);
    });
  } catch (err) {
    console.log('Server error:', err.message);
    process.exit(1);
  }
};

const stop = async () => {

};

start();
