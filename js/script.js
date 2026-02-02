// Scroll-based fade-in animations
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in class to animated elements
  const animatedElements = document.querySelectorAll(
    '.about-text, .about-video, .work-item, .footer-heading'
  );
  animatedElements.forEach(el => el.classList.add('fade-in'));

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Active nav link highlighting
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Auto-play/pause Vimeo video on scroll
  const iframe = document.getElementById('vimeo-player');
  if (iframe) {
    const player = new Vimeo.Player(iframe);
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
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
