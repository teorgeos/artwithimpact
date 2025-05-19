const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['original', 'modified', 'distorted'], default: 'original' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sentence', SentenceSchema);
