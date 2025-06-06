// main.js
// ── 썸네일 프록시용 헬퍼 함수 ──
function proxy(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "smurfs.toptoon.com") {
      return u.href;
    }
    return `/thumb_proxy?url=${encodeURIComponent(u.href)}`;
  } catch (e) {
    return url;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const OPENAI_KEY = "";
  fetch('http://localhost:3000/api/recommend?user=익명')
    .then(res => res.json())
    .then(data => {
      const genres = Array.isArray(data.genres) ? data.genres : [];
      renderRecommendation(`사용자가 많이 찾은 장르 1위 (${genres[0] || '알 수 없음'})`, data.top1);
      renderRecommendation(`사용자가 많이 찾은 장르 2위 (${genres[1] || '알 수 없음'})`, data.top2);
      renderRecommendation(`사용자가 많이 찾은 장르 3위 (${genres[2] || '알 수 없음'})`, data.top3);
    })
    .catch(err => {
      console.error(' 추천 로딩 실패:', err);
    });
  function renderRecommendation(title, list) {
  const container = document.getElementById('recommend-list');
  const currentTab = document.querySelector('.nav-menu li.active')?.innerText;
  if (currentTab !== '추천') return;  
  if (!container) {
    console.error(' recommend-list DOM 요소를 찾을 수 없습니다.');
    return;
  }

  // 실제 추천 카드 렌더링
  const section = document.createElement('div');
  section.className = 'recommend-subsection';

  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  const row = document.createElement('div');
  row.className = 'webtoon-row';

  list.forEach(w => {
    if (!w.title || !w.thumbnail) return;
    const card = document.createElement('div');
    card.className = 'webtoon-card';
    const thumb = w.thumbnail || '';
    const title = w.title || '제목 없음';
    const author = w.author || '작가 미상';
    const desc = w.description || '설명 없음';
    const genres = Array.isArray(w.genres) ? w.genres.join(',') : '';
    const link = w.link || '#';
    card.innerHTML = `<img src="${thumb}" alt="${title}" /><p>${title}</p>`;
    card.addEventListener('click', () => {
      const params = new URLSearchParams({
        title,
        author,
        thumb,
        desc,
        genre: genres,
        link
      });
      window.location.href = `subpage.html?${params.toString()}`;
    });
    row.appendChild(card);
  });

  section.appendChild(row);
  container.appendChild(section);
}

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
      renderWeekdayCards(
        allWebtoons.filter(w => w.weekday === btn.dataset.day)
      );
    });
  });

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

  let user_name = "사용자";
  document.getElementById('nickname-display-greeting').innerText = user_name;
  document.getElementById('nickname-display-setting').innerText = user_name;

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

  document.getElementById('change-nickname-button').addEventListener('click', () => {
    const nick = prompt('새 닉네임을 입력하세요:', user_name);
    if (nick && nick.trim()) {
      user_name = nick.trim();
      document.getElementById('nickname-display-greeting').innerText = user_name;
      document.getElementById('nickname-display-setting').innerText = user_name;
    }
  });

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

  document.getElementById('logout-button').addEventListener('click', () => {
    document.getElementById('logout-modal').classList.remove('hidden');
  });

  document.getElementById('cancel-logout').addEventListener('click', () => {
    document.getElementById('logout-modal').classList.add('hidden');
  });

  let allWebtoons = [];
  fetch('craw_all.json')
    .then(r => r.json())
    .then(data => { allWebtoons = data; })
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

    // 추천 탭 진입 시 다시 fetch
    if (idx === 0) {
      aiNav.classList.remove('hidden');
      popSec.style.display = '';
      newSec.classList.remove('hidden');

      const recommendContainer = document.getElementById('recommend-list');
      recommendContainer.innerHTML = ''; // 초기화 후 새로 로드

      fetch('http://localhost:3000/api/recommend?user=익명')
        .then(res => res.json())
        .then(data => {
          const genres = Array.isArray(data.genres) ? data.genres : [];
          renderRecommendation(`사용자가 많이 찾은 장르 1위 (${genres[0] || '알 수 없음'})`, data.top1);
          renderRecommendation(`사용자가 많이 찾은 장르 2위 (${genres[1] || '알 수 없음'})`, data.top2);
          renderRecommendation(`사용자가 많이 찾은 장르 3위 (${genres[2] || '알 수 없음'})`, data.top3);
        })
        .catch(err => {
          console.error('❌ 추천 로딩 실패:', err);
        });
    } else {
      aiNav.classList.add('hidden');
      popSec.style.display = 'none';
      newSec.classList.add('hidden');
    }

    if (idx !== 0) {
    const recommendContainer = document.getElementById('recommend-list');
    if (recommendContainer) recommendContainer.innerHTML = '';  // 요일/장르 탭일 땐 추천 비우기
    }

    weekdaySec.classList.toggle('hidden', idx !== 1);
    genreSec.classList.toggle('hidden', idx !== 2);
    wFilter.classList.toggle('active', idx === 1);
    gFilter.classList.toggle('active', idx === 2);

    weekdayTitle.textContent = '요일별 웹툰';
    genreTitle.textContent = '장르별 웹툰';
    document.getElementById('weekday-webtoon-list').innerHTML = '';
    document.getElementById('genre-webtoon-list').innerHTML = '';

    if (idx === 1) {
      document.querySelectorAll('.day-btn').forEach(x => x.classList.remove('active'));
      const mon = document.querySelector('.day-btn[data-day="MONDAY"]');
      mon.classList.add('active');
      weekdayTitle.textContent = '월요일 웹툰 추천';
      renderWeekdayCards(allWebtoons.filter(w => w.weekday === 'MONDAY'));
    }
    if (idx === 2) {
      const activeBtns = Array.from(gFilter.querySelectorAll('.genre-btn.active'));
      const selectedKeys = activeBtns.map(b => b.dataset.genre);
      const selectedLabels = activeBtns.map(b => b.textContent);

      if (selectedKeys.length) {
        genreTitle.textContent = `${selectedLabels.join(' + ')} 웹툰 추천`;
        const filtered = allWebtoons.filter(w =>
          selectedKeys.every(key => (w.genres || []).includes(key))
        );
        renderGenreCards(filtered);
      } else {
        genreTitle.textContent = '장르별 웹툰';
        renderGenreCards(allWebtoons);
      }
    }
  });
});


  // ── 신작 렌더러 ──
  // ── 신작 렌더러 ──
