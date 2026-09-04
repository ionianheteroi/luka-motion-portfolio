document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('section[id], footer[id]')];

  /* Keep navigation useful even when animation libraries are unavailable. */
  let lenis = null;
  const animationToolsReady = Boolean(window.Lenis && window.gsap && window.ScrollTrigger);

  if (animationToolsReady && !reducedMotion) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!lenis) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  const updateActiveNav = () => {
    const marker = window.scrollY + 180;
    const pageBottom = Math.ceil(window.scrollY + window.innerHeight);
    const atPageEnd = pageBottom >= document.documentElement.scrollHeight - 2;
    let current = atPageEnd
      ? sections[sections.length - 1]?.id
      : sections[0]?.id || 'home';

    if (!atPageEnd) {
      sections.forEach((section) => {
        if (marker >= section.offsetTop) current = section.id;
      });
    }

    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
  updateActiveNav();

  /* Lazy Vimeo lightbox. Links remain valid Vimeo links without JavaScript. */
  const modal = document.getElementById('video-modal');
  const modalFrame = document.getElementById('video-modal-frame');
  const modalTitle = document.getElementById('video-modal-title');
  const closeButton = modal?.querySelector('[data-close-modal]');
  let activeTrigger = null;

  const closeVideo = () => {
    if (!modal?.open) return;
    modal.close();
  };

  if (modal && modalFrame && modalTitle && typeof modal.showModal === 'function') {
    document.querySelectorAll('.video-trigger').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const videoId = trigger.dataset.vimeoId;
        if (!videoId) return;

        event.preventDefault();
        activeTrigger = trigger;
        const visibleTitle = trigger.querySelector('.work-title')?.textContent.trim();
        modalTitle.textContent = visibleTitle || trigger.dataset.videoTitle || 'Luka Motion video';
        modalFrame.innerHTML = `
          <iframe
            src="https://player.vimeo.com/video/${encodeURIComponent(videoId)}?autoplay=1&amp;dnt=1&amp;title=0&amp;byline=0&amp;portrait=0"
            title="${modalTitle.textContent.replace(/["&<>]/g, '')}"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin">
          </iframe>`;
        modal.showModal();
        document.body.classList.add('modal-open');
      });
    });

    closeButton?.addEventListener('click', closeVideo);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeVideo();
    });
    modal.addEventListener('close', () => {
      modalFrame.replaceChildren();
      document.body.classList.remove('modal-open');
      activeTrigger?.focus();
      activeTrigger = null;
    });
  }

  document.getElementById('current-year').textContent = new Date().getFullYear();

  /* Motion is enhancement only: the page is fully visible before this runs. */
  if (animationToolsReady && !reducedMotion) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from('.nav', { autoAlpha: 0, y: -16, duration: 0.45 })
      .from('.hero-eyebrow', { autoAlpha: 0, y: 12, duration: 0.45 }, '-=0.2')
      .from('.hero-title', { autoAlpha: 0, scale: 0.9, duration: 0.75 }, '-=0.25')
      .from('.hero-joke', { autoAlpha: 0, y: 10, duration: 0.4 }, '-=0.35')
      .from('.hero-copy > *', { autoAlpha: 0, y: 22, duration: 0.55, stagger: 0.08 }, '-=0.15')
      .from('.reel-card', { autoAlpha: 0, y: 28, scale: 0.98, duration: 0.65 }, '-=0.55');

    gsap.utils.toArray('.about, .work-heading-row, .footer-main, .footer-details').forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 34,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });

    gsap.from('.work-item', {
      autoAlpha: 0,
      y: 28,
      duration: 0.62,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.work-grid', start: 'top 86%', once: true },
    });
  }
});
