document.querySelectorAll('.favorite-toggle').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // 링크로 가는 이벤트 차단
        event.preventDefault();  // 버튼 클릭이 <a>에 영향 주지 않도록 방지

        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.classList.add('inactive');
            button.innerHTML = '<i class="far fa-heart"></i>'; // 빈 하트
        } else {
            button.classList.remove('inactive');
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>'; // 채운 하트
        }
    });
});

const sortButton = document.querySelector('.sort-btn');
const sortOptions = document.querySelector('.sort-options');

sortButton.addEventListener('click', (event) => {
    event.stopPropagation();  // 메뉴 외부 클릭 시에도 메뉴 닫히는 것을 방지
    sortOptions.classList.toggle('active');
});

// 옵션 외부 클릭 시 메뉴 숨기기
document.addEventListener('click', (e) => {
    if (!sortButton.contains(e.target) && !sortOptions.contains(e.target)) {
        sortOptions.classList.remove('active');
    }
});
