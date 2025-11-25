const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Connects task to a specific user
  },
  text: {
    type: String,
    required: [true, 'Please add a text value'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);