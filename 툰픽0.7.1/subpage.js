let commentStorageKey = 'comments_default';

// 페이지 로드 시 댓글 및 웹툰 정보 설정
document.addEventListener('DOMContentLoaded', () => {
  // URL 파라미터 읽기
  const params = new URLSearchParams(window.location.search);
  const title  = params.get('title');
  const author = params.get('author');
  const thumb  = params.get('thumb');
  const desc   = params.get('desc');
  const genre  = params.get('genre');
  const link = params.get('link'); 

  // 제목 표시 및 댓글 키 설정
  if (title) {
    document.querySelector('.info h1').innerText = title;
    commentStorageKey = `comments_${title}`; // title을 기반으로 댓글 저장 키 설정
  }

  if (author) document.querySelector('.info p:nth-of-type(1)').innerText = author;
  if (thumb) {
    document.querySelector('.header img').src = thumb;
    document.querySelector('.header-bg').style.backgroundImage = `url("${thumb}")`;
  }
  if (desc)   document.querySelector('.description').innerText = desc;
  if (genre) document.querySelector('.genre').innerText = genre;
  if (link) {
  document.getElementById('preview-link').href = link;
}

  // 댓글 불러오기
  const savedComments = JSON.parse(localStorage.getItem(commentStorageKey)) || [];
  savedComments.forEach(comment => renderComment(comment));
  updateCommentCount();

  // 즐겨찾기 상태 불러오기
  const favoriteStorageKey = `favorite_${title}`;
  const savedFavorite = JSON.parse(localStorage.getItem(favoriteStorageKey));

  const favoriteBtn = document.querySelector('.favorite-btn');
  if (savedFavorite) {
    favoriteBtn.textContent = `즐겨찾기 | ${savedFavorite.count}`;
    favoriteBtn.classList.toggle('active', savedFavorite.isFavorited);
  }

  // 즐겨찾기 버튼 클릭 이벤트
favoriteBtn.addEventListener('click', () => {
  // localStorage에서 즐겨찾기 상태를 읽어옴
  const savedFavorite = JSON.parse(localStorage.getItem(favoriteStorageKey));

  // 즐겨찾기 상태를 토글
  let isFavorited = !(savedFavorite?.isFavorited); // 현재 상태 반대로 토글
  let currentCount = savedFavorite?.count || 0;
  currentCount = isFavorited ? currentCount + 1 : currentCount - 1;

  // 상태 업데이트
  favoriteBtn.textContent = `즐겨찾기 | ${currentCount}`;
  favoriteBtn.classList.toggle('active', isFavorited);

  // localStorage에 즐겨찾기 상태 저장
  localStorage.setItem(favoriteStorageKey, JSON.stringify({
    isFavorited,
    count: currentCount
  }));
});

});

// 댓글 추가 함수
function addComment() {
  const username = document.getElementById('username').value.trim();
  const usercomment = document.getElementById('usercomment').value.trim();

  if (!username || !usercomment) {
    alert("닉네임과 댓글을 모두 입력해주세요.");
    return;
  }

  const newComment = {
    name: username,
    text: usercomment,
    date: new Date().toISOString().slice(0, 10),
    liked: false,
    disliked: false
  };

  renderComment(newComment);

  const existingComments = JSON.parse(localStorage.getItem(commentStorageKey)) || [];
  existingComments.push(newComment);
  localStorage.setItem(commentStorageKey, JSON.stringify(existingComments));

  updateCommentCount();

  // 입력 초기화
  document.getElementById('username').value = '';
  document.getElementById('usercomment').value = '';

  console.log('댓글이 추가되었습니다:', newComment);
}

// 댓글 렌더링 함수
function renderComment({ name, text, date, liked, disliked }) {
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

  // 초기 강조 표시
  if (liked) likeBtn.style.color = 'blue';
  if (disliked) dislikeBtn.style.color = 'red';

  // 좋아요 버튼 클릭 시 처리
  likeBtn.addEventListener('click', () => {
    liked = !liked;
    const likeCountSpan = likeBtn.querySelector('.like-count');
    let count = liked ? 1 : 0;

    if (liked) {
      likeBtn.style.color = 'blue';

      // 싫어요 취소
      if (disliked) {
        disliked = false;
        dislikeBtn.querySelector('.dislike-count').textContent = 0;
        dislikeBtn.style.color = 'black';
      }
    } else {
      likeBtn.style.color = 'black';
    }

    likeCountSpan.textContent = count;
    saveAllComments();
  });

  // 싫어요 버튼 클릭 시 처리
  dislikeBtn.addEventListener('click', () => {
    disliked = !disliked;
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    let count = disliked ? 1 : 0;

    if (disliked) {
      dislikeBtn.style.color = 'red';

      // 좋아요 취소
      if (liked) {
        liked = false;
        likeBtn.querySelector('.like-count').textContent = 0;
        likeBtn.style.color = 'black';
      }
    } else {
      dislikeBtn.style.color = 'black';
    }

    dislikeCountSpan.textContent = count;
    saveAllComments();
  });

  commentDiv._data = { name, text, date, liked, disliked };

  commentSection.appendChild(commentDiv);
  console.log('댓글이 렌더링되었습니다:', { name, text, date, liked, disliked });
}

function saveAllComments() {
  const comments = [];
  document.querySelectorAll('.comment').forEach(commentDiv => {
    const { name, text, date } = commentDiv._data;
    const liked = commentDiv.querySelector('.like-count').textContent === '1';
    const disliked = commentDiv.querySelector('.dislike-count').textContent === '1';
    comments.push({ name, text, date, liked, disliked });
  });

  localStorage.setItem(commentStorageKey, JSON.stringify(comments));
}

// 댓글 수 갱신
function updateCommentCount() {
  const commentCountElement = document.querySelector('.comment-count');
  const savedComments = JSON.parse(localStorage.getItem(commentStorageKey)) || [];
  commentCountElement.textContent = `댓글 ${savedComments.length}`;
}
