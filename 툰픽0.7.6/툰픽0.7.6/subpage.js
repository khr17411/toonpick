let commentStorageKey = 'comments_default';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const author = params.get('author');
  const thumb = params.get('thumb');
  const desc = params.get('desc');
  const genre = params.get('genre');
  const genres = genre ? genre.split(',') : [];
  const link = params.get('link');


  if (title) {
    fetch('http://localhost:3000/api/genre_click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: '익명',
        webtoonTitle: title
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('기여도 증가 실패');
      return res.json();
    })
    .then(data => {
      console.log('✅ 웹툰 클릭 기여도 증가:', data);
    })
    .catch(err => {
      console.error('❌ 웹툰 클릭 기여도 증가 실패:', err);
    });
  }

  if (title) document.querySelector('.info h1').innerText = title;
  if (author) document.querySelector('.info p:nth-of-type(1)').innerText = author;
  if (thumb) {
    document.querySelector('.header img').src = thumb;
    document.querySelector('.header-bg').style.backgroundImage = `url("${thumb}")`;
  }
  if (desc) document.querySelector('.description').innerText = desc;
  if (genre) document.querySelector('.genre').innerText = genre;
  if (link) document.getElementById('preview-link').href = link;

  const favoriteBtn = document.querySelector('.favorite-btn');
  let isFavorited = false;
  let favoriteCount = 0;

  fetch(`http://localhost:3000/api/preference/count?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      favoriteCount = data.count || 0;
      isFavorited = data.isFavorited || false;
      favoriteBtn.classList.toggle('active', isFavorited);
      favoriteBtn.textContent = `즐겨찾기 | ${favoriteCount}`;
    })
    .catch(err => {
      console.error('❌ 선호작 초기 로딩 실패:', err);
    });

  favoriteBtn.addEventListener('click', () => {
    const isCurrentlyFavorited = favoriteBtn.classList.contains('active');
    let countText = favoriteBtn.textContent.split('|')[1]?.trim() || "0";
    let count = parseInt(countText, 10) || 0;
    const newState = !isCurrentlyFavorited;
    const newCount = newState ? count + 1 : count - 1;

    favoriteBtn.classList.toggle('active', newState);
    favoriteBtn.textContent = `즐겨찾기 | ${newCount}`;

    fetch('http://localhost:3000/api/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: '익명', webtoonTitle: title })
    })
    .then(res => {
      if (!res.ok) throw new Error('서버 통신 실패');
      return res.text();
    })
    .then(msg => {
      console.log('✅ 서버 응답:', msg);
    })
    .catch(err => {
      console.error('❌ 즐겨찾기 서버 저장 실패:', err);
      alert('서버 오류로 즐겨찾기 저장에 실패했습니다.');
    });
  });

  // 댓글 불러오기
  fetch(`http://localhost:3000/api/comment?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(comment => renderComment({
        _id: comment._id,
        name: comment.user,
        text: comment.content,
        date: new Date(comment.timestamp).toISOString().slice(0, 10),
        liked: false,
        disliked: false
      }));
      updateCommentCount(data.length);
    })
    .catch(err => {
      console.error("❌ 초기 댓글 불러오기 실패:", err);
    });
});

function addComment() {
  const username = document.getElementById('username').value.trim();
  const usercomment = document.getElementById('usercomment').value.trim();
  const webtoonTitle = document.querySelector('.info h1').innerText;

  if (!username || !usercomment) {
    alert("닉네임과 댓글을 모두 입력해주세요.");
    return;
  }

  fetch('http://localhost:3000/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ webtoonTitle, user: username, content: usercomment })
  })
  .then(response => {
    if (!response.ok) throw new Error("서버 응답 실패");
    return response.text();
  })
  .then(data => {
    document.getElementById('username').value = '';
    document.getElementById('usercomment').value = '';
    document.querySelector('.comment-section').innerHTML = '<p class="comment-count"></p>';
    return fetch(`http://localhost:3000/api/comment?title=${encodeURIComponent(webtoonTitle)}`);
  })
  .then(res => res.json())
  .then(data => {
    data.forEach(comment => renderComment({
      _id: comment._id,
      name: comment.user,
      text: comment.content,
      date: new Date(comment.timestamp).toISOString().slice(0, 10),
      liked: false,
      disliked: false
    }));
    updateCommentCount(data.length);
  })
  .catch(err => {
    console.error("❌ 서버 저장 실패:", err);
    alert("댓글 저장에 실패했습니다. 서버를 확인해주세요.");
  });
}

function renderComment({ _id, name, text, date, liked, disliked }) {
  const commentSection = document.querySelector('.comment-section');
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <div class="comment-avatar"></div>
    <div class="comment-body">
      <div class="comment-header">
        ${name} <span class="comment-date">${date}</span>
      </div>
      <div class="comment-text">${text}</div>
      <div class="comment-actions">
        <span class="reply-count">답글 0</span>
        <span class="like-btn">👍 <span class="like-count">${liked ? 1 : 0}</span></span>
        <span class="dislike-btn">👎 <span class="dislike-count">${disliked ? 1 : 0}</span></span>
      </div>
    </div>`;
  commentSection.appendChild(commentDiv);
}

function updateCommentCount(count) {
  const commentCountElement = document.querySelector('.comment-count');
  commentCountElement.textContent = `댓글 ${count}`;
}

window.addComment = addComment;
