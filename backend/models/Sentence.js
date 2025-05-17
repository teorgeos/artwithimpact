// backend/models/Sentence.js
const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
  text: String,
  status: { type: String, enum: ['original', 'modified', 'new'], default: 'original' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sentence', SentenceSchema);
