function proxy(url) {
  if (!url) return 'noimage.jpg';
  return url;
}

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
      `- ${w.title} (요일:${w.weekday}, 장르:${(w.genres || []).join('/')}, 썸네일:${w.thumbnailUrl}, 링크:${w.url})`
    ).join('\n');
    const systemMsg = `
    너는 ToonPick AI야. 응답 형식은 딱 두 부분이야.

    첫째 줄  : 사용자가 듣기 좋은 한-두 문장 인삿말/도입부  
    둘째 줄~: 아래 예시와 완전히 동일한 **JSON 배열**  
    [
      {"title":"웹툰제목",
      "desc":"설명",
      "thumbnailUrl":"후보 리스트에 있는 썸네일URL만",
      "url":"후보 리스트에 있는 링크만"}
    ]

    규칙  
    - JSON 배열 안 3개 웹툰만 추천  
    - thumbnailUrl 과 url은 ‘후보’에 있는 값만 복사  
    - 인삿말 1줄 + JSON 외엔 아무것도 쓰지 마

    후보:
    ${candidateList}
    `;

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

      const gptReply = choices[0].message.content.trim();
      const firstBracket = gptReply.indexOf('[');
      let greeting = '';
      let jsonString = gptReply;

      if (firstBracket > -1) {          
        greeting   = gptReply.slice(0, firstBracket).trim();   
        jsonString = gptReply.slice(firstBracket).trim();     
      }

      if (greeting) appendMessage('assistant', greeting);

      try {
        const arr = JSON.parse(jsonString);
        arr.forEach(w => {
          chatMessages.innerHTML += `
            <div class="chat-message assistant card">
              <img src="${proxy(w.thumbnailUrl)}" style="width:96px;border-radius:12px;margin-bottom:8px;">
              <div><b>${w.title}</b></div>
              <div>${w.desc}</div>
              <a href="${w.url}" class="go-btn" target="_blank">바로가기</a>
            </div>
          `;
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } catch (e) {
        // 파싱 실패(즉, 그냥 텍스트일 경우 기존 방식 fallback)
        appendMessage('assistant', gptReply);
      }
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
  fetch('craw_all.json')
    .then(r => r.json())
    .then(data => {
      allWebtoons = data;
    })
    .catch(console.error);
});
