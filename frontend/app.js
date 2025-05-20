
const distortedSentences = [
  '지구는 납작하다.',
  '고양이는 국회의원이다.',
  '시간은 거꾸로 흐른다.',
  '모든 국민은 거짓말쟁이다.',
  '햇빛은 냉동된다.',
  '공기는 유독하다.',
  '역사는 조작된다.',
  '진실은 없다.',
  '기억은 조작될 수 있다.',
  '지식은 통제된다.',
  '바다는 바닥났다.',
  '하늘은 닫혀 있다.',
  '책은 감시 도구다.'
];

let currentSentences = [];
let distortedIndex = null;
let selectedIndex = null;
let modifiedText = '';
let canDistortNext = true;

const container = document.getElementById('sentence-container');
const actionBox = document.getElementById('action-box');
const actionBtn = document.getElementById('action-btn');

function renderSentences(sentences) {
  container.innerHTML = '';
  sentences.forEach((s, index) => {
    const span = document.createElement('span');
    span.className = 'sentence';
    span.textContent = s.text;
    span.dataset.index = index;
    span.dataset.id = s._id;
    if (s.status === 'distorted') span.classList.add('distorting');
    span.addEventListener('mousedown', () => enterEditMode(index));
    container.appendChild(span);
  });
}

function distortRandomSentence() {
  if (!canDistortNext || distortedIndex !== null) return;

  // 보호 코드 추가: 문장 배열이 비었을 경우 그냥 return
  if (!currentSentences || currentSentences.length === 0) return;

  distortedIndex = Math.floor(Math.random() * currentSentences.length);
  const distortion = distortedSentences[Math.floor(Math.random() * distortedSentences.length)];
  currentSentences[distortedIndex].text = distortion;
  currentSentences[distortedIndex].status = 'distorted';
  renderSentences(currentSentences);
}


function enterEditMode(index) {
  if (currentSentences[index].status !== 'distorted') return;
  selectedIndex = index;
  const spans = document.querySelectorAll('.sentence');
  const target = spans[index];
  target.contentEditable = true;
  target.focus();
  actionBox.style.display = 'block';
  actionBtn.disabled = true;
  actionBtn.textContent = '수정하기';

  target.addEventListener('input', () => {
    modifiedText = target.textContent.trim();
    if (modifiedText.length >= 10) {
      actionBtn.disabled = false;
      actionBtn.textContent = '수정 완료';
      actionBtn.classList.add('active');
    } else {
      actionBtn.disabled = true;
      actionBtn.textContent = '수정하기';
      actionBtn.classList.remove('active');
    }
  });
}

actionBtn.addEventListener('click', async () => {
  if (selectedIndex === null || modifiedText.length < 10) return;
  const id = currentSentences[selectedIndex]._id;
  currentSentences[selectedIndex].text = modifiedText;
  currentSentences[selectedIndex].status = 'modified';
  canDistortNext = true;
  distortedIndex = null;
  selectedIndex = null;
  renderSentences(currentSentences);
  actionBox.style.display = 'none';

  // DB 저장 요청
  await fetch('http://localhost:4000/sentences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      text: modifiedText,
      status: 'modified'
    })
  });

  setTimeout(distortRandomSentence, 5000);
});

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost:4000/sentences');
    const data = await res.json();
    currentSentences = data;

    console.log("불러온 문장:", currentSentences);

    renderSentences(currentSentences);
    setTimeout(distortRandomSentence, 5000);
  } catch (err) {
    console.error('문장 불러오기 실패:', err);
  }
});
