document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     AOS – Animate On Scroll
  ============================================= */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,        // animate only once per element
      offset: 80,        // px from viewport edge to trigger
      easing: 'ease-out-cubic',
    });
  }

  /* =============================================
     GSAP – Hero entrance animation
  ============================================= */
  if (typeof gsap !== 'undefined') {
    // Lock hero elements immediately — before preloader:done fires
    gsap.set(['#gsap-svc-badge', '#gsap-svc-title', '#gsap-svc-desc', '#gsap-svc-cta'], {
      autoAlpha: 0,
    });
    gsap.set('#gsap-svc-badge', { y: -20 });
    gsap.set('#gsap-svc-title', { y: 40 });
    gsap.set('#gsap-svc-desc',  { y: 30 });
    gsap.set('#gsap-svc-cta',   { scale: 0.9 });
    gsap.set('.svc-tabs',       { autoAlpha: 0, y: 40 });

    function runServicesHero() {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .to('#gsap-svc-badge', { autoAlpha: 1, y: 0, duration: 0.6 })
        .to('#gsap-svc-title', { autoAlpha: 1, y: 0, duration: 0.75 }, '-=0.3')
        .to('#gsap-svc-desc',  { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.4')
        .to('#gsap-svc-cta',   { autoAlpha: 1, scale: 1, duration: 0.55 }, '-=0.35')
        .to('.svc-tabs',       { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2');

      gsap.to('.svc-hero__blob--a', {
        x: 30, y: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to('.svc-hero__blob--b', {
        x: -25, y: 25, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
      });
    }

    if (document.body.classList.contains('is-loading')) {
      document.addEventListener('preloader:done', runServicesHero, { once: true });
    } else {
      runServicesHero();
    }

    // ScrollTrigger – staggered check-list items per section
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll('.svc-check-list').forEach(list => {
        gsap.from(list.querySelectorAll('li'), {
          scrollTrigger: {
            trigger: list,
            start: 'top 85%',
          },
          opacity: 0,
          x: -20,
          stagger: 0.12,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      // Section title underline / reveal via ScrollTrigger
      document.querySelectorAll('.svc-detail-title').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
          opacity: 0,
          x: -30,
          duration: 0.7,
          ease: 'power2.out',
        });
      });

      // Capabilities card list items stagger
      document.querySelectorAll('.svc-capabilities-card ul li').forEach((li, i) => {
        gsap.from(li, {
          scrollTrigger: {
            trigger: li,
            start: 'top 90%',
          },
          opacity: 0,
          y: 15,
          duration: 0.45,
          delay: i * 0.08,
          ease: 'power1.out',
        });
      });
    }
  }

  /* =============================================
     Existing: smooth scroll + scroll-spy
  ============================================= */
  const header = document.querySelector('.site-header');
  const tabs = Array.from(document.querySelectorAll('.svc-tab'));
  const sections = tabs
    .map(tab => document.querySelector(tab.getAttribute('href')))
    .filter(Boolean);

  const headerOffset = () => (header ? header.offsetHeight : 0) + 16;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id.length < 2) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top, behavior: 'smooth' });

      if (history.pushState) history.pushState(null, '', id);
    });
  });

  if (sections.length && 'IntersectionObserver' in window) {
    const setActive = (index) => {
      tabs.forEach(tab => tab.classList.remove('active'));
      if (tabs[index]) tabs[index].classList.add('active');
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = sections.indexOf(entry.target);
        if (index !== -1) setActive(index);
      });
    }, {
      root: null,
      rootMargin: `-${headerOffset() + 10}px 0px -65% 0px`,
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

});