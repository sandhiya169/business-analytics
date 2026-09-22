document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // AOS — Animate On Scroll init
  // =========================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,        // animate only once per element
      offset: 80,        // px from viewport edge to trigger
      easing: 'ease-out-cubic',
      duration: 650,
    });
  }

  // =========================================================
  // GSAP — Hero entrance timeline
  // =========================================================
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Lock initial states immediately — before preloader:done fires
    gsap.set([
      '.about-page-hero__badge',
      '.about-page-hero__title',
      '.about-page-hero__desc',
      '.about-page-hero__actions',
      '.about-page-hero__image',
    ], { autoAlpha: 0, y: 32 });

    gsap.set([
      '.about-page-hero__blob--a',
      '.about-page-hero__blob--b',
    ], { autoAlpha: 0, scale: 0.75 });

    function runAboutHero() {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .to('.about-page-hero__blob--a', { autoAlpha: 1, scale: 1, duration: 1.4 }, 0)
        .to('.about-page-hero__blob--b', { autoAlpha: 1, scale: 1, duration: 1.4 }, 0.15)
        .to('.about-page-hero__badge',   { autoAlpha: 1, y: 0, duration: 0.6 }, 0.2)
        .to('.about-page-hero__title',   { autoAlpha: 1, y: 0, duration: 0.75 }, 0.35)
        .to('.about-page-hero__desc',    { autoAlpha: 1, y: 0, duration: 0.65 }, 0.5)
        .to('.about-page-hero__actions', { autoAlpha: 1, y: 0, duration: 0.6  }, 0.62)
        .to('.about-page-hero__image',   { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.72);

      gsap.to('.about-page-hero__blob--a', {
        y: '-=22', x: '+=12', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4,
      });
      gsap.to('.about-page-hero__blob--b', {
        y: '+=18', x: '-=10', duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.6,
      });
    }

    if (document.body.classList.contains('is-loading')) {
      document.addEventListener('preloader:done', runAboutHero, { once: true });
    } else {
      runAboutHero();
    }

    // ── Hero image subtle parallax on scroll ──────────────────
    gsap.to('.about-page-hero__image img', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-page-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ── Team cards hover tilt (GSAP quickTo for performance) ──
    document.querySelectorAll('.team-card').forEach(card => {
      const setRotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      const setRotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });

      card.addEventListener('mousemove', e => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width  - 0.5;   // –0.5 → 0.5
        const y = (e.clientY - top)  / height - 0.5;
        setRotY( x * 10);
        setRotX(-y * 10);
      });

      card.addEventListener('mouseleave', () => {
        setRotX(0);
        setRotY(0);
      });

      // Ensure perspective is set via GSAP so tilt is visible
      gsap.set(card, { transformPerspective: 800, transformOrigin: 'center center' });
    });

    // ── Stats counter animation with data attributes ──────────────
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const counter = { val: 0 };

      ScrollTrigger.create({
        trigger: el.closest('.stat'),
        start: 'top 85%',
        once: true,
        onEnter() {
          gsap.to(counter, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = Math.round(counter.val).toLocaleString();
            },
            onComplete() {
              el.textContent = target.toLocaleString();
            },
          });

          // Animate the icon
          gsap.from(el.closest('.stat').querySelector('.stat-icon'), {
            scale: 0.5,
            opacity: 0,
            rotation: -180,
            duration: 0.8,
            ease: 'back.out(1.7)',
          });
        },
      });
    });

  } // end if gsap
    // Mission Tabs functionality
    const tabs = document.querySelectorAll('.mission-tab');
    const panels = document.querySelectorAll('.mission-panel');

    if (tabs.length > 0 && panels.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active state from all tabs and hide all panels
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => p.style.display = 'none');

                // Add active state to clicked tab
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Show corresponding panel
                const targetPanelId = tab.getAttribute('data-panel');
                if (targetPanelId) {
                    const targetPanel = document.getElementById(targetPanelId);
                    if (targetPanel) {
                        targetPanel.style.display = 'grid'; // .mission-panel uses CSS grid
                    }
                }
            });
        });

        // Ensure grid display style applies properly on mobile viewport if it changes
        const mediaQuery = window.matchMedia('(max-width: 1080px)');
        mediaQuery.addEventListener('change', (e) => {
            // Re-trigger the active tab to re-apply the style properly based on css if necessary.
            // But standard CSS overrides should take effect even with inline styles if !important is used.
            // Since it's inline 'grid', the media query: .mission-panel { grid-template-columns: 1fr; } 
            // will still correctly apply the 1 column layout instead of 2.
        });
    }

    // ===== Testimonial Slider =====
    const testimonials = [
        {
            quote: "\u201cI needed to understand AI well enough to lead through it \u2013 not just delegate it. This course gave me exactly that. I made three strategic decisions differently the week after.\u201d",
            name: "Ronald Benson",
            loc: "LOS ANGELES, CA",
            avatar: "assets/images/images-3.webp"
        },
        {
            quote: "\u201cStackly transformed the way our team approaches data analytics. The insights we gained in just 30 days saved us months of guesswork and helped us close our biggest enterprise deal yet.\u201d",
            name: "Priya Nair",
            loc: "SAN FRANCISCO, CA",
            avatar: "assets/images/images-2.webp"
        },
        {
            quote: "\u201cI was skeptical at first, but the results spoke for themselves. Our operational efficiency jumped by 40% within the first quarter. The platform is intuitive, powerful, and worth every cent.\u201d",
            name: "James Okafor",
            loc: "LONDON, UK",
            avatar: "assets/images/images-1.webp"
        }
    ];

    const quoteEl  = document.getElementById('testQuote');
    const nameEl   = document.getElementById('testName');
    const locEl    = document.getElementById('testLoc');
    const avatarEl = document.getElementById('testAvatar');
    const prevBtn  = document.getElementById('testPrev');
    const nextBtn  = document.getElementById('testNext');

    if (!quoteEl || !nameEl || !locEl || !avatarEl || !prevBtn || !nextBtn) return;

    let current = 0;

    // Build dot indicators + controls row (arrows reused inside on mobile)
    const controlsRow = document.createElement('div');
    controlsRow.className = 'testimonial-controls';

    const dotsWrapper = document.createElement('div');
    dotsWrapper.className = 'test-dots';
    testimonials.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'test-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => goTo(i));
        dotsWrapper.appendChild(dot);
    });

    // On mobile the absolute-positioned prev/next buttons become static;
    // move them into the controls row so they sit beside the dots.
    controlsRow.appendChild(prevBtn);
    controlsRow.appendChild(dotsWrapper);
    controlsRow.appendChild(nextBtn);

    avatarEl.closest('.testimonial-author').insertAdjacentElement('afterend', controlsRow);

    function updateDots() {
        dotsWrapper.querySelectorAll('.test-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        const inner = quoteEl.closest('.testimonial-inner') || quoteEl.parentElement;
        inner.style.opacity = '0';
        inner.style.transform = 'translateY(8px)';

        setTimeout(() => {
            current = (index + testimonials.length) % testimonials.length;
            const t = testimonials[current];
            quoteEl.textContent  = t.quote;
            nameEl.textContent   = t.name;
            locEl.textContent    = t.loc;
            avatarEl.src         = t.avatar;
            avatarEl.alt         = t.name;
            updateDots();

            inner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            inner.style.opacity    = '1';
            inner.style.transform  = 'translateY(0)';
        }, 250);
    }

    // Set initial transition style
    const inner = quoteEl.closest('.testimonial-inner') || quoteEl.parentElement;
    inner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 6 seconds
    let autoplay = setInterval(() => goTo(current + 1), 6000);
    [prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            clearInterval(autoplay);
            autoplay = setInterval(() => goTo(current + 1), 6000);
        });
    });
});
