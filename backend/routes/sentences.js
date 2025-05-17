// backend/routes/sentences.js
const express = require('express');
const router = express.Router();
const Sentence = require('../models/Sentence');

router.get('/', async (req, res) => {
  const sentences = await Sentence.find();
  res.json(sentences);
});

router.post('/', async (req, res) => {
  const { text, status } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: '문장은 비어 있을 수 없습니다.' });
  }

  const newSentence = new Sentence({ text, status });
  await newSentence.save();
  res.json(newSentence);
});

module.exports = router;
