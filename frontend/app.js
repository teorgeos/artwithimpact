const container = document.getElementById('sentence-container');
const saveBtn = document.getElementById('save-btn');
let modifiedSentences = {};

async function loadSentences() {
  const res = await fetch('http://localhost:4000/sentences');
  const data = await res.json();

  data.forEach(sentence => {
    const div = document.createElement('div');
    div.className = 'sentence';
    div.textContent = sentence.text;
    div.setAttribute('contenteditable', 'true');
    div.dataset.id = sentence._id;
    div.dataset.original = sentence.text;

    div.addEventListener('input', () => {
      const newText = div.textContent.trim();
      if (newText !== div.dataset.original) {
        div.classList.add('modified');
        modifiedSentences[div.dataset.id] = { text: newText, status: 'modified' };
      } else {
        div.classList.remove('modified');
        delete modifiedSentences[div.dataset.id];
      }
    });

    container.appendChild(div);
  });
}

saveBtn.addEventListener('click', async () => {
  for (const [id, data] of Object.entries(modifiedSentences)) {
    await fetch('http://localhost:4000/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  alert("저장 완료");
  modifiedSentences = {};
  container.innerHTML = '';
  await loadSentences();
});

loadSentences();
