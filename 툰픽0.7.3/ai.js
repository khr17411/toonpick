document.addEventListener('DOMContentLoaded', () => {
  // OpenAI API Key
  const OPENAI_KEY = ''
  //  기본 요소들
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send');

  //  메시지 추가 함수
  function appendMessage(role, text) {
    const el = document.createElement('div');
    el.className = `chat-message ${role}`;
    el.innerText = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  //  메시지 전송 처리
  async function onSendChat() {
    const userQ = chatInput.value.trim();
    if (!userQ) return;
    chatInput.value = '';
    appendMessage('user', userQ);

    //  웹툰 추천 후보 만들기
    const terms = userQ.toLowerCase().split(/\s+/);
    const scored = allWebtoons.map(w => {
      const text = (w.title + ' ' + w.description + ' ' + (w.genres || []).join(' ')).toLowerCase();
      let score = 0;
      terms.forEach(t => { if (t && text.includes(t)) score++; });
      return { webtoon: w, score };
    });

    const filtered = scored.filter(i => i.score > 0)
                           .sort((a, b) => b.score - a.score)
                           .map(i => i.webtoon);
    let top5 = filtered.slice(0, 5);
    if (top5.length < 5) {
      const rest = allWebtoons.filter(w => !top5.includes(w)).slice(0, 5 - top5.length);
      top5 = top5.concat(rest);
    }

    const candidateList = top5.map(w =>
      `- ${w.title} (요일:${w.weekday}, 장르:${(w.genres || []).join('/')})`
    ).join('\n');
    const systemMsg = `너는 ToonPick AI야. 아래 5개 후보 중에서 사용자가 요청한 웹툰을 추천하거나 설명을 제공해줘:\n${candidateList}`;

    const loadingEl = appendMessage('loading', 'ToonPick AI가 입력 중…');

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENAI_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user', content: userQ }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!res.ok) throw new Error((await res.json()).error?.message || res.statusText);
      const { choices } = await res.json();
      chatMessages.removeChild(loadingEl);
      appendMessage('assistant', choices[0].message.content.trim());
    } catch (err) {
      console.error(err);
      chatMessages.removeChild(loadingEl);
      appendMessage('assistant', '죄송해요, AI 호출 중 오류가 발생했습니다.');
    }
  }

  //  전송 버튼 & Enter 키
  chatSendBtn.addEventListener('click', onSendChat);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSendChat();
  });

  //  추천 질문 버튼 자동 전송
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.innerText;
      onSendChat();
    });
  });

  //  검색 기능
  const chatSearchInput = document.getElementById("chat-search");
  if (chatSearchInput) {
    chatSearchInput.addEventListener("input", () => {
      const keyword = chatSearchInput.value.trim().toLowerCase();
      const messages = chatMessages.querySelectorAll(".chat-message");

      messages.forEach(msg => {
        const text = msg.textContent.toLowerCase();
        if (!keyword) {
          msg.style.display = "block";
          msg.innerHTML = msg.textContent;
        } else if (text.includes(keyword)) {
          msg.style.display = "block";
          msg.innerHTML = msg.textContent.replace(
            new RegExp(`(${keyword})`, "gi"),
            '<mark>$1</mark>'
          );
        } else {
          msg.style.display = "none";
        }
      });
    });
  }

  //  웹툰 데이터 로드
  let allWebtoons = [];
  fetch('naver_web.json')
    .then(r => r.json())
    .then(data => {
      allWebtoons = data;
    })
    .catch(console.error);
});
