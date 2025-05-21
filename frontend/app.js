
const distortedSentences = [
  '자발적으로 위안부가 되었다는 증언도 있다.',
  '강제 연행의 문서는 존재하지 않는다.',
  '당시에는 공창제도가 있었으니 위안부도 합법적인 성노동이었다.',
  '이미 보상과 사과가 충분히 이루어졌다.',
  '위안부 문제는 정치적 목적의 도구로 이용되고 있다.',
  '위안부 제도는 민간 업자들이 운영한 것이다.',
  '피해자들은 위안소에서 비교적 좋은 대우를 받았다',
  '더 이상 과거를 들춰내지 말아야 한다'
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
