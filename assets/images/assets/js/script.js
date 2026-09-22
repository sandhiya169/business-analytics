document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ============================================================
     AOS INIT
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    // fade-left / fade-right translate elements off-screen on the X axis,
    // which causes horizontal overflow on narrow viewports. Use fade-up
    // instead on mobile so no off-canvas transform is ever created.
    if (window.matchMedia('(max-width: 720px)').matches) {
      document.querySelectorAll('[data-aos="fade-left"], [data-aos="fade-right"]').forEach((el) => {
        el.setAttribute('data-aos', 'fade-up');
      });
    }
    AOS.init({
      once: true,          // animate only the first time
      offset: 80,          // trigger 80px before element enters viewport
      easing: 'ease-out-cubic',
      duration: 700,
    });
  }

  /* ============================================================
     GSAP — only runs on pages that have GSAP loaded
     ============================================================ */
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     HERO — staggered entry — delayed until preloader hides
     ---------------------------------------------------------- */
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    // Lock initial state immediately so elements don't flash before animation
    gsap.set(['.hero-copy .badge', '.hero-buttons .btn'], { autoAlpha: 0, y: 24 });
    gsap.set('.hero-title',       { autoAlpha: 0, y: 36 });
    gsap.set('.hero-checklist li', { autoAlpha: 0, x: -18, y: 0 });
    gsap.set('.hero-visual',      { autoAlpha: 0, x: 48 });

    function runHeroAnimation() {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .to('.hero-copy .badge', { autoAlpha: 1, y: 0, duration: 0.6 })
        .to('.hero-title',       { autoAlpha: 1, y: 0, duration: 0.75 }, '-=0.3')
        .to('.hero-buttons .btn',{ autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.14 }, '-=0.4')
        .to('.hero-checklist li',{ autoAlpha: 1, x: 0, duration: 0.5,  stagger: 0.1  }, '-=0.35')
        .to('.hero-visual',      { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6');
    }

    if (document.body.classList.contains('is-loading')) {
      document.addEventListener('preloader:done', runHeroAnimation, { once: true });
    } else {
      runHeroAnimation();
    }
  }

  /* ----------------------------------------------------------
     HERO VISUAL — subtle continuous float
     ---------------------------------------------------------- */
  // const heroVisual = document.querySelector('.hero-visual');
  // if (heroVisual) {
  //   gsap.to(heroVisual, {
  //     y: -14,
  //     duration: 3.2,
  //     ease: 'sine.inOut',
  //     yoyo: true,
  //     repeat: -1,
  //   });
  // }

  /* ----------------------------------------------------------
     MARQUEE — speed up on scroll
     ---------------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
      x: '-8%',
      ease: 'none',
    });
  }

  /* ----------------------------------------------------------
     SMART AUTOMATION — visual images parallax float
     ---------------------------------------------------------- */
  const saVisual = document.querySelector('.sa-visual');
  if (saVisual) {
    // Gentle vertical parallax on the whole visual block
    gsap.to('.sa-visual', {
      scrollTrigger: {
        trigger: '.smart-automation',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: -30,
      ease: 'none',
    });

    // Individual card floats (only on desktop — skip when grid takes over)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1081px)', () => {
      // gsap.to('.sv-mini', {
      //   y: -18,
      //   duration: 2.8,
      //   ease: 'sine.inOut',
      //   yoyo: true,
      //   repeat: -1,
      //   delay: 0.4,
      // });
      // gsap.to('.sv-rings', {
      //   y: 12,
      //   duration: 3.4,
      //   ease: 'sine.inOut',
      //   yoyo: true,
      //   repeat: -1,
      //   delay: 0.9,
      // });
    });
  }

  /* ----------------------------------------------------------
     FEATURE CARDS — handled by AOS data attributes, no GSAP from() here
     to avoid opacity conflict. GSAP only adds a hover-depth effect.
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     STATS COUNTER — count up when entering viewport
     ---------------------------------------------------------- */
  document.querySelectorAll('.stat-num[data-counter]').forEach(el => {
    const target  = parseInt(el.dataset.counter, 10);
    const suffix  = el.dataset.suffix || '';
    const accent  = el.querySelector('.accent');
    const accentText = accent ? accent.textContent : '';

    // Build suffix without the accent part for comparison
    const plainSuffix = suffix.replace(accentText, '');

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            const rounded = Math.round(obj.val);
            if (accent) {
              el.childNodes[0].textContent = rounded;
              accent.textContent = accentText;
            } else {
              el.textContent = rounded + suffix;
            }
          },
        });
      },
    });
  });

  /* ----------------------------------------------------------
     STAT LINES — animate width on scroll
     ---------------------------------------------------------- */
  gsap.utils.toArray('.stat-line span').forEach(line => {
    gsap.from(line, {
      scrollTrigger: {
        trigger: line,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
    });
  });

  /* ----------------------------------------------------------
     SERVICE ROWS — parallax scrub only (AOS handles fade-in,
     so no gsap.from opacity/x here to avoid conflict)
     ---------------------------------------------------------- */
  gsap.utils.toArray('.service-row').forEach(row => {
    const media = row.querySelector('.service-media');
    if (!media) return;

    // Subtle parallax depth on scroll only — no opacity animation
    gsap.to(media.querySelector('img'), {
      scrollTrigger: {
        trigger: row,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
      y: -24,
      ease: 'none',
    });
  });

  /* ----------------------------------------------------------
     SECURITY BANNER — handled by AOS, no GSAP from() to avoid conflict
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     CTA BOX — handled by AOS (zoom-in on .cta-box, fade-up on inner elements)
     No GSAP from() here to avoid opacity conflict.
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     FAQ HELP CARD — subtle continuous pulse glow
     ---------------------------------------------------------- */
  const faqCard = document.querySelector('.faq-help-card');
  if (faqCard) {
    gsap.to(faqCard, {
      boxShadow: '0 24px 60px rgba(114,103,234,0.35)',
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /* ----------------------------------------------------------
     FAQ accordion (keep existing logic below)
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ============================================================
     HOMEPAGE SERVICES CAROUSEL (no-op if buttons absent)
     ============================================================ */
  const serviceRows = Array.from(document.querySelectorAll('.service-row'));
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');

  if (serviceRows.length && prevBtn && nextBtn) {
    let current = 0;
    const scrollToRow = (index) => {
      current = Math.max(0, Math.min(index, serviceRows.length - 1));
      serviceRows[current].scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    prevBtn.addEventListener('click', () => scrollToRow(current - 1));
    nextBtn.addEventListener('click', () => scrollToRow(current + 1));
  }

  /* ============================================================
     ABOUT PAGE — mission tabs
     ============================================================ */
  const missionTabs = document.querySelectorAll('.mission-tab');
  missionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      missionTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  /* ============================================================
     ABOUT PAGE — team carousel
     ============================================================ */
  const aboutCarPrev = document.getElementById('aboutCarPrev');
  const aboutCarNext = document.getElementById('aboutCarNext');
  const teamGrid     = document.querySelector('.about-team-grid');

  if (aboutCarPrev && aboutCarNext && teamGrid) {
    const scrollAmount = 300;
    aboutCarPrev.addEventListener('click', () => {
      teamGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    aboutCarNext.addEventListener('click', () => {
      teamGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  /* ============================================================
     ABOUT PAGE HEADER — scroll to solid
     ============================================================ */
  const aboutHeader = document.querySelector('.about-header');
  if (aboutHeader) {
    const onScroll = () => {
      if (window.scrollY > 80) {
        aboutHeader.style.background = '#f9f9f9';
        aboutHeader.style.boxShadow  = '0 2px 12px rgba(0,0,0,0.10)';
        aboutHeader.querySelectorAll('.main-nav a').forEach(a => { a.style.color = ''; });
        const loginBtn = aboutHeader.querySelector('.btn-outline-light');
        if (loginBtn) { loginBtn.style.color = ''; loginBtn.style.borderColor = ''; }
        aboutHeader.querySelectorAll('.menu-toggle span').forEach(s => { s.style.background = ''; });
      } else {
        aboutHeader.style.background = '';
        aboutHeader.style.boxShadow  = 'none';
        aboutHeader.querySelectorAll('.main-nav a').forEach(a => { a.style.color = 'rgba(255,255,255,0.88)'; });
        const loginBtn = aboutHeader.querySelector('.btn-outline-light');
        if (loginBtn) {
          loginBtn.style.color = '#fff';
          loginBtn.style.borderColor = 'rgba(255,255,255,0.7)';
        }
        aboutHeader.querySelectorAll('.menu-toggle span').forEach(s => { s.style.background = '#fff'; });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const input = newsletterForm.querySelector('input[type="email"]');
    const error = document.getElementById('newsletterError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const showNewsletterError = (message) => {
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
    };

    input.addEventListener('input', () => showNewsletterError(''));
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = newsletterForm.querySelector('button');
      const email = input.value.trim();
      if (!email) {
        showNewsletterError('Enter your email address.');
        input.focus();
        return;
      }
      if (!emailPattern.test(email)) {
        showNewsletterError('Enter a valid email address.');
        input.focus();
        return;
      }

      showNewsletterError('');
      const orig   = button.textContent;
      button.textContent = 'Subscribed!';
      newsletterForm.reset();
      setTimeout(() => {
        button.textContent = orig;
        window.location.href = '404.html';
      }, 500);
    });
  }

});
