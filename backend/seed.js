const mongoose = require('mongoose');
const Sentence = require('./models/Sentence');
require('dotenv').config();

const seedSentences = [
  '지구는 둥글다.', '고양이는 귀엽다.', '시간은 계속 흐른다.',
  '모든 국민은 평등하다.', '햇빛은 따뜻하다.', '공기는 소중하다.',
  '역사는 반복된다.', '진실은 밝혀진다.', '기억은 중요하다.',
  '지식은 힘이다.', '바다는 넓다.', '하늘은 높다.', '책은 지혜의 샘이다.'
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Sentence.deleteMany();
    await Sentence.insertMany(seedSentences.map(text => ({ text, status: 'original' })));
    console.log('초기 문장 삽입 완료');
    process.exit();
  } catch (err) {
    console.error('에러:', err);
    process.exit(1);
  }
}

seed();
