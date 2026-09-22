// ===== AOS Init =====
AOS.init({
  once: true,
  offset: 60,
  easing: "ease-out-cubic",
});

// ===== GSAP + ScrollTrigger =====
gsap.registerPlugin(ScrollTrigger);

// Lock hero elements immediately — before preloader:done fires
gsap.set(["#gsap-hero-badge", "#gsap-hero-title", "#gsap-hero-desc", ".b-page-hero__search"], {
  autoAlpha: 0,
});
gsap.set("#gsap-hero-badge",       { y: -20 });
gsap.set("#gsap-hero-title",       { y: 40 });
gsap.set("#gsap-hero-desc",        { y: 24 });
gsap.set(".b-page-hero__search",   { y: 20, scale: 0.97 });

// --- Hero: staggered entrance — fires after preloader hides ---
function initHero() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to("#gsap-hero-badge", { autoAlpha: 1, y: 0, duration: 0.6 });
  tl.to("#gsap-hero-title", { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.3");
  tl.to("#gsap-hero-desc",  { autoAlpha: 1, y: 0, duration: 0.65 }, "-=0.5");
  tl.to(".b-page-hero__search", {
    autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)",
  }, "-=0.4");
}

if (document.body.classList.contains('is-loading')) {
  document.addEventListener('preloader:done', initHero, { once: true });
} else {
  initHero();
}

// --- Blog cards: stagger pop on scroll ---
ScrollTrigger.batch("#blogGrid .b-card", {
  start: "top 88%",
  onEnter: (els) => {
    gsap.from(els, {
      opacity: 0,
      y: 36,
      scale: 0.97,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "opacity,y,scale",
    });
  },
  once: true,
});

// --- Stats: count-up animation ---
ScrollTrigger.create({
  trigger: ".b-stats",
  start: "top 80%",
  once: true,
  onEnter: () => {
    document.querySelectorAll(".b-stat__num").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    // Animate stat icons with spring
    gsap.from(".b-stat__icon", {
      scale: 0,
      opacity: 0,
      duration: 0.55,
      stagger: 0.15,
      ease: "back.out(2)",
    });
  },
});

// --- Trial card: glow pulse loop ---
gsap.to(".b-trial__card::after", {
  // pseudo-elements can't be animated directly — animate a wrapper instead
});
gsap.to(".b-trial__btn", {
  scale: 1.04,
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// --- Workflow media: float up gently on scroll ---
gsap.from(".b-workflow__users", {
  scrollTrigger: {
    trigger: ".b-workflow__media-wrap",
    start: "top 80%",
  },
  opacity: 0,
  y: 20,
  scale: 0.9,
  duration: 0.6,
  ease: "back.out(1.8)",
  delay: 0.5,
});

// --- Workflow action buttons: hover handled by CSS, entrance via GSAP ---
gsap.from(" .b-workflow__learn", {
  scrollTrigger: {
    trigger: ".b-workflow__copy",
    start: "top 85%",
  },
  opacity: 0,
  y: 16,
  duration: 0.45,
  stagger: 0.12,
  ease: "power2.out",
});

// ===== Mobile nav toggle =====
const menuToggle = document.getElementById("menuToggle");
const mainNav    = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

// ===== Blog category filter =====
const tabs      = document.querySelectorAll(".b-hub__tab");
const gridCards = document.querySelectorAll("#blogGrid .b-card");
const emptyEl   = document.getElementById("blogEmpty");

// Hiding/showing cards changes page height, so AOS + ScrollTrigger must
// recalculate trigger positions. Without this, sections below the grid keep
// stale offsets and stay stuck at opacity:0 ("content not loaded").
let refreshQueued = false;
function refreshScrollAnimations() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    if (typeof AOS !== "undefined" && AOS.refresh) AOS.refresh();
    if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) ScrollTrigger.refresh();
  });
}

// Pop newly revealed cards in. The initial ScrollTrigger.batch(..., once:true)
// won't refire for them, and their AOS state may be stale while display:none,
// so animate them explicitly and mark their AOS transition as done.
function revealCards(cards) {
  if (!cards.length) return;
  cards.forEach((card) => card.classList.add("aos-animate"));
  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out", clearProps: "opacity,transform", overwrite: "auto" }
    );
  }
}

