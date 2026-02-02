document.addEventListener('DOMContentLoaded', () => {
  /* ───── Lenis smooth scroll ───── */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync Lenis with GSAP's ticker
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Make nav anchor clicks use Lenis
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: 0 });
    });
  });

  /* ───── Register GSAP plugin ───── */
  gsap.registerPlugin(ScrollTrigger);

  /* ───── Nav bar — fade in + slide down on load ───── */
  gsap.fromTo(
    '.nav',
    { autoAlpha: 0, y: -20 },
    { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  );

  /* ───── Active nav link highlighting (via GSAP ticker) ───── */
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  gsap.ticker.add(updateActiveNav);
  updateActiveNav();

  /* ───── Hero section — animate on load ───── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo(
      '.hero-title',
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.8 }
    )
    .fromTo(
      '.hero-subtitle',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      '-=0.3'
    );

  /* ───── About section — scroll-triggered ───── */
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    defaults: { ease: 'power2.out' },
  });

  aboutTl
    .fromTo(
      '.about .section-heading',
      { autoAlpha: 0, x: -60 },
      { autoAlpha: 1, x: 0, duration: 0.7 }
    )
    .fromTo(
      '.about-body',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )
    .fromTo(
      '.about-video',
      { autoAlpha: 0, x: 60 },
      { autoAlpha: 1, x: 0, duration: 0.7 },
      '-=0.4'
    );

  /* ───── Work section — scroll-triggered ───── */
  const workTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.work',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    defaults: { ease: 'power2.out' },
  });

  workTl
    .fromTo(
      '.work .section-heading',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6 }
    )
    .fromTo(
      '.work-subtitle',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.4 },
      '-=0.2'
    );

  // Work grid items — staggered
  gsap.fromTo(
    '.work-item',
    { autoAlpha: 0, scale: 0.9 },
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.work-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );

  /* ───── Footer — scroll-triggered ───── */
  const footerTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    defaults: { ease: 'power2.out' },
  });

  footerTl
    .fromTo(
      '.footer-heading',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6 }
    )
    .fromTo(
      '.footer-socials > *',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4, stagger: 0.1 },
      '-=0.2'
    );

  /* ───── Vimeo auto-play/pause on scroll ───── */
  const iframe = document.getElementById('vimeo-player');
  if (iframe) {
    const player = new Vimeo.Player(iframe);
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            player.play();
          } else {
            player.pause();
          }
        });
      },
      { threshold: 0.4 }
    );
    videoObserver.observe(iframe);
  }
});
