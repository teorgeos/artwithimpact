document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('sentence-container');
    const actionBox = document.getElementById('action-box');
    const actionBtn = document.getElementById('action-btn');
  
    let selectedEl = null;
    let modifiedText = '';
    let fetchedSentences = [];
  
    async function renderSentences() {
      try {
        const res = await fetch('http://localhost:4000/sentences');
        fetchedSentences = await res.json();
      } catch (err) {
        console.warn("서버 연결 실패. 임시 문장으로 실행합니다.");
        fetchedSentences = [
          { _id: '1', text: '지구는 평평하다.', status: 'original' },
          { _id: '2', text: '고양이는 대통령이다.', status: 'original' },
          { _id: '3', text: '기억은 조작된다.', status: 'original' }
        ];
      }
  
      container.innerHTML = '';
      fetchedSentences.forEach(sentence => {
        const div = document.createElement('div');
        div.className = 'sentence';
        div.textContent = sentence.text;
        div.setAttribute('contenteditable', 'true');
        div.dataset.id = sentence._id;
        div.dataset.original = sentence.text;
        div.contentEditable = false;
  
        div.addEventListener('click', () => enterEditMode(div));
        container.appendChild(div);
      });
    }
  
    function startDistortionLoop() {
      setInterval(() => {
        if (container.children.length === 0) return;
        const randomIndex = Math.floor(Math.random() * container.children.length);
        const div = container.children[randomIndex];
        if (div === selectedEl) return;
  
        div.classList.add('distorting');
        setTimeout(() => {
          const newText = getRandomDistortion();
          div.textContent = newText;
          div.classList.remove('distorting');
        }, 500);
      }, 5000);
    }
  
    function getRandomDistortion() {
      const pool = [
        '지구는 납작하다.',
        '고양이는 국회의원이다.',
        '모든 기억은 조작될 수 있다.',
        '진실은 없다.',
        '시간은 거꾸로 흐른다.'
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  
    function enterEditMode(div) {
      selectedEl = div;
      div.contentEditable = true;
      div.focus();
  
      actionBox.style.display = 'block';
      actionBtn.textContent = '수정하기';
      actionBtn.disabled = true;
  
      div.addEventListener('input', () => {
        modifiedText = div.textContent.trim();
        if (modifiedText === '') {
          actionBtn.textContent = '수정하기';
          actionBtn.disabled = true;
        } else {
          actionBtn.textContent = '수정완료';
          actionBtn.disabled = false;
        }
      });
    }
  
    actionBtn.addEventListener('click', async () => {
      if (!selectedEl || modifiedText === '') return;
  
      selectedEl.textContent = modifiedText;
      selectedEl.contentEditable = false;
  
      await fetch('http://localhost:4000/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: modifiedText,
          status: 'modified'
        })
      });
  
      actionBox.style.display = 'none';
      selectedEl = null;
      modifiedText = '';
    });
  
    // 실행
    renderSentences();
    startDistortionLoop();
  });
  