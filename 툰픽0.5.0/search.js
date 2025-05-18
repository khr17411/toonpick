const data = [
    { title: "화산귀환", tag: "#액션 #무협", img: "images/화산귀환.jpg", rating: "⭐⭐⭐⭐", author: "LICO/비가", addimg: "images/네이버 웹툰.jpg", href: "#" },
    { title: "무한의 마법사", tag: "#판타지 #아카데미", img: "images/무한의 마법사.jpg", rating: "⭐⭐⭐", author: "김지우", addimg: "images/카카오페이지.jpg", href: "subpage.html"},
    { title: "별이삼샵", tag: "#러브코미디 #청춘", img: "images/별이삼샵.jpg", rating: "⭐⭐⭐", author: "혀노", addimg: "images/네이버 웹툰.jpg", href: "#" },
    { title: "외모지상주의", tag: "#판타지 #학원", img: "images/외모지상주의.jpg", rating: "⭐⭐⭐", author: "박태준", addimg: "images/네이버 웹툰.jpg", href: "#" },
    { title: "중증외상센터", tag: "#판타지 #의학", img: "images/중증외상센터.jpg", rating: "⭐⭐", author: "홍비치라", addimg: "images/네이버 웹툰.jpg", href: "#" },
    { title: "스위트홈", tag: "#액션 #스릴러", img: "images/스위트홈.jpg", rating: "⭐⭐⭐", author: "김칸비", addimg: "images/네이버 웹툰.jpg", href: "#" },
    { title: "원드 브레이커", tag: "#드라마 #학원", img: "images/원드 브레이커.jpg", rating: "⭐⭐⭐", author: "조용석", addimg: "images/네이버 웹툰.jpg", href: "#"},
    { title: "나혼자만 레벨업", tag: "#판타지 #액션 #헌터", img: "images/나혼자만 레벨업.jpg", rating: "⭐⭐⭐⭐", author: "추공", addimg: "images/카카오페이지.jpg", href: "#" }
];




const input = document.getElementById("searchInput");
const resultList = document.getElementById("resultList");
const recentList = document.getElementById("recentList");
const searchResultSection = document.getElementById("searchResultSection");
const defaultSection = document.getElementById("defaultSection");

// 엔터 키 입력 시 검색 실행 및 최근 검색어 업데이트
input.addEventListener("input", function () {
    const keyword = this.value.trim();
    if (keyword === "") {
        resultList.innerHTML = "";
        searchResultSection.style.display = "none";  // 검색 결과 숨기기
        defaultSection.style.display = "block";  // 최근/추천 검색어 다시 보여주기
    } else {
        // 검색 결과 화면처럼 보이게 하기
        defaultSection.style.display = "none";  // 최근/추천 숨기기
        searchResultSection.style.display = "block";

        // 실시간 결과 필터링 (입력할 때마다 보여주기)
        const results = data.filter(item =>
            item.title.toLowerCase().includes(keyword.toLowerCase()) ||
            item.author.toLowerCase().includes(keyword.toLowerCase()) ||
            item.tag.toLowerCase().includes(keyword.toLowerCase())
        );
        showResults(results);
    }
});

// 엔터 키를 눌렀을 때 최근 검색어 저장
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const keyword = this.value.trim();
        if (keyword !== "") {
            updateRecent(keyword);  // 최근 검색어 저장
        }
    }
});

// 검색 결과 보여주기
function showResults(results) {
    const keyword = input.value.trim().toLowerCase();  // 검색어를 소문자로 변환하여 처리

    if (results.length === 0) {
        resultList.innerHTML = `<div class="result-item">검색 결과가 없습니다.</div>`;
        searchResultSection.style.display = "block";
    } else {
        resultList.innerHTML = results.map(item => {
            const title = item.title;
            const author = item.author;
            const tag = item.tag;

            const highlightedTitle = highlightText(title, keyword);  // 제목 강조
            const highlightedAuthor = highlightText(author, keyword);  // 작가 강조
            const highlightedTag = highlightText(tag, keyword);  // 태그 강조

            return `
                <div class="result-card">
                    <a href="${item.href}" class="result-link">
                        <div class="result-card-content">
                            <img src="${item.img}" alt="${item.title}">
                            <div class="result-info">
                                <div class="title">
                                    <img src="${item.addimg}" alt="${item.author}" class="addimg"> 
                                    ${highlightedTitle} 
                                    <span class="author">${highlightedAuthor}</span>
                                </div>
                                <div class="tag">${highlightedTag}</div>
                                <div class="rating">${item.rating}</div>
                            </div>
                        </div>
                    </a>
                </div>`;
        }).join("");
        searchResultSection.style.display = "block";
    }
}

// 검색어를 강조하는 함수
function highlightText(text, keyword) {
    // undefined 또는 null일 경우 빈 문자열 처리
    if (!text) text = "";
    
    const regex = new RegExp(`(${keyword})`, 'gi');  // 검색어에 맞는 부분을 대소문자 구분 없이 찾기
    return text.replace(regex, '<span class="highlight">$1</span>');  // 강조된 부분을 <span> 태그로 감쌈
}

// 최근 검색어 저장
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

// 최근 검색어 렌더링
function renderRecent() {
    const recents = JSON.parse(localStorage.recentKeywords || "[]");
    recentList.innerHTML = recents.map(word =>
        `<div class="recent-keyword">
            <span onclick="useRecent('${word}')">${word}</span>
            <button onclick="deleteRecent('${word}')">✕</button>
        </div>`
    ).join("");
}

// 최근 검색어 클릭 시 검색
function useRecent(word) {
    input.value = word;
    const results = data.filter(item =>
        item.title.toLowerCase().includes(word.toLowerCase())
    );
    showResults(results);
}

// 최근 검색어 삭제
function deleteRecent(word) {
    let recents = JSON.parse(localStorage.recentKeywords);
    recents = recents.filter(k => k !== word);
    localStorage.recentKeywords = JSON.stringify(recents);
    renderRecent();
}

// 추천 검색어 클릭 시 검색
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const word = tag.textContent.trim();

        // 최근 검색어와 추천 검색어 숨기기
        defaultSection.style.display = "none";  // 최근/추천 숨기기
        searchResultSection.style.display = "block"; // 검색 결과 보이기

        // 입력란에 검색어 설정
        input.value = word;

        // 최근 검색어 업데이트
        updateRecent(word);

        // 검색 결과 필터링
        const results = data.filter(item =>
            item.title.toLowerCase().includes(word.toLowerCase()) ||
            item.tag.toLowerCase().includes(word.toLowerCase())
        );
        showResults(results);
    });
});

// 초기 렌더링
renderRecent();
