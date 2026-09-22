document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS (scroll-reveal for quick links) ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40
    });
  }

  /* ---------- GSAP entrance timeline ---------- */
  if (window.gsap) {

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    tl.to('#nfBadge', { opacity: 1, y: 0, duration: .5 }, 0)
      .from('#nfBadge', { y: -16, duration: .5 }, 0)

      .to('#nfFigure', { opacity: 1, duration: .6 }, .1)
      .from('#nfFigure', { y: 30, duration: .6 }, .1)

      /* SVG animation removed */

      .to('#nfTitle', { opacity: 1, y: 0, duration: .6 }, .5)
      .from('#nfTitle', { y: 20, duration: .6 }, .5)

      .to('#nfText', { opacity: 1, y: 0, duration: .6 }, .65)
      .from('#nfText', { y: 20, duration: .6 }, .65)

      .to('#nfActions', { opacity: 1, y: 0, duration: .6 }, .8)
      .from('#nfActions', { y: 20, duration: .6 }, .8);

    /* subtle continuous float on the chart figure */
    gsap.to('#nfFigure', {
      y: -10,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.8
    });

    /* gentle pulse removed since SVG ring is removed */
  }

  /* ---------- Go Back button ---------- */
  const backBtn = document.getElementById('btnBack');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

});