function filterCards(filter) {
  let visibleCount = 0;
  const newlyVisible = [];
  gridCards.forEach((card) => {
    const show = filter === "all" || card.dataset.category === filter;
    if (show && card.hidden) newlyVisible.push(card);
    card.hidden = !show;
    if (show) visibleCount++;
  });
  if (emptyEl) emptyEl.hidden = visibleCount > 0;
  revealCards(newlyVisible);
  refreshScrollAnimations();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    filterCards(tab.dataset.filter);
  });
});

// ===== Search =====
const searchForm  = document.getElementById("blogSearch");
const searchInput = document.getElementById("blogSearchInput");

function applySearch(query) {
  const q = query.trim().toLowerCase();
  let visibleCount = 0;
  const newlyVisible = [];
  gridCards.forEach((card) => {
    const show = !q || (card.dataset.title && card.dataset.title.includes(q));
    if (show && card.hidden) newlyVisible.push(card);
    card.hidden = !show;
    if (show) visibleCount++;
  });
  if (emptyEl) emptyEl.hidden = visibleCount > 0;
  revealCards(newlyVisible);
  refreshScrollAnimations();
}

if (searchInput) {
  searchInput.addEventListener("input", () => applySearch(searchInput.value));
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applySearch(searchInput ? searchInput.value : "");
  });
}

// ===== Testimonial slider =====
const testimonials = [
  {
    quote: '"I needed to understand AI well enough to lead through it - not just delegate it. This course gave me exactly that. I made three strategic decisions differently the week after."',
    name: "Ronald Benson",
    loc: "LOS ANGELES, CA",
    avatar: "assets/images/blog-avatar.webp",
  },
  {
    quote: '"The automation tools transformed how our team works. We shipped faster and cut manual reporting time in half within the first month of adopting Stackly."',
    name: "Robert Chen",
    loc: "AUSTIN, TX",
    avatar: "assets/images/avater-1.webp",
  },
  {
    quote: '"Clear, practical, and immediately useful. Stackly gave our leadership the confidence to make data-driven decisions across every department."',
    name: "Marcus Lee",
    loc: "SEATTLE, WA",
    avatar: "assets/images/avatar.webp",
  },
];

let current  = 0;
const quoteEl  = document.getElementById("testimonialQuote");
const nameEl   = document.getElementById("testimonialName");
const locEl    = document.getElementById("testimonialLoc");
const avatarEl = document.getElementById("testimonialAvatar");

function renderTestimonial(index) {
  if (!quoteEl) return;
  const t = testimonials[index];
  quoteEl.style.opacity = "0";
  setTimeout(() => {
    quoteEl.textContent = t.quote;
    nameEl.textContent  = t.name;
    locEl.textContent   = t.loc;
    avatarEl.src        = t.avatar;
    avatarEl.alt        = "Portrait of " + t.name;
    quoteEl.style.opacity = "1";
  }, 200);
}

if (quoteEl) quoteEl.style.transition = "opacity 0.2s ease";

const prevBtn = document.getElementById("testimonialPrev");
const nextBtn = document.getElementById("testimonialNext");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    current = (current - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(current);
  });
  nextBtn.addEventListener("click", () => {
    current = (current + 1) % testimonials.length;
    renderTestimonial(current);
  });
}

// ===== Trial form (demo) =====
const trialForm = document.getElementById("trialForm");
if (trialForm) {
  trialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("trialEmail");
    const errorText = document.getElementById("trialError");
    
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    
    if (input && isValidEmail) {
      if (errorText) errorText.style.display = 'none';
      trialForm.reset();
      window.location.href = '404.html';
    } else {
      if (errorText) errorText.style.display = 'block';
    }
  });
}

// ===== Footer newsletter form (demo) =====
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  const input = newsletterForm.querySelector("input[type=email]");
  const error = document.getElementById("newsletterError");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showNewsletterError = (message) => {
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  input.addEventListener("input", () => showNewsletterError(""));
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return showNewsletterError("Enter your email address.");
    if (!emailPattern.test(email)) return showNewsletterError("Enter a valid email address.");
    showNewsletterError("");
    newsletterForm.reset();
    window.location.href = "404.html";
  });
}
