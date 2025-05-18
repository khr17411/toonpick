<<<<<<< HEAD
const swiper = new Swiper('.swiper', {
    loop: true,
    centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
      el: '.swiper-pagination',
      clickable: true, // 점 클릭하면 해당 슬라이드로 이동
    },
  });
  

  // 추가된 부분: 마이페이지 슬라이드 & 탭 전환

const myButton = document.getElementById('my-button');
const mypageContainer = document.getElementById('mypage-container');
const favoritesTab = document.getElementById('favorites-tab');
const recentTab = document.getElementById('recent-tab');
const favoritesList = document.getElementById('favorites-list');
const recentList = document.getElementById('recent-list');

// 사용자 이름 관리
const user_name = "사용자";
const greetingNickname = document.getElementById('nickname-display-greeting');
const settingNickname = document.getElementById('nickname-display-setting');
greetingNickname.innerText = user_name;
settingNickname.innerText = user_name;

// MY 버튼 클릭 → 마이페이지 슬라이드 등장
myButton.addEventListener('click', () => {
    if (mypageContainer.style.display === 'none' || mypageContainer.style.display === '') {
      mypageContainer.style.display = 'block';
      setTimeout(() => {
        mypageContainer.classList.add('show');
        myButton.classList.add('active');
      }, 10); 
    } else {
      mypageContainer.classList.remove('show');
      myButton.classList.remove('active');
      setTimeout(() => {
        mypageContainer.style.display = 'none';
      }, 300); 
    }
  });
//설정버튼
const settingButton = document.getElementById('setting-button');
const settingpageContainer = document.getElementById('setting-container');
settingButton.addEventListener('click', () => {
    if (settingpageContainer.style.display === 'none' || settingpageContainer.style.display ==='') {
      settingpageContainer.style.display = 'block' ;
      setTimeout(() => {
        settingpageContainer.classList.add('show');
      }, 10);
    }else {
      settingpageContainer.classList.remove('show');
      setTimeout(() => {
        settingpageContainer.style.display = 'none';
      },300);
    }
});
//설정버튼 뒤로가기
const settingBackButton = document.getElementById('setting-back-button');
settingBackButton.addEventListener('click', () => {
  settingpageContainer.classList.remove('show');
  setTimeout(() => {
    settingpageContainer.style.display = 'none';
  }, 300);
});
//닉변경
const nicknameDisplay = document.getElementById('nickname-display');
const changeNicknameButton = document.getElementById('change-nickname-button');

changeNicknameButton.addEventListener('click', () => {
  const newNickname = prompt('새 닉네임을 입력하세요:', user_name);
  if (newNickname !== null && newNickname.trim() !== '') {
    user_name = newNickname.trim();
    greetingNickname.innerText = user_name;
    settingNickname.innerText = user_name;
  }
});


// 즐겨찾기 탭 클릭
favoritesTab.addEventListener('click', () => {
  favoritesTab.classList.add('active');
  recentTab.classList.remove('active');
  favoritesList.classList.remove('hidden');
  recentList.classList.add('hidden');
});

// 최근본 탭 클릭
recentTab.addEventListener('click', () => {
    recentTab.classList.add('active');
    favoritesTab.classList.remove('active');
    recentList.classList.remove('hidden');
    favoritesList.classList.add('hidden');
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

  // 로그아웃
const logoutButton = document.querySelector('.mypage-buttons button:nth-child(2)');
const logoutModal = document.getElementById('logout-modal');
const cancelLogout = document.getElementById('cancel-logout');
  
logoutButton.addEventListener('click', () => {
    logoutModal.classList.remove('hidden');
});
  
cancelLogout.addEventListener('click', () => {
    logoutModal.classList.add('hidden');
=======
const swiper = new Swiper('.swiper', {
    loop: true,
    centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
      el: '.swiper-pagination',
      clickable: true, // 점 클릭하면 해당 슬라이드로 이동
    },
  });
  

  // 추가된 부분: 마이페이지 슬라이드 & 탭 전환

const myButton = document.getElementById('my-button');
const mypageContainer = document.getElementById('mypage-container');
const favoritesTab = document.getElementById('favorites-tab');
const recentTab = document.getElementById('recent-tab');
const favoritesList = document.getElementById('favorites-list');
const recentList = document.getElementById('recent-list');

// 사용자 이름 관리
const user_name = "사용자";
const greetingNickname = document.getElementById('nickname-display-greeting');
const settingNickname = document.getElementById('nickname-display-setting');
greetingNickname.innerText = user_name;
settingNickname.innerText = user_name;

// MY 버튼 클릭 → 마이페이지 슬라이드 등장
myButton.addEventListener('click', () => {
    if (mypageContainer.style.display === 'none' || mypageContainer.style.display === '') {
      mypageContainer.style.display = 'block';
      setTimeout(() => {
        mypageContainer.classList.add('show');
        myButton.classList.add('active');
      }, 10); 
    } else {
      mypageContainer.classList.remove('show');
      myButton.classList.remove('active');
      setTimeout(() => {
        mypageContainer.style.display = 'none';
      }, 300); 
    }
  });
//설정버튼
const settingButton = document.getElementById('setting-button');
const settingpageContainer = document.getElementById('setting-container');
settingButton.addEventListener('click', () => {
    if (settingpageContainer.style.display === 'none' || settingpageContainer.style.display ==='') {
      settingpageContainer.style.display = 'block' ;
      setTimeout(() => {
        settingpageContainer.classList.add('show');
      }, 10);
    }else {
      settingpageContainer.classList.remove('show');
      setTimeout(() => {
        settingpageContainer.style.display = 'none';
      },300);
    }
});
//설정버튼 뒤로가기
const settingBackButton = document.getElementById('setting-back-button');
settingBackButton.addEventListener('click', () => {
  settingpageContainer.classList.remove('show');
  setTimeout(() => {
    settingpageContainer.style.display = 'none';
  }, 300);
});
//닉변경
const nicknameDisplay = document.getElementById('nickname-display');
const changeNicknameButton = document.getElementById('change-nickname-button');

changeNicknameButton.addEventListener('click', () => {
  const newNickname = prompt('새 닉네임을 입력하세요:', user_name);
  if (newNickname !== null && newNickname.trim() !== '') {
    user_name = newNickname.trim();
    greetingNickname.innerText = user_name;
    settingNickname.innerText = user_name;
  }
});


// 즐겨찾기 탭 클릭
favoritesTab.addEventListener('click', () => {
  favoritesTab.classList.add('active');
  recentTab.classList.remove('active');
  favoritesList.classList.remove('hidden');
  recentList.classList.add('hidden');
});

// 최근본 탭 클릭
recentTab.addEventListener('click', () => {
    recentTab.classList.add('active');
    favoritesTab.classList.remove('active');
    recentList.classList.remove('hidden');
    favoritesList.classList.add('hidden');
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

  // 로그아웃
const logoutButton = document.querySelector('.mypage-buttons button:nth-child(2)');
const logoutModal = document.getElementById('logout-modal');
const cancelLogout = document.getElementById('cancel-logout');
  
logoutButton.addEventListener('click', () => {
    logoutModal.classList.remove('hidden');
});
  
cancelLogout.addEventListener('click', () => {
    logoutModal.classList.add('hidden');
>>>>>>> origin/main
});