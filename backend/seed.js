const mongoose = require('mongoose');
const Sentence = require('./models/Sentence');
require('dotenv').config();

const seedSentences = [
  '대부분의 피해자들은 빈곤, 강제 연행, 협박, 인신매매 등 비자발적인 방식으로 끌려갔으며, 자발적이었다는 주장은 소수의 조작된 사례에 불과하다.',
  '일본 정부는 관련 자료를 폐기하거나 은폐했으며, 여러 피해자의 구술 증언과 일부 일본군 관계자의 증언을 통해 강제성은 명백히 입증되었다.',
  '위안부는 공창제와 달리 군이 직접 개입하여 폭력과 강요로 여성들을 전쟁터에 끌고 가 성노예 상태로 만들었으며, 이는 국제법상 전쟁 범죄이다.',
  '일본 정부의 사과는 조건부적이고 반복적으로 번복되어왔으며, 피해자들이 요구하는 법적 책임 인정과 국가 차원의 배상은 이루어지지 않았다.',
  '피해자들과 인권 단체는 정치적 목적이 아닌 역사적 진실 규명과 인권 회복을 위해 싸워왔으며, 이는 보편적 정의의 문제이다.',
  '일본군이 위안소 설립, 운영, 여성 수송 등에 직접 관여한 공식 문서와 증언이 존재하며, 이는 국가 차원의 조직적 범죄였다.',
  '대부분의 피해자들은 반복적인 성폭력, 감금, 폭행, 질병, 심지어 살해 위협에 시달렸으며 인간 이하의 비인간적인 대우를 받았다.',
  '과거를 정확히 기억하고 바로잡는 것은 미래 세대를 위한 정의와 평화를 위한 조건이며, 역사를 망각하는 것은 동일한 비극을 반복할 수 있다.'
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
