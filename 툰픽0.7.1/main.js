// main.js

document.addEventListener('DOMContentLoaded', () => {
  // 0) OpenAI API Key
  const OPENAI_KEY = ""

  // 1) Swiper 초기화
  const swiper = new Swiper('.swiper', {
    loop: true,
    centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  // 2) MY 페이지 & 설정 토글
  let user_name = "사용자";
  const greetingNickname = document.getElementById('nickname-display-greeting');
  const settingNickname  = document.getElementById('nickname-display-setting');
  greetingNickname.innerText = user_name;
  settingNickname.innerText  = user_name;

  document.getElementById('my-button').addEventListener('click', () => {
    const c = document.getElementById('mypage-container');
    if (c.style.display) {
      c.classList.toggle('show');
      document.getElementById('my-button').classList.toggle('active');
      setTimeout(() => c.style.display = c.classList.contains('show') ? 'block' : 'none', 300);
    } else {
      c.style.display = 'block';
      setTimeout(() => c.classList.add('show'), 10);
      document.getElementById('my-button').classList.add('active');
    }
  });

  document.getElementById('setting-button').addEventListener('click', () => {
    const c = document.getElementById('setting-container');
    if (c.style.display) {
      c.classList.toggle('show');
      setTimeout(() => c.style.display = c.classList.contains('show') ? 'block' : 'none', 300);
    } else {
      c.style.display = 'block';
      setTimeout(() => c.classList.add('show'), 10);
    }
  });

  document.getElementById('setting-back-button').addEventListener('click', () => {
    const c = document.getElementById('setting-container');
    c.classList.remove('show');
    setTimeout(() => c.style.display = 'none', 300);
  });

  // 3) 닉네임 변경
  document.getElementById('change-nickname-button').addEventListener('click', () => {
    const nick = prompt('새 닉네임을 입력하세요:', user_name);
    if (nick && nick.trim()) {
      user_name = nick.trim();
      greetingNickname.innerText = user_name;
      settingNickname.innerText  = user_name;
    }
  });

  // 4) 즐겨찾기 / 최근본 탭
  document.getElementById('favorites-tab').addEventListener('click', () => {
    document.getElementById('favorites-tab').classList.add('active');
    document.getElementById('recent-tab').classList.remove('active');
    document.getElementById('favorites-list').classList.remove('hidden');
    document.getElementById('recent-list').classList.add('hidden');
  });
  document.getElementById('recent-tab').addEventListener('click', () => {
    document.getElementById('recent-tab').classList.add('active');
    document.getElementById('favorites-tab').classList.remove('active');
    document.getElementById('recent-list').classList.remove('hidden');
    document.getElementById('favorites-list').classList.add('hidden');
  });

  // 5) 로그아웃 모달
  document.getElementById('logout-button').addEventListener('click', () => {
    document.getElementById('logout-modal').classList.remove('hidden');
  });
  document.getElementById('cancel-logout').addEventListener('click', () => {
    document.getElementById('logout-modal').classList.add('hidden');
  });

  // ── 데이터 로드 & 신작 필터 렌더 ──
  let allWebtoons = [];
  fetch('naver_web.json')
    .then(r => r.json())
    .then(data => {
      allWebtoons = data;
      const cutoff = new Date('2025-03-01');
      const newWebtoons = allWebtoons.filter(w => {
        const d = new Date(w.startDate.replace(/\./g, '-'));
        return d >= cutoff;
      });
      renderCards(newWebtoons);
      renderGenreButtons(allWebtoons);
    })
    .catch(console.error);

  // ── 탭 네비게이션 ──
  const tabs         = document.querySelectorAll('.nav-menu li');
  const aiNav        = document.getElementById('ai-subtitle');
  const popSec       = document.querySelector('.popular-section');
  const newSec       = document.querySelector('.new-section');
  const weekdaySec   = document.getElementById('weekday-section');
  const genreSec     = document.getElementById('genre-section');
  const wFilter      = document.getElementById('weekday-filters');
  const gFilter      = document.getElementById('genre-filters');
  const weekdayTitle = document.getElementById('weekday-title');
  const genreTitle   = document.getElementById('genre-title');

  tabs.forEach((li, idx) => {
    li.addEventListener('click', e => {
      e.preventDefault();
      tabs.forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      if (idx === 0) aiNav.classList.remove('hidden');
      else           aiNav.classList.add('hidden');
      popSec.style.display       = idx === 0 ? '' : 'none';
      newSec.classList.toggle('hidden', idx !== 0);
      weekdaySec.classList.toggle('hidden', idx !== 1);
      genreSec.classList.toggle('hidden', idx !== 2);
      wFilter.classList.toggle('active', idx === 1);
      gFilter.classList.toggle('active', idx === 2);

      weekdayTitle.textContent = '요일별 웹툰';
      genreTitle.textContent   = '장르별 웹툰';
      document.getElementById('weekday-webtoon-list').innerHTML = '';
      document.getElementById('genre-webtoon-list').innerHTML   = '';

      if (idx === 1) {
        document.querySelectorAll('.day-btn').forEach(x => x.classList.remove('active'));
        const mon = document.querySelector('.day-btn[data-day="MONDAY"]');
        mon.classList.add('active');
        weekdayTitle.textContent = '월요일 웹툰 추천';
        renderWeekdayCards(allWebtoons.filter(w => w.weekday === 'MONDAY'));
      }
      if (idx === 2) {
        document.querySelectorAll('.genre-btn').forEach(x => x.classList.remove('active'));
        const dram = document.querySelector('.genre-btn[data-genre="드라마"]');
        dram.classList.add('active');
        genreTitle.textContent = '드라마 웹툰 추천';
        renderGenreCards(allWebtoons.filter(w => (w.genres||[]).includes('드라마')));
      }
    });
  });

  // ── 신작 렌더러 ──
  function renderCards(list) {
    const c = document.getElementById('webtoon-list');
    c.innerHTML = '';
    list.forEach(w => {
      const card = document.createElement('div');
      card.className = 'new-item';
      card.dataset.day         = w.weekday;
      card.dataset.genres      = (w.genres || []).join(',');
      card.dataset.description = w.description || '';
      card.innerHTML = `
        <a href="${w.url}" target="_blank">
          <img src="${w.thumbnailUrl}" alt="${w.title}">
        </a>
        <div class="new-info">
          <h3>${w.title}</h3>
          <p>${w.author}</p>
        </div>
      `;
      c.appendChild(card);
    });
    bindPreviewEvents();
  }

  // ── 요일 렌더러 ──
  const weekdayContainer = document.getElementById('weekday-webtoon-list');
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      document.querySelectorAll('.day-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      weekdayTitle.textContent = `${btn.textContent} 웹툰 추천`;
      popSec.style.display = 'none';
      newSec.classList.add('hidden');
      weekdaySec.classList.remove('hidden');
      wFilter.classList.add('active');
      renderWeekdayCards(allWebtoons.filter(w => w.weekday === btn.dataset.day));
    });
  });
  function renderWeekdayCards(list) {
    weekdayContainer.innerHTML = '';
    list.forEach(wt => {
      const card = document.createElement('div');
      card.className = 'new-item';
      card.dataset.description = wt.description || '';
      card.innerHTML = `
        <a href="${wt.url}" target="_blank">
          <img src="${wt.thumbnailUrl}" alt="${wt.title}">
        </a>
        <div class="new-info">
          <h3>${wt.title}</h3>
          <p>${wt.author}</p>
        </div>
      `;
      weekdayContainer.appendChild(card);
    });
    bindPreviewEvents();
  }

  // ── 장르 렌더러 ──
  const genreContainer = document.getElementById('genre-webtoon-list');
  function renderGenreButtons(list) {
    let genres = [...new Set(list.flatMap(w => w.genres || []))]
      .filter(g => g !== '장르 미상')
      .sort();
    const wrap = document.getElementById('genre-filters');
    wrap.innerHTML = '';
    genres.forEach(g => {
      const btn = document.createElement('button');
      btn.className     = 'genre-btn';
      btn.dataset.genre = g;
      btn.textContent   = g;
      wrap.appendChild(btn);
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        document.querySelectorAll('.genre-btn').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        genreTitle.textContent = `${g} 웹툰 추천`;
        popSec.style.display   = 'none';
        newSec.classList.add('hidden');
        genreSec.classList.remove('hidden');
        wrap.classList.add('active');
        renderGenreCards(list.filter(w => (w.genres||[]).includes(g)));
      });
    });
  }
  function renderGenreCards(list) {
    const c = document.getElementById('genre-webtoon-list');
    c.innerHTML = '';
    list.forEach(w => {
      const card = document.createElement('div');
      card.className = 'new-item';
      card.dataset.description = w.description || '';
      card.innerHTML = `
        <a href="${w.url}" target="_blank">
          <img src="${w.thumbnailUrl}" alt="${w.title}">
        </a>
        <div class="new-info">
          <h3>${w.title}</h3>
          <p>${w.author}</p>
        </div>
      `;
      c.appendChild(card);
    });
    bindPreviewEvents();
  }

  // ── 미리보기 모달 ──
  const modal        = document.getElementById('preview-modal');
  const overlay      = modal.querySelector('.modal-overlay');
  const closeBtn     = document.getElementById('preview-close');
  const previewImg   = document.getElementById('preview-img');
  const previewTitle = document.getElementById('preview-title');
  const previewDesc  = document.getElementById('preview-desc');
  const previewLink  = document.getElementById('preview-link');
  function bindPreviewEvents() {
  document.querySelectorAll('.new-item').forEach(card => {
    card.onclick = e => {
      e.preventDefault();

      const title  = card.querySelector('h3').innerText;
      const author = card.querySelector('p').innerText;
      const thumb  = card.querySelector('img').getAttribute('src');
      const desc   = card.dataset.description || '줄거리 정보 없음';
      const genre  = card.dataset.genres || '장르 미정';
      const link   = card.dataset.link; 

      // URL 파라미터로 넘길 값들
      const params = new URLSearchParams({
        title,
        author,
        thumb,
        desc,
        genre,
        link  
      });

      // subpage.html로 이동
      window.location.href = `subpage.html?${params.toString()}`;
    };
  });
}



  // ── ToonPick AI 채팅 모달 추가 로직 ──

  // 채팅 모달 요소
  const chatModal     = document.getElementById('chat-modal');
  const chatOverlay   = chatModal.querySelector('.modal-overlay');
  const chatCloseBtn  = document.getElementById('chat-close');  
  const chatMessages  = document.getElementById('chat-messages');
  const chatInput     = document.getElementById('chat-input');
  const chatSendBtn   = document.getElementById('chat-send');

  // ai-button 클릭 시 채팅 모달 열기
  document.querySelector('.ai-button').addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatModal.classList.remove('hidden');
    chatModal.classList.add('show');
    chatInput.focus();
  });
  // 채팅 모달 닫기
  chatCloseBtn.addEventListener('click', closeChatModal);
  chatOverlay.addEventListener('click', closeChatModal);
  function closeChatModal() {
    chatModal.classList.remove('show');
    setTimeout(() => chatModal.classList.add('hidden'), 300);
  }

  // 메시지 추가 함수
  function appendMessage(role, text) {
    const el = document.createElement('div');
    el.className = `chat-message ${role}`;
    el.innerText = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  // 전송 핸들러
  chatSendBtn.addEventListener('click', onSendChat);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') onSendChat();
  });

  async function onSendChat() {
    const userQ = chatInput.value.trim();
    if (!userQ) return;
    chatInput.value = '';
    appendMessage('user', userQ);

    // 키워드 매칭 5개 후보 생성
    const terms = userQ.toLowerCase().split(/\s+/);
    const scored = allWebtoons.map(w => {
      const text = (w.title + ' ' + w.description + ' ' + (w.genres||[]).join(' ')).toLowerCase();
      let score = 0;
      terms.forEach(t => { if (t && text.includes(t)) score++; });
      return { webtoon: w, score };
    });
    const filtered = scored.filter(i => i.score>0)
                           .sort((a,b) => b.score-a.score)
                           .map(i=>i.webtoon);
    let top5 = filtered.slice(0,5);
    if (top5.length < 5) {
      const rest = allWebtoons.filter(w => !top5.includes(w)).slice(0,5-top5.length);
      top5 = top5.concat(rest);
    }

    // 시스템 메시지
    const candidateList = top5.map(w =>
      `- ${w.title} (요일:${w.weekday}, 장르:${(w.genres||[]).join('/')})`
    ).join('\n');
    const systemMsg = '너는 ToonPick AI야. 아래 5개 후보 중에서 사용자가 요청한 웹툰을 추천하거나 설명을 제공해줘:\n' +
                      candidateList;

    // 로딩 표시
    const loadingEl = appendMessage('loading', 'ToonPick AI가 입력 중…');

    // API 호출
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENAI_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',      // 여기만 변경했습니다
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user',   content: userQ },
          ],
          temperature: 0.7,
          max_tokens: 150
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

}); // end of DOMContentLoaded
