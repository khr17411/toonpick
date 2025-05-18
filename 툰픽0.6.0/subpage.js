

window.addEventListener('DOMContentLoaded', () => {
  initStarButton();         
  initCommentSubmit();      
  loadComments();           
});

function initStarButton() {
  const starButton = document.querySelector('.star-button');
  if (!starButton) return;

  starButton.addEventListener('click', () => {
    starButton.classList.toggle('active');
    starButton.classList.toggle('inactive');

    const title = document.querySelector('.webtoon-title')?.textContent.trim();
    if (!title) return;

    fetch('http://localhost:3000/api/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webtoonTitle: title, user: 'guest' })
    });
  });
}

function initCommentSubmit() {
  const submitBtn = document.querySelector('#commentSubmitButton');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitComment);
  }
}

function submitComment() {
  const title = document.querySelector('.webtoon-title')?.textContent.trim();
  const user = document.getElementById('nicknameInput')?.value || '익명';
  const content = document.getElementById('commentInput')?.value;

  if (!title || !content?.trim()) return alert('댓글을 입력하세요');

  fetch('http://localhost:3000/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ webtoonTitle: title, user, content })
  }).then(res => {
    if (res.ok) {
      document.getElementById('commentInput').value = '';
      loadComments();
    } else {
      alert('댓글 저장 실패');
    }
  });
}

function initCommentLikeButtons() {
  document.querySelectorAll('.comment-heart').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('inactive');
      
    });
  });
}

function loadComments() {
  const title = document.querySelector('.webtoon-title')?.textContent.trim();
  if (!title) return;

  fetch(`http://localhost:3000/api/comment?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      const commentList = document.querySelector('.comment-list');
      if (!commentList) return;

      commentList.innerHTML = '';
      data.sort((a, b) => b.likes - a.likes); 

      data.forEach(comment => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
          <div class="comment-left">
            <div class="comment-header">
              <span class="comment-user">${comment.user}</span>
              <span class="comment-date">${comment.timestamp?.slice(0, 10) || ''}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
          </div>
          <div class="comment-right">
            <button class="comment-heart inactive">♥</button>
            <div class="comment-heart-count">${comment.likes}</div>
          </div>
        `;
        commentList.appendChild(item);
      });

      initCommentLikeButtons();
    });
}
