const currentUser = "익명";
document.getElementById("username").textContent = "사용자";
let favoriteData = [];
let recentData = [];


document.addEventListener("DOMContentLoaded", function () {
  const favoritesBtn = document.getElementById("favorites-tab");
  const recentBtn = document.getElementById("recent-tab");
  const favoritesList = document.getElementById("favorites-list");
  const recentList = document.getElementById("recent-list");

  favoritesBtn.addEventListener("click", () => {
    favoritesBtn.classList.add("active");
    recentBtn.classList.remove("active");
    favoritesList.classList.remove("hidden");
    recentList.classList.add("hidden");
  });

  recentBtn.addEventListener("click", () => {
    recentBtn.classList.add("active");
    favoritesBtn.classList.remove("active");
    recentList.classList.remove("hidden");
    favoritesList.classList.add("hidden");
  });
});


const sortToggleBtn = document.getElementById("sort-toggle-btn");
const sortOptions = document.getElementById("sort-options");
const sortOptionBtns = document.querySelectorAll(".sort-option");

document.querySelector('.back-button').addEventListener('click', function () {
  window.location.href = 'main.html';
});

document.querySelector('.alarm').addEventListener('click', function () {
  window.location.href = 'notice.html';
});

document.querySelector('.settings-icon').addEventListener('click', function () {
  window.location.href = 'setting.html';
});

sortToggleBtn.addEventListener("click", () => {
  sortOptions.style.display = sortOptions.style.display === "flex" ? "none" : "flex";
});

sortOptionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortOptionBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sortToggleBtn.textContent = btn.textContent + " ▼";
    sortOptions.style.display = "none";

    const selectedSort = btn.textContent.includes("제목") ? "title" : "timestamp";
    if (document.getElementById("favorites-tab").classList.contains("active")) {
      renderFavorites(favoriteData, selectedSort);
    } else {
      renderRecent(recentData, selectedSort);
    }
  });
});


function renderFavorites(list, sortKey = "timestamp") {
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.innerHTML = "";

  const sorted = [...list].sort((a, b) => {
    if (sortKey === "title") return a.webtoonTitle.localeCompare(b.webtoonTitle);
    if (sortKey === "timestamp") return new Date(b.timestamp) - new Date(a.timestamp);
    return 0;
  });

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.webtoonTitle}">
      <div class="item-info">
        <h3>${item.webtoonTitle}<p>${item.author}</p></h3>
        <p>${item.genre}</p>
      </div>
      <button class="favorite-toggle active">♥</button>
    `;

    div.addEventListener("click", () => {
      const params = new URLSearchParams({
        title: item.webtoonTitle,
        author: item.author,
        genre: Array.isArray(item.genre) ? item.genre.join(',') : item.genre,
        thumb: item.thumbnail,
        desc: item.description || "설명이 없습니다",
        link: item.link || "#"
      });
      window.location.href = `subpage.html?${params.toString()}`;
    });

    const favButton = div.querySelector('.favorite-toggle');
    favButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = favButton.classList.contains('active');
      fetch("http://localhost:3000/api/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser,
          webtoonTitle: item.webtoonTitle,
          author: item.author,
          genre: item.genre,
          thumbnail: item.thumbnail,
        }),
      })
      .then((res) => {
        if (res.ok) {
          favButton.classList.toggle("active");
          favButton.classList.toggle("inactive");
          if (isActive) div.remove();
        } else {
          console.error("❌ 즐겨찾기 실패");
        }
      })
      .catch((err) => console.error("❌ 네트워크 에러:", err));
    });

    favoritesList.appendChild(div);
  });
}


function renderRecent(list, sortKey = "timestamp") {
  const recentList = document.getElementById("recent-list");
  recentList.innerHTML = "";

  const sorted = [...list].sort((a, b) => {
    if (sortKey === "title") return a.webtoonTitle.localeCompare(b.webtoonTitle);
    if (sortKey === "timestamp") return new Date(b.timestamp) - new Date(a.timestamp);
    return 0;
  });

  sorted.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.webtoonTitle}">
      <div class="item-info">
        <h3>${item.webtoonTitle}<p>${item.author}</p></h3>
        <p>${item.genre}</p>
      </div>
      <button class="view-button" onclick="window.open('${item.link}', '_blank')">
        <span class="view-label">보러가기 ➤</span>
      </button>
    `;

    div.addEventListener("click", () => {
      const params = new URLSearchParams({
        title: item.webtoonTitle,
        author: item.author,
        genre: Array.isArray(item.genre) ? item.genre.join(',') : item.genre,
        thumb: item.thumbnail,
        desc: item.description || "설명이 없습니다",
        link: item.link || "#"
      });
      window.location.href = `subpage.html?${params.toString()}`;
    });

    recentList.appendChild(div);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/preference/user/익명")
    .then((res) => res.json())
    .then((data) => {
      favoriteData = data;
      renderFavorites(favoriteData, "timestamp");
    });

  fetch('http://localhost:3000/api/recent/user/익명')
    .then(res => res.json())
    .then(data => {
      recentData = data;
      renderRecent(recentData, "timestamp");
    })
    .catch(console.error);
});