function renderCards(list) {
  const c = document.getElementById('webtoon-list');
  if (!c) return;
  c.innerHTML = '';
  list.forEach(w => {
    const card = document.createElement('div');
    card.className = 'new-item';
    card.dataset.day         = w.weekday;
    card.dataset.genres      = (w.genres || []).join(',');
    card.dataset.description = w.description || '';
    card.innerHTML = 
      `<a href="${w.url}" target="_blank">
        <img src="${proxy(w.thumbnailUrl)}" alt="${w.title}">
      </a>
      <div class="new-info">
        <h3>${w.title}</h3>
        <p>${w.author}</p>
      </div>`;
    c.appendChild(card);
  });
  bindPreviewEvents();
}

// ── 요일 렌더러 ──
const weekdayContainer = document.getElementById('weekday-webtoon-list');

function renderWeekdayCards(list) {
  weekdayContainer.innerHTML = '';
  list.forEach(wt => {
    const card = document.createElement('div');
    card.className = 'new-item';

    // 기본 정보
    const title  = wt.title || '제목 없음';
    const author = wt.author || '작가 미상';
    const thumb  = proxy(wt.thumbnailUrl);
    const desc   = wt.description || '설명 없음';
    const genres = (wt.genres || []).join(',');
    const link   = wt.url || '#';
    
    card.innerHTML = `
      <img src="${thumb}" alt="${title}">
      <div class="new-info">
        <h3>${title}</h3>
        <p>${author}</p>
      </div>`;

    card.addEventListener('click', () => {
      const params = new URLSearchParams({
        title,
        author,
        thumb,
        desc,
        genre: genres,
        link
      });
      window.location.href = `subpage.html?${params.toString()}`;
    });

    weekdayContainer.appendChild(card);
  });
}


