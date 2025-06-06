// search.js

// ── 전역 변수 ──
let data = []; // craw_all.json에서 불러온 모든 웹툰 데이터

// ── DOM 요소 ──
const input = document.getElementById("searchInput");
const resultList = document.getElementById("resultList");
const recentList = document.getElementById("recentList");
const searchResultSection = document.getElementById("searchResultSection");
const defaultSection = document.getElementById("defaultSection");

// 페이지 로드 직후 검색 결과 영역 숨기기
searchResultSection.style.display = "none";

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

// ── craw_all.json 불러오기 ──
fetch('craw_all.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    renderRecent();
  })
  .catch(err => {
    console.error('craw_all.json 로드 실패:', err);
  });

// ── 입력 이벤트: 실시간 필터링 ──
input.addEventListener("input", function () {
  const keyword = this.value.trim();
  if (keyword === "") {
    resultList.innerHTML = "";
    searchResultSection.style.display = "none";  // 검색 결과 숨기기
    defaultSection.style.display = "block";      // 최근/추천 검색어 보이기
  } else {
    defaultSection.style.display = "none";       // 최근/추천 숨기기
    searchResultSection.style.display = "block"; // 검색 결과 보이기

    // 제목(title) 또는 장르(genres 배열)의 항목 중 keyword가 포함된 웹툰 필터링
    const results = data.filter(item => {
      const inTitle = item.title && item.title.toLowerCase().includes(keyword.toLowerCase());
      const inGenres = Array.isArray(item.genres) && item.genres.some(g => g.toLowerCase().includes(keyword.toLowerCase()));
      return inTitle || inGenres;
    });
    showResults(results);
  }
});

// ── Enter 키 누르면 최근 검색어 저장 ──
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const keyword = this.value.trim();
    if (keyword !== "") {
      updateRecent(keyword);
    }
  }
});

// ── 검색 결과 보여주기 ──
function showResults(results) {
  const keyword = input.value.trim().toLowerCase();

  if (results.length === 0) {
    resultList.innerHTML = `<div class="result-item">검색 결과가 없습니다.</div>`;
    searchResultSection.style.display = "block";
  } else {
    resultList.innerHTML = results.map(item => {
      const titleText = item.title || '제목 없음';
      const author = item.author || '작가 미상';
      const genresArr = Array.isArray(item.genres) ? item.genres.join(', ') : '';
      const thumbUrl = item.thumbnailUrl || '';
      const link = item.url || '#';

      // 검색어 강조
      const highlightedTitle = highlightText(titleText, keyword);
      const highlightedAuthor = highlightText(author, keyword);
      const highlightedGenres = highlightText(genresArr, keyword);

      return `
        <div class="result-card">
          <a href="${link}" class="result-link" target="_blank">
            <div class="result-card-content">
              <img src="${proxy(thumbUrl)}" alt="${titleText}">
              <div class="result-info">
                <div class="title">
                  ${highlightedTitle}
                  <span class="author">${highlightedAuthor}</span>
                </div>
                <div class="tag">${highlightedGenres}</div>
              </div>
            </div>
          </a>
        </div>
      `;
    }).join("");
    searchResultSection.style.display = "block";
  }
}

// ── 텍스트 강조 함수 ──
function highlightText(text, keyword) {
  if (!text) text = "";
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// ── 최근 검색어 저장 ──
function updateRecent(keyword) {
  if (!localStorage.recentKeywords) localStorage.recentKeywords = JSON.stringify([]);
  let recents = JSON.parse(localStorage.recentKeywords);
  if (!recents.includes(keyword)) {
    recents.unshift(keyword);
    if (recents.length > 5) recents.pop();
    localStorage.recentKeywords = JSON.stringify(recents);
  }
  renderRecent();
}

// ── 최근 검색어 렌더링 ──
function renderRecent() {
  const recents = JSON.parse(localStorage.recentKeywords || "[]");
  recentList.innerHTML = recents.map(word =>
    `<div class="recent-keyword">
       <span onclick="useRecent('${word}')">${word}</span>
       <button onclick="deleteRecent('${word}')">✕</button>
     </div>`
  ).join("");
  defaultSection.style.display = "block";
}

// ── 최근 검색어 클릭 시 검색 ──
window.useRecent = function(word) {
  input.value = word;
  const keyword = word.toLowerCase();
  const results = data.filter(item =>
    item.title && item.title.toLowerCase().includes(keyword)
  );
  defaultSection.style.display = "none";
  searchResultSection.style.display = "block";
  showResults(results);
};

// ── 최근 검색어 삭제 ──
window.deleteRecent = function(word) {
  let recents = JSON.parse(localStorage.recentKeywords || "[]");
  recents = recents.filter(k => k !== word);
  localStorage.recentKeywords = JSON.stringify(recents);
  renderRecent();
};

// ── 추천 검색어(장르 태그) 클릭 시 검색 ──
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const word = tag.textContent.trim();
    input.value = word;
    updateRecent(word);

    const keyword = word.toLowerCase();
    const results = data.filter(item =>
      (item.title && item.title.toLowerCase().includes(keyword)) ||
      (Array.isArray(item.genres) && item.genres.some(g => g.toLowerCase().includes(keyword)))
    );
    defaultSection.style.display = "none";
    searchResultSection.style.display = "block";
    showResults(results);
  });
});

// ── 초기 렌더링 ──
renderRecent();
