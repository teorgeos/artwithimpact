const express = require('express');
const router = express.Router();
const Sentence = require('../models/Sentence');

// ✅ [GET] 모든 문장 가져오기 (최대 13개, 오래된 순)
router.get('/', async (req, res) => {
  try {
    const sentences = await Sentence.find().sort({ timestamp: 1 }).limit(13);
    res.json(sentences);
  } catch (err) {
    res.status(500).json({ error: '문장을 불러오는 중 오류 발생' });
  }
});

// ✅ [POST] 기존 문장 수정 or 새 문장 추가
router.post('/', async (req, res) => {
  const { id, text, status } = req.body;

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: '문장은 10자 이상이어야 합니다.' });
  }

  try {
    if (id) {
      // 기존 문장 수정
      const updated = await Sentence.findByIdAndUpdate(
        id,
        {
          text,
          status,
          timestamp: new Date(), // 수정 시간 업데이트
        },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: '문장을 찾을 수 없습니다.' });
      }
      return res.json(updated);
    } else {
      // 새 문장 추가 (예외 상황)
      const newSentence = new Sentence({ text, status });
      await newSentence.save();
      return res.json(newSentence);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '문장을 저장하는 중 오류 발생' });
  }
});

module.exports = router;
