/* ==========================================================================
   WON HYUNGYEONG — PORTFOLIO SCRIPT
   1) Scroll reveal (IntersectionObserver)
   2) Header state + progress bar (rAF)
   3) Active nav highlighting
   4) Mobile nav toggle
   5) Works (video / card news) — render, filter, media modal
   6) Detail page — section dot navigator (detail-*.html 단독 열람 시)
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll Reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // reveal once, stay visible
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 2. Header State + Progress Bar ---------- */
  var header = document.getElementById('header');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function onScrollFrame() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-scrolled', scrollY > 10);
    progressBar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  onScrollFrame();

  /* ---------- 3. Active Nav Highlighting ---------- */
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.nav === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- 4. Mobile Nav Toggle ----------
     detail-*.html 페이지는 헤더 nav/햄버거 버튼 자체가 없으므로(HTML에서
     제거됨) 이 블록은 그런 페이지에서 조용히 스킵된다. */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    // close menu after choosing a link (mobile)
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 5. Works (Video / Card News) ----------
     WORKS_DATA 배열 하나로 카드를 자동 생성하고, 필터 탭과 상세 모달을
     연결한다. 새 작업물을 추가하려면 아래 WORKS_DATA 배열에 객체 하나만
     더 넣으면 된다 (마크업을 직접 건드릴 필요 없음).

     [항목 추가하는 법]
     · 영상 1개  → category:'video',  thumb(포스터 이미지), video(mp4 경로)
     · 카드뉴스  → category:'cardnews', thumb(대표 이미지), images(슬라이드 경로 배열)
     실제 파일은 assets/works/ 폴더 아래에 넣고 경로만 맞춰주면 된다. */

  var WORKS_DATA = [
    {
      id: 'w1',
      category: 'video',
      title: '엘피스 그룹홈',
      tag: 'VIDEO · PROMO',
      desc: ' "그룹홈"에 대해 소개하고, 그룹홈에서 콜롬비아 교회 건축을 위해 후원한 내용을 보고하는 영상을 제작하였습니다.',
      thumb: 'assets/works/video/work-video-01-poster.jpg',
      video: 'assets/works/video/work-video-01.mp4'
    },
    {
      id: 'w2',
      category: 'video',
      title: '선교사 임대주택 입주기',
      tag: 'VIDEO · PROMO',
      desc: '해외에서 비자발적으로 귀국한 선교사에게 한국에서 받을 수 있는 혜택을 영상으로 제작하였습니다.',
      thumb: 'assets/works/video/work-video-02-poster.jpg',
      video: 'assets/works/video/work-video-02.mp4'
    },
    {
      id: 'w2',
      category: 'video',
      title: '국내 이주민 소개 영상',
      tag: 'VIDEO · PROMO',
      desc: '국내에서 살아가는 이주민들을 소개하는 영상을 제작하였습니다.',
      thumb: 'assets/works/video/work-video-03-poster.jpg',
      video: 'assets/works/video/work-video-03.mp4'
    },
    {
      id: 'w2',
      category: 'video',
      title: '단체 홍보영상1',
      tag: 'VIDEO · PROMO',
      desc: '단체의 50주년 기념 행사에 필요한 영상을 제작하였습니다.',
      thumb: 'assets/works/video/work-video-04-poster.jpg',
      video: 'assets/works/video/work-video-04.mp4'
    },
    {
      id: 'w2',
      category: 'video',
      title: '단체 홍보영상2',
      tag: 'VIDEO · PROMO',
      desc: '단체의 50주년 기념 행사에 필요한 영상을 제작하였습니다.',
      thumb: 'assets/works/video/work-video-05-poster.jpg',
      video: 'assets/works/video/work-video-05.mp4'
    },
    {
      id: 'w4',
      category: 'cardnews',
      title: '튀르키예, 시리아 지진 모금',
      tag: 'CARD NEWS',
      desc: '튀르키예/시리아 지진 발생 시 지역의 상황을 재빨리 안내하는 이미지를 제작하여 모금으로 연결하였습니다.',
      thumb: 'assets/works/cardnews-1/slide-1.jpg',
      images: [
        'assets/works/cardnews-1/slide-1.jpg',
        'assets/works/cardnews-1/slide-2.jpg',
        'assets/works/cardnews-1/slide-3.jpg',
        'assets/works/cardnews-1/slide-4.jpg',
        'assets/works/cardnews-1/slide-5.jpg',
        'assets/works/cardnews-1/slide-6.jpg',
        'assets/works/cardnews-1/slide-7.jpg',
        'assets/works/cardnews-1/slide-8.jpg',
        'assets/works/cardnews-1/slide-9.jpg'
      ]
    },
    {
      id: 'w3',
      category: 'cardnews',
      title: '튀르키예, 시리아 지진 모금 보고',
      tag: 'CARD NEWS',
      desc: '튀르키예/시리아 지진 모금 보고를 이미지로 제작하였습니다.',
      thumb: 'assets/works/cardnews-2/slide-1.jpg',
      images: [
        'assets/works/cardnews-2/slide-1.jpg',
        'assets/works/cardnews-2/slide-2.jpg',
        'assets/works/cardnews-2/slide-3.jpg',
        'assets/works/cardnews-2/slide-4.jpg',
        'assets/works/cardnews-2/slide-5.jpg',
        'assets/works/cardnews-2/slide-6.jpg',
        'assets/works/cardnews-2/slide-7.jpg'
        
      ]
    },
    {
      id: 'w3',
      category: 'cardnews',
      title: '행사 후기1',
      tag: 'CARD NEWS',
      desc: '기업 내 행사 보고 내용을 카드뉴스로 제작하였습니다.',
      thumb: 'assets/works/cardnews-3/slide-1.jpg',
      images: [
        'assets/works/cardnews-3/slide-1.jpg',
        'assets/works/cardnews-3/slide-2.jpg',
        'assets/works/cardnews-3/slide-3.jpg',
        'assets/works/cardnews-3/slide-4.jpg',
        'assets/works/cardnews-3/slide-5.jpg',
        'assets/works/cardnews-3/slide-6.jpg',
        'assets/works/cardnews-3/slide-7.jpg',
        'assets/works/cardnews-3/slide-8.jpg'
        
      ]
    },
        {
      id: 'w3',
      category: 'cardnews',
      title: '행사 후기2',
      tag: 'CARD NEWS',
      desc: '기업 내 행사 보고 내용을 카드뉴스로 제작하였습니다.',
      thumb: 'assets/works/cardnews-4/slide-1.jpg',
      images: [
        'assets/works/cardnews-4/slide-1.jpg',
        'assets/works/cardnews-4/slide-2.jpg',
        'assets/works/cardnews-4/slide-3.jpg',
        'assets/works/cardnews-4/slide-4.jpg',
        'assets/works/cardnews-4/slide-5.jpg',
        'assets/works/cardnews-4/slide-6.jpg',
        'assets/works/cardnews-4/slide-7.jpg',
        'assets/works/cardnews-4/slide-8.jpg',
        'assets/works/cardnews-4/slide-9.jpg'
        
      ]
    }
  ];

  var worksGrid = document.getElementById('worksGrid');

  if (worksGrid) {
    var PLAY_ICON_SVG =
      '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      '<circle cx="30" cy="30" r="30" fill="rgba(255,255,255,0.92)"></circle>' +
      '<path d="M24 18.5 L43 30 L24 41.5 Z" fill="#10221B"></path>' +
      '</svg>';

    // ----- 5-1. 카드 렌더링 -----
    WORKS_DATA.forEach(function (work) {
      var card = document.createElement('article');
      card.className = 'work-card work-card--' + work.category;
      card.dataset.category = work.category;
      card.dataset.id = work.id;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', work.title + ' 크게 보기');

      var badgeLabel = work.category === 'video' ? 'VIDEO' : 'CARD NEWS';
      var extraMarkup = '';

      if (work.category === 'video') {
        extraMarkup = '<span class="work-card__play">' + PLAY_ICON_SVG + '</span>';
      } else if (work.category === 'cardnews' && work.images) {
        extraMarkup = '<span class="work-card__count">1 / ' + work.images.length + '</span>';
      }

      card.innerHTML =
        '<div class="work-card__thumb">' +
          '<span class="work-card__badge">' + badgeLabel + '</span>' +
          '<img class="work-card__img" src="' + work.thumb + '" alt="' + work.title + '" loading="lazy" />' +
          extraMarkup +
        '</div>' +
        '<div class="work-card__body">' +
          '<p class="work-card__type">' + work.tag + '</p>' +
          '<h3 class="work-card__title">' + work.title + '</h3>' +
          '<p class="work-card__desc">' + work.desc + '</p>' +
        '</div>';

      card.addEventListener('click', function () { openMediaModal(work, card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMediaModal(work, card);
        }
      });

      worksGrid.appendChild(card);
    });

    // ----- 5-2. 필터 탭 -----
    var filterBtns = document.querySelectorAll('.works__filter-btn');
    var workCards = worksGrid.querySelectorAll('.work-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;

        filterBtns.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });

        workCards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });

    // ----- 5-3. 미디어 모달 (영상 재생 / 카드뉴스 캐러셀) -----
    var mediaModal = document.getElementById('mediaModal');
    var mediaModalClose = document.getElementById('mediaModalClose');
    var mediaModalVideo = document.getElementById('mediaModalVideo');
    var mediaModalImage = document.getElementById('mediaModalImage');
    var mediaModalCounter = document.getElementById('mediaModalCounter');
    var mediaModalCategory = document.getElementById('mediaModalCategory');
    var mediaModalTitle = document.getElementById('mediaModalTitle');
    var mediaModalDesc = document.getElementById('mediaModalDesc');
    var carouselPrev = document.getElementById('carouselPrev');
    var carouselNext = document.getElementById('carouselNext');

    var mediaModalLastFocused = null;
    var currentWork = null;
    var currentSlide = 0;

    function renderSlide() {
      if (!currentWork || !currentWork.images) return;
      mediaModalImage.src = currentWork.images[currentSlide];
      mediaModalImage.alt = currentWork.title + ' ' + (currentSlide + 1) + '/' + currentWork.images.length;
      mediaModalCounter.textContent = (currentSlide + 1) + ' / ' + currentWork.images.length;
    }

    function openMediaModal(work, triggerEl) {
      mediaModalLastFocused = triggerEl || document.activeElement;
      currentWork = work;
      currentSlide = 0;

      mediaModal.classList.remove('media-modal--video', 'media-modal--cardnews');
      mediaModal.classList.add('media-modal--' + work.category);

      mediaModalCategory.textContent = work.tag;
      mediaModalTitle.textContent = work.title;
      mediaModalDesc.textContent = work.desc;

      if (work.category === 'video') {
        mediaModalVideo.setAttribute('poster', work.thumb);
        mediaModalVideo.src = work.video;
        mediaModalVideo.load();
        // 모달을 여는 클릭 자체가 사용자 동작이므로 바로 재생을 시도한다.
        // 브라우저가 막으면(자동재생 정책) 조용히 무시하고 컨트롤로 재생하면 된다.
        mediaModalVideo.play().catch(function () {});
      } else if (work.category === 'cardnews') {
        renderSlide();
      }

      mediaModal.classList.add('is-open');
      mediaModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      mediaModalClose.focus();
      document.addEventListener('keydown', onMediaModalKeydown);
    }

    function closeMediaModal() {
      mediaModal.classList.remove('is-open');
      mediaModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onMediaModalKeydown);

      // 영상은 닫자마자 정지 + src 해제(백그라운드 재생/로딩 방지)
      mediaModalVideo.pause();
      mediaModalVideo.removeAttribute('src');
      mediaModalVideo.load();

      currentWork = null;
      if (mediaModalLastFocused) mediaModalLastFocused.focus();
    }

    function showPrevSlide() {
      if (!currentWork || !currentWork.images) return;
      currentSlide = (currentSlide - 1 + currentWork.images.length) % currentWork.images.length;
      renderSlide();
    }

    function showNextSlide() {
      if (!currentWork || !currentWork.images) return;
      currentSlide = (currentSlide + 1) % currentWork.images.length;
      renderSlide();
    }

    function onMediaModalKeydown(e) {
      if (e.key === 'Escape') closeMediaModal();
      if (currentWork && currentWork.category === 'cardnews') {
        if (e.key === 'ArrowLeft') showPrevSlide();
        if (e.key === 'ArrowRight') showNextSlide();
      }
    }

    mediaModal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeMediaModal);
    });
    mediaModalClose.addEventListener('click', closeMediaModal);
    carouselPrev.addEventListener('click', showPrevSlide);
    carouselNext.addEventListener('click', showNextSlide);
  }

  /* ---------- 6. Detail 페이지 — 우측 섹션 점(dot) 내비게이터 ----------
     헤더 nav를 통째로 바꿔치우던 이전 방식은 너무 길어지고 공간을 많이
     차지해서 제거했다. 대신 화면 우측에 조용히 떠 있는 점 내비게이터로
     대체한다. 콘텐츠를 읽는 흐름을 방해하지 않으면서(과한 텍스트 없이
     점 하나 + hover 시에만 라벨 노출) 원하는 섹션으로 바로 이동할 수 있고,
     현재 보고 있는 섹션이 어디인지 스크롤에 따라 자동으로 표시된다.
     독립 열람이든 index.html의 모달(iframe) 안이든 동일하게 동작한다. */
  if (document.body.classList.contains('page-detail')) {
    var dotSections = document.querySelectorAll('main section[id]');

    if (dotSections.length > 1) {
      var dotNav = document.createElement('nav');
      dotNav.className = 'section-dots';
      dotNav.setAttribute('aria-label', '섹션 바로가기');

      dotSections.forEach(function (section) {
        var id = section.id;
        var eyebrow = section.querySelector('.section__eyebrow');
        var label = id === 'hero' ? 'TOP' : (eyebrow ? eyebrow.textContent.trim() : id.toUpperCase());

        var item = document.createElement('a');
        item.href = '#' + id;
        item.className = 'section-dots__item';
        item.dataset.dotFor = id;
        item.setAttribute('aria-label', label);

        var dot = document.createElement('span');
        dot.className = 'section-dots__dot';
        var tip = document.createElement('span');
        tip.className = 'section-dots__tip';
        tip.textContent = label;

        item.appendChild(dot);
        item.appendChild(tip);
        dotNav.appendChild(item);
      });

      document.body.appendChild(dotNav);

      var dotItems = dotNav.querySelectorAll('.section-dots__item');

      function setActiveDot(id) {
        dotItems.forEach(function (item) {
          item.classList.toggle('is-active', item.dataset.dotFor === id);
        });
      }
      setActiveDot(dotSections[0].id);

      if ('IntersectionObserver' in window) {
        var dotObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) setActiveDot(entry.target.id);
            });
          },
          { rootMargin: '-40% 0px -55% 0px' }
        );
        dotSections.forEach(function (section) { dotObserver.observe(section); });
      }

      dotItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(item.dataset.dotFor);
          if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        });
      });
    }
  }
})();
