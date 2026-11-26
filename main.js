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
})();
