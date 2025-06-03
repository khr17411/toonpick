document.addEventListener('DOMContentLoaded', () => {
  // OpenAI API Key
  const OPENAI_KEY = ''
  //  기본 요소들
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send');

  //  메시지 추가 함수
function appendMessage(role, text, imageUrl = null) {
  const el = document.createElement('div');
  el.className = `chat-message ${role}`;

  if (role === 'assistant' && imageUrl) {
    
    const wrapper = document.createElement('div');
    wrapper.className = 'webtoon-thumb-wrapper';
    
    const img = document.createElement('img');
    img.src = imageUrl.startsWith('http') ? `/thumb_proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
    img.alt = '웹툰 썸네일';
    wrapper.appendChild(img);

    el.appendChild(wrapper);
  }

  const span = document.createElement('span');
  span.innerHTML = text.replace(/\n/g, '<br>');
  el.appendChild(span);

  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

  //  메시지 전송 처리
async function onSendChat() {
  const userQ = chatInput.value.trim();
  if (!userQ) return;

  appendMessage('user', userQ); // 사용자 입력 출력
  chatInput.value = '';         // 입력창 초기화

  // 로컬 웹툰 점수 기반 추천
  let topResult = null;
  if (allWebtoons && allWebtoons.length > 0) {
    const terms = userQ.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const scored = allWebtoons.map(w => {
      const title = (w.title || '').toLowerCase();
      const author = (w.author || '').toLowerCase();
      const genres = (w.genres || []).join(' ').toLowerCase();
      const description = (w.description || '').toLowerCase();
      const textContent = `${title} ${author} ${genres} ${description}`;

      let score = 0;
      terms.forEach(term => {
        if (title.includes(term)) score += 3;
        if (author.includes(term)) score += 2;
        if (genres.includes(term)) score += 2;
        if (description.includes(term)) score += 1;
        if (textContent.includes(term) && score === 0) score += 0.5;
      });
      return { ...w, score };
    }).filter(w => w.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      topResult = scored[0];
    }
  }

  if (topResult) {
    // 로컬 검색 결과 표시
    let recommendationText = `이 웹툰은 어떠세요?\n\n"${topResult.title}"`;
    if (topResult.author) recommendationText += `\n작가: ${topResult.author}`;
    if (topResult.genres && topResult.genres.length > 0) recommendationText += `\n장르: ${topResult.genres.join(', ')}`;
    if (topResult.description) recommendationText += `\n\n줄거리: ${topResult.description}`;
    
    appendMessage('assistant', recommendationText, topResult.thumbnailUrl);
    return;
  }

  // GPT로 넘어가기 전 로딩 메시지 출력
  const loadingEl = appendMessage('assistant', 'AI가 답변을 생성 중입니다...');

  const dots = ['.', '..', '...'];
  let count = 0;
  const loadingInterval = setInterval(() => {
    const span = loadingEl.querySelector('span');
    if (span) {
      span.textContent = `추천을 찾는 중${dots[count % dots.length]}`;
      count++;
    }
  }, 600);

  try {
    const aiText = await fetchOpenAI(userQ); // AI 응답 텍스트 받기

    if (loadingEl && chatMessages.contains(loadingEl)) {
      chatMessages.removeChild(loadingEl);
    }

    // AI 응답에서 웹툰 제목 추출
    let matchedWebtoon = null;
    for (const w of allWebtoons) {
      if (aiText.includes(w.title)) {
        matchedWebtoon = w;
        break;
      }
    }

    // 이미지와 함께 출력
    if (matchedWebtoon && matchedWebtoon.thumbnailUrl) {
      appendMessage('assistant', aiText, matchedWebtoon.thumbnailUrl);
    } else {
      appendMessage('assistant', aiText); // 텍스트만 출력
    }

  } catch (err) {
    console.error("OpenAI API 호출 오류:", err);
    if (loadingEl && chatMessages.contains(loadingEl)) {
      chatMessages.removeChild(loadingEl);
    }
    appendMessage('assistant', '죄송해요, AI와 통신 중 오류가 발생했습니다.');
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

// 이전 흐름 기억
let chatHistory = [];

async function fetchOpenAI(prompt) {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Authorization': `Bearer ${OPENAI_KEY}`,
    'Content-Type': 'application/json'
  };

    const candidateList = allWebtoons
    .slice(0, 20)
    .map(w => `- ${w.title} (${w.genres?.join(', ')})`)
    .join('\n');

  const systemMsg = `너는 친절하고 유쾌한 ToonPick AI야. 아래 웹툰 목록 중에서 추천해줘.
사용자가 이미 추천받은 웹툰은 다시 추천하지 마.
특히 같은 제목을 반복하지 말고, 다른 웹툰을 제안해줘. 
추천 시 반드시 제목을 명확히 언급해. 예: "웹툰 '외모지상주의'를 추천합니다." 처럼 말해줘.
짧은 이유도 덧붙여줘. 예를 들어:
"요즘 이런 분위기 좋아하시나요? 저는 웹툰 '외모지상주의'를 추천드릴게요. 액션과 성장 요소가 정말 흥미로워요!"
아래는 추천할 수 있는 웹툰 목록이야.
${candidateList}`;

  if (chatHistory.length === 0) {
    chatHistory.push({ role: 'system', content: systemMsg });
  }

  chatHistory.push({ role: 'user', content: prompt });

  const body = JSON.stringify({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: '당신은 친절한 웹툰 추천 챗봇입니다. 추천 시 웹툰 제목을 명확하게 언급하세요. 예: "웹툰 \'전지적 독자 시점\'을 추천합니다."'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 250,
    temperature: 0.7
  });

  const response = await fetch(API_URL, { method: 'POST', headers, body });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}
