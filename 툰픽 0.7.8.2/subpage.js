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
      body: JSON.stringify({ user: '익명', webtoonTitle: title })
    }).catch(err => console.error('웹툰 클릭 기여도 증가 실패:', err));
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

  fetch(`http://localhost:3000/api/preference/count?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      const count = data.count || 0;
      const isFavorited = data.isFavorited || false;
      favoriteBtn.classList.toggle('active', isFavorited);
      favoriteBtn.textContent = `즐겨찾기 | ${count}`;
    });

  favoriteBtn.addEventListener('click', () => {
    const isActive = favoriteBtn.classList.contains('active');
    let count = parseInt(favoriteBtn.textContent.split('|')[1]?.trim() || '0', 10);
    const newCount = isActive ? count - 1 : count + 1;

    favoriteBtn.classList.toggle('active');
    favoriteBtn.textContent = `즐겨찾기 | ${newCount}`;

    fetch('http://localhost:3000/api/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: '익명', webtoonTitle: title })
    }).catch(err => alert('서버 오류로 즐겨찾기 저장에 실패했습니다.'));
  });

  fetch(`http://localhost:3000/api/comment?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(comment => renderComment({
        _id: comment._id,
        name: comment.user,
        text: comment.content,
        date: new Date(comment.timestamp).toISOString().slice(0, 10),
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0
      }));
      updateCommentCount(data.length);
    })
    .catch(err => console.error("❌ 초기 댓글 불러오기 실패:", err));
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
  .then(response => response.text())
  .then(() => {
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
      likes: comment.likes || 0,
      dislikes: comment.dislikes || 0
    }));
    updateCommentCount(data.length);
  })
  .catch(err => {
    console.error("❌ 서버 저장 실패:", err);
    alert("댓글 저장에 실패했습니다. 서버를 확인해주세요.");
  });
}

function renderComment({ _id, name, text, date, likes, dislikes }) {
  const commentSection = document.querySelector('.comment-section');
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <div class="comment-avatar"></div>
    <div class="comment-body">
      <div class="comment-header">${name} <span class="comment-date">${date}</span></div>
      <div class="comment-text">${text}</div>
      <div class="comment-actions">
        <span class="like-btn">👍 <span class="like-count">${likes}</span></span>
        <span class="dislike-btn">👎 <span class="dislike-count">${dislikes}</span></span>
      </div>
    </div>`;

  const likeBtn = commentDiv.querySelector('.like-btn');
  const dislikeBtn = commentDiv.querySelector('.dislike-btn');
  const likeCountSpan = commentDiv.querySelector('.like-count');
  const dislikeCountSpan = commentDiv.querySelector('.dislike-count');

  let likedState = false;
  let dislikedState = false;

  likeBtn.addEventListener('click', () => {
    likedState = !likedState;
    const count = parseInt(likeCountSpan.textContent, 10);
    likeCountSpan.textContent = likedState ? count + 1 : count - 1;

    fetch(`http://localhost:3000/api/comment/${_id}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel: !likedState })
    });

    // 싫어요 해제
    if (dislikedState) {
      dislikedState = false;
      const dCount = parseInt(dislikeCountSpan.textContent, 10);
      dislikeCountSpan.textContent = dCount - 1;
    }
  });

  dislikeBtn.addEventListener('click', () => {
    dislikedState = !dislikedState;
    const count = parseInt(dislikeCountSpan.textContent, 10);
    dislikeCountSpan.textContent = dislikedState ? count + 1 : count - 1;

    fetch(`http://localhost:3000/api/comment/${_id}/dislike`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel: !dislikedState })
    });

    // 좋아요 해제
    if (likedState) {
      likedState = false;
      const lCount = parseInt(likeCountSpan.textContent, 10);
      likeCountSpan.textContent = lCount - 1;
    }
  });

  commentSection.appendChild(commentDiv);
}

function updateCommentCount(count) {
  const commentCountElement = document.querySelector('.comment-count');
  commentCountElement.textContent = `댓글 ${count}`;
}

window.addComment = addComment;