// ── 하드코딩된 장르 버튼에 클릭 토글 기능 등록 ──
function setupGenreButtons() {
  const wrap     = document.getElementById('genre-filters');
  const titleEl  = document.getElementById('genre-title');
  const popSec   = document.querySelector('.popular-section');
  const newSec   = document.querySelector('.new-section');
  const genreSec = document.getElementById('genre-section');

  wrap.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!btn.classList.contains('active')) {
        btn.classList.add('active', 'include');
      } else if (btn.classList.contains('include')) {
        btn.classList.replace('include', 'exclude');
      } else {
        btn.classList.remove('active', 'exclude');
      }

      popSec.style.display   = 'none';
      newSec.style.display   = 'none';
      genreSec.style.display = '';

      const includeKeys = Array.from(
        wrap.querySelectorAll('.genre-btn.include')
      ).map(x => x.dataset.genre);
      const excludeKeys = Array.from(
        wrap.querySelectorAll('.genre-btn.exclude')
      ).map(x => x.dataset.genre);

      let includePart = includeKeys.length
        ? includeKeys.join(' + ') + ' 웹툰 추천'
        : '웹툰 추천';
      if (excludeKeys.length) {
        includePart += ` (제외: ${excludeKeys.join(', ')} 웹툰)`;
      }
      titleEl.textContent = includePart;

      const filtered = allWebtoons.filter(w => {
        const genres = w.genres || [];
        if (!includeKeys.every(k => genres.includes(k))) return false;
        if (excludeKeys.some(k => genres.includes(k))) return false;
        return true;
      });

      renderGenreCards(filtered);
    });
  });
}
setupGenreButtons();

function renderGenreCards(list) {
  const c = document.getElementById('genre-webtoon-list');
  c.innerHTML = '';
  list.forEach(w => {
    const card = document.createElement('div');
    card.className = 'new-item';
    card.dataset.description = w.description || '';
    card.dataset.genres = (w.genres || []).join(',');
    card.innerHTML = 
      `<a href="${w.url}" target="_blank">
        <img src="${proxy(w.thumbnailUrl)}" alt="${w.title}">
      </a>
      <div class="new-info">
        <h3>${w.title}</h3>
        <p>${w.author}</p>
      </div>`;
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
      let genre    = card.dataset.genres || '장르 미정';
      const link   = card.querySelector('a').href;

      try {
        const parsed = JSON.parse(genre);
        if (Array.isArray(parsed)) {
          genre = parsed.join(',');
        }
      } catch (err) {}

      const params = new URLSearchParams({
        title,
        author,
        thumb,
        desc,
        genre,
        link  
      });

      window.location.href = `subpage.html?${params.toString()}`;
    };
  });
}

// ── ToonPick AI 채팅 모달 추가 로직 ──
const chatModal     = document.getElementById('chat-modal');
const chatOverlay   = chatModal.querySelector('.modal-overlay');
const chatCloseBtn  = document.getElementById('chat-close');  
const chatMessages  = document.getElementById('chat-messages');
const chatInput     = document.getElementById('chat-input');
const chatSendBtn   = document.getElementById('chat-send');

document.querySelector('.ai-button').addEventListener('click', () => {
  chatMessages.innerHTML = '';
  chatModal.classList.remove('hidden');
  chatModal.classList.add('show');
  chatInput.focus();
});
chatCloseBtn.addEventListener('click', closeChatModal);
chatOverlay.addEventListener('click', closeChatModal);
function closeChatModal() {
  chatModal.classList.remove('show');
  setTimeout(() => chatModal.classList.add('hidden'), 300);
}

function appendMessage(role, text) {
  const el = document.createElement('div');
  el.className = `chat-message ${role}`;
  el.innerText = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

chatSendBtn.addEventListener('click', onSendChat);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') onSendChat();
});

async function onSendChat() {
  const userQ = chatInput.value.trim();
  if (!userQ) return;
  chatInput.value = '';
  appendMessage('user', userQ);

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

  const candidateList = top5.map(w =>
    `- ${w.title} (요일:${w.weekday}, 장르:${(w.genres||[]).join('/')})`
  ).join('\\n');
  const systemMsg = '너는 ToonPick AI야. 아래 5개 후보 중에서 사용자가 요청한 웹툰을 추천하거나 설명을 제공해줘:\\n' +
                    candidateList;

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