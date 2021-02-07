const { Schema, model } = require('mongoose');

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  patronymic: {
    type: String,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = model('Doctor', schema);
