(() => {
  const menuButton = document.querySelector('.menu-btn');
  const navigation = document.querySelector('.site-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }));

  const tabs = [...document.querySelectorAll('.process-tab')];
  const panels = [...document.querySelectorAll('.process-panel')];
  const count = document.querySelector('.visual-top span:last-child');
  const progress = document.querySelector('.process-progress span');
  const pauseButton = document.querySelector('.process-pause');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reduceMotion.matches;
  let timer;

  function showPanel(index, moveFocus = false) {
    current = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    count.textContent = `${String(current + 1).padStart(2, '0')} / 04`;
    if (moveFocus) tabs[current].focus();
  }

  function schedule() {
    window.clearTimeout(timer);
    progress.style.transition = 'none';
    progress.style.width = '0';
    if (paused || document.hidden || reduceMotion.matches) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      progress.style.transition = 'width 5500ms linear';
      progress.style.width = '100%';
    }));
    timer = window.setTimeout(() => {
      showPanel(current + 1);
      schedule();
    }, 5500);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      showPanel(index);
      schedule();
    });
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? current + 1 : event.key === 'ArrowLeft' ? current - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      showPanel(next, true);
      schedule();
    });
  });
  pauseButton?.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Phát tiếp' : 'Tạm dừng';
    pauseButton.setAttribute('aria-pressed', String(paused));
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reduceMotion.addEventListener?.('change', schedule);
  if (tabs.length) {
    showPanel(0);
    schedule();
  }

  const revealTargets = [...document.querySelectorAll([
    '.intro-grid > div',
    '.work-section .section-heading', '.work-grid article',
    '.projects-section .section-heading', '.project-card',
    '.experience-intro', '.timeline > li',
    '.skills-section .section-heading', '.skills-grid article',
    '.approach-grid > div', '.contact-grid > div', '.contact-grid > dl'
  ].join(', '))];

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    document.querySelectorAll('.work-grid, .project-grid, .skills-grid').forEach(grid => {
      [...grid.children].forEach((card, index) => {
        card.style.setProperty('--reveal-delay', `${(index % 3) * 80}ms`);
      });
    });

    revealTargets.forEach(element => {
      element.classList.add('reveal-item');
      if (element.getBoundingClientRect().top < window.innerHeight * .92) {
        element.classList.add('is-visible');
      }
    });
    document.documentElement.classList.add('has-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(element => {
      if (!element.classList.contains('is-visible')) revealObserver.observe(element);
    });
    reduceMotion.addEventListener?.('change', event => {
      if (!event.matches) return;
      revealObserver.disconnect();
      document.documentElement.classList.remove('has-reveal');
    });
  }

  const contactButton = document.querySelector('.quick-contact');
  const contactPanel = document.querySelector('.contact-panel');
  function setContact(open) {
    contactButton.setAttribute('aria-expanded', String(open));
    contactPanel.hidden = !open;
  }
  contactButton?.addEventListener('click', () => setContact(contactPanel.hidden));
  contactPanel?.querySelector('.contact-close')?.addEventListener('click', () => {
    setContact(false);
    contactButton.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !contactPanel.hidden) setContact(false);
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });

  // Mascot: đổi hai đường dẫn này để thay bằng ảnh mèo của bạn.
  const catFrames = ['assets/meo-seo-1.svg', 'assets/meo-seo-2.svg'];
  const mascot = document.querySelector('#seo-mascot');
  if (mascot) {
    const catButton = mascot.querySelector('.seo-mascot-cat');
    const catImage = catButton.querySelector('img');
    const bubble = mascot.querySelector('.seo-mascot-bubble');
    const smallScreen = window.matchMedia('(max-width: 700px)');
    const tips = [
      'Trang có nhiều hiển thị nhưng CTR thấp? Hãy xem lại title và mô tả.',
      'Mỗi nhóm từ khóa nên có một trang đích phù hợp với ý định tìm kiếm.',
      'Sau khi xuất bản, hãy theo dõi dữ liệu Search Console để cập nhật nội dung.'
    ];
    let tipIndex = 0;
    let bubbleTimer = window.setTimeout(() => mascot.classList.remove('is-speaking'), 6500);
    let x = 0;
    let direction = 1;
    let lastTime = 0;
    let frameIndex = 0;
    let lastFrame = 0;
    const nextFrame = new Image();
    nextFrame.src = catFrames[1];

    catButton.addEventListener('click', () => {
      bubble.textContent = tips[tipIndex++ % tips.length];
      mascot.classList.add('is-speaking');
      window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(() => mascot.classList.remove('is-speaking'), 5500);
    });
    mascot.querySelector('.seo-mascot-close').addEventListener('click', () => {
      mascot.hidden = true;
      window.clearTimeout(bubbleTimer);
    });

    function moveCat(time) {
      if (mascot.hidden) return;
      const walking = !document.hidden && !smallScreen.matches && !reduceMotion.matches &&
        !mascot.matches(':hover') && !mascot.contains(document.activeElement);
      mascot.classList.toggle('is-walking', walking);
      if (walking) {
        const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
        const limit = Math.max(0, window.innerWidth - 330);
        x += direction * elapsed * .035;
        if (x >= limit) { x = limit; direction = -1; }
        if (x <= 0) { x = 0; direction = 1; }
        mascot.style.transform = `translate3d(${x}px, 0, 0)`;
        mascot.classList.toggle('is-facing-left', direction < 0);
        if (time - lastFrame > 250) {
          frameIndex = 1 - frameIndex;
          catImage.src = catFrames[frameIndex];
          lastFrame = time;
        }
      } else {
        if (smallScreen.matches || reduceMotion.matches) {
          x = 0;
          mascot.style.transform = 'translate3d(0, 0, 0)';
          mascot.classList.remove('is-facing-left');
        }
        if (frameIndex) { frameIndex = 0; catImage.src = catFrames[0]; }
      }
      lastTime = time;
      window.requestAnimationFrame(moveCat);
    }
    window.requestAnimationFrame(moveCat);
  }
})();
