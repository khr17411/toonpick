document.getElementById("username").textContent = "사용자";

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

sortToggleBtn.addEventListener("click", () => {
  sortOptions.style.display = sortOptions.style.display === "flex" ? "none" : "flex";
});

sortOptionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 전체 초기화
    sortOptionBtns.forEach(b => b.classList.remove("active"));

    // 선택 항목 표시
    btn.classList.add("active");

    // 텍스트 업데이트
    sortToggleBtn.textContent = btn.textContent + " ▼";

    // 드롭다운 닫기
    sortOptions.style.display = "none";
  });
});

//별표 토글
  document.querySelectorAll('.favorite-toggle').forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('active')) {
        button.classList.remove('active');
        button.classList.add('inactive');
      } else {
        button.classList.remove('inactive');
        button.classList.add('active');
      }
    });
  });
