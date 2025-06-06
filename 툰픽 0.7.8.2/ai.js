.recommend-section {
  margin-top: 32px;
}

.recommend-subsection {
  background-color: #2e2e2e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 32px;
}


.recommend-subsection {
  background-color: #2e2e2e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 32px;
}

.webtoon-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px; 
  margin-top: 12px;
}

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