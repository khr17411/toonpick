let commentStorageKey = 'comments_default';

// 페이지 로드 시 댓글 및 웹툰 정보 설정
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const author = params.get('author');
  const thumb = params.get('thumb');
  const desc = params.get('desc');
  const genre = params.get('genre');  // "스토리,판타지"
  const genres = genre ? genre.split(',') : [];  // 문자열 → 배열

  const genreContainer = document.getElementById('genre-container');
  if (genreContainer) {
    genreContainer.textContent = genres.join(', ');  // 배열 → 문자열로 출력
  }

  const favoriteBtn = document.querySelector('.favorite-btn');
  let isFavorited = false;
  let favoriteCount = 0;
  

  // 📌 서버에서 선호작 여부 및 총 count 받아오기
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

  // 즐겨찾기 버튼 클릭 시 서버에 POST 요청
  favoriteBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/api/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: '익명',
        webtoonTitle: title
      })
    })
      .then(res => res.text())
      .then(result => {
        if (result === '추가됨') {
          isFavorited = true;
          favoriteCount += 1;
        } else if (result === '삭제됨') {
          isFavorited = false;
          favoriteCount = Math.max(0, favoriteCount - 1);
        }
        favoriteBtn.classList.toggle('active', isFavorited);
        favoriteBtn.textContent = `즐겨찾기 | ${favoriteCount}`;
      })
      .catch(err => {
        console.error('❌ 즐겨찾기 토글 실패:', err);
        alert('서버 오류로 즐겨찾기를 저장할 수 없습니다.');
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

  if (title) {
    document.querySelector('.info h1').innerText = title;
  }
  if (author) document.querySelector('.info p:nth-of-type(1)').innerText = author;
  if (thumb) {
    document.querySelector('.header img').src = thumb;
    document.querySelector('.header-bg').style.backgroundImage = `url("${thumb}")`;
  }
  if (desc) document.querySelector('.description').innerText = desc;
  if (genre) document.querySelector('.genre').innerText = genre;
  if (link) document.getElementById('preview-link').href = link;
});

  if (author) document.querySelector('.info p:nth-of-type(1)').innerText = author;
  if (thumb) {
    document.querySelector('.header img').src = thumb;
    document.querySelector('.header-bg').style.backgroundImage = `url("${thumb}")`;
  }
  if (desc) document.querySelector('.description').innerText = desc;
  if (genre) document.querySelector('.genre').innerText = genre;
  if (link) document.getElementById('preview-link').href = link;

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
      body: JSON.stringify({
        user: '익명',
        webtoonTitle: title
      })
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


function addComment() {
  const username = document.getElementById('username').value.trim();
  const usercomment = document.getElementById('usercomment').value.trim();
  const webtoonTitle = document.querySelector('.info h1').innerText;

  if (!username || !usercomment) {
    alert("닉네임과 댓글을 모두 입력해주세요.");
    return;
  }

  console.log("🔴 fetch 시작");

  fetch('http://localhost:3000/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webtoonTitle,
      user: username,
      content: usercomment
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("서버 응답 실패");
    return response.text();
  })
  .then(data => {
    console.log("✅ 댓글이 서버에 저장되었습니다:", data);
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
    </div>
  `;

  const likeBtn = commentDiv.querySelector('.like-btn');
  const dislikeBtn = commentDiv.querySelector('.dislike-btn');

  if (liked) likeBtn.style.color = 'blue';
  if (disliked) dislikeBtn.style.color = 'red';

  likeBtn.addEventListener('click', () => {
    liked = !liked;
    const likeCountSpan = likeBtn.querySelector('.like-count');
    let count = liked ? 1 : 0;

    if (liked) {
      likeBtn.style.color = 'blue';

      fetch(`http://localhost:3000/api/comment/${_id}/like`, {
        method: 'PATCH'
      })
      .then(res => res.json())
      .then(data => {
        console.log('✅ 서버에 좋아요 반영됨:', data);
      })
      .catch(err => {
        console.error('❌ 좋아요 서버 반영 실패:', err);
      });

      if (disliked) {
        disliked = false;
        dislikeBtn.querySelector('.dislike-count').textContent = 0;
        dislikeBtn.style.color = 'black';
      }
    } else {
      likeBtn.style.color = 'black';
    }

    likeCountSpan.textContent = count;
  });

  dislikeBtn.addEventListener('click', () => {
    disliked = !disliked;
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    let count = disliked ? 1 : 0;

    if (disliked) {
      dislikeBtn.style.color = 'red';

      if (liked) {
        liked = false;
        likeBtn.querySelector('.like-count').textContent = 0;
        likeBtn.style.color = 'black';
      }
    } else {
      dislikeBtn.style.color = 'black';
    }

    dislikeCountSpan.textContent = count;
  });

  commentDiv._data = { _id, name, text, date, liked, disliked };
  commentSection.appendChild(commentDiv);
  console.log('댓글이 렌더링되었습니다:', { name, text, date, liked, disliked });
}

function updateCommentCount(count) {
  const commentCountElement = document.querySelector('.comment-count');
  commentCountElement.textContent = `댓글 ${count}`;
}

window.addComment = addComment;