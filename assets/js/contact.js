// ===== AOS Init =====
AOS.init({
  once: true,
  offset: 60,
  easing: "ease-out-cubic",
});

// ===== GSAP + ScrollTrigger =====
gsap.registerPlugin(ScrollTrigger);

// Lock hero elements immediately — before preloader:done fires
gsap.set(["#gsap-hero-quote", "#gsap-hero-card", "#gsap-hero-network", "#gsap-hero-badge", "#gsap-hero-rating", "#gsap-hero-sub"], { autoAlpha: 0 });
gsap.set("#gsap-hero-badge",  { y: -18 });
gsap.set("#gsap-hero-quote",   { y: 48 });
gsap.set("#gsap-hero-sub",     { y: 30 });
gsap.set("#gsap-hero-rating",  { y: 24 });
gsap.set("#gsap-hero-card",    { x: 60, y: -20 });
gsap.set("#gsap-hero-network", { x: -60, y: 20 });
gsap.set("#gsap-hero-avatars .c-hero__avatars-row img", { autoAlpha: 0, y: 24, scale: 0.7 });
gsap.set(".c-hero__caption", { autoAlpha: 0 });

// --- Hero: staggered entrance — fires after preloader hides ---
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to("#gsap-hero-badge", { autoAlpha: 1, y: 0, duration: 0.6 });
  tl.to("#gsap-hero-quote", { autoAlpha: 1, y: 0, duration: 1 }, "-=0.3");
  tl.to("#gsap-hero-sub", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.7");
  tl.to("#gsap-hero-rating", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.6");
  tl.to("#gsap-hero-card",    { autoAlpha: 1, x: 0, y: 0, duration: 0.85 }, "-=0.6");
  tl.to("#gsap-hero-network", { autoAlpha: 1, x: 0, y: 0, duration: 0.85 }, "-=0.75");
  tl.to("#gsap-hero-avatars .c-hero__avatars-row img", {
    autoAlpha: 1, y: 0, scale: 1,
    duration: 0.45, stagger: 0.08, ease: "back.out(1.7)",
  }, "-=0.5");
  tl.to(".c-hero__caption", { autoAlpha: 1, duration: 0.5 }, "-=0.3");
}

if (document.body.classList.contains('is-loading')) {
  document.addEventListener('preloader:done', initHeroAnimations, { once: true });
} else {
  initHeroAnimations();
}

// --- Info icon circles: scale bounce on scroll ---
gsap.from(".c-info__icon", {
  scrollTrigger: {
    trigger: ".c-info",
    start: "top 80%",
  },
  scale: 0,
  opacity: 0,
  duration: 0.55,
  stagger: 0.15,
  ease: "back.out(2)",
});

// --- Message photo: no animation (image is above the fold overlap area) ---

// --- Message submit button: subtle pulse loop ---
gsap.to(".c-message__submit", {
  scale: 1.04,
  duration: 0.9,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// --- FAQ: decorative glow blobs float ---
gsap.to(".c-faq::before, .c-faq::after", {
  y: -20,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// --- FAQ items: highlight border on scroll (ScrollTrigger batch) ---
ScrollTrigger.batch(".c-faq__item", {
  start: "top 88%",
  onEnter: (els) => {
    gsap.from(els, {
      opacity: 0,
      x: -30,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "opacity,x",
    });
  },
  once: true,
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

// ===== FAQ accordion =====
const faqItems = document.querySelectorAll(".c-faq__item");

faqItems.forEach((item) => {
  const question = item.querySelector(".c-faq__q");
  const answer   = item.querySelector(".c-faq__a");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // Close all
    faqItems.forEach((other) => {
      other.classList.remove("open");
      const q = other.querySelector(".c-faq__q");
      const a = other.querySelector(".c-faq__a");
      if (q) q.setAttribute("aria-expanded", "false");
      if (a) a.style.maxHeight = null;
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// ===== Contact message form (demo) =====
const messageForm = document.getElementById("messageForm");
if (messageForm) {
  const fields = Array.from(messageForm.querySelectorAll("input, textarea"));

  const getErrorElement = (field) => {
    let error = document.getElementById(`${field.name}-error`);
    if (!error) {
      error = document.createElement("span");
      error.id = `${field.name}-error`;
      error.className = "c-form__error";
      field.parentElement.appendChild(error);
    }
    return error;
  };

  const validateField = (field) => {
    const error = getErrorElement(field);
    let message = "";

    if (field.validity.valueMissing) {
      message = "This field is required.";
    } else if (field.validity.typeMismatch) {
      message = "Enter a valid email address.";
    } else if (field.validity.valid === false) {
      message = "Please enter a valid value.";
    }

    error.textContent = message;
    error.hidden = !message;
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(field);
    });
  });

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) {
      fields.find((field) => field.classList.contains("is-invalid"))?.focus();
      return;
    }
    messageForm.reset();
    fields.forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      const error = getErrorElement(field);
      error.textContent = "";
      error.hidden = true;
    });
    window.location.href = "404.html";
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

// ===== GSAP Footer Animations =====

// Logo: fade + slight scale up when footer enters viewport
gsap.from(".footer-brand-logo", {
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 90%",
  },
  opacity: 0,
  scale: 0.75,
  duration: 0.7,
  ease: "back.out(1.8)",
});

// Newsletter input + button: slide up together
gsap.from(".newsletter", {
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 85%",
  },
  opacity: 0,
  y: 24,
  duration: 0.65,
  delay: 0.3,
  ease: "power2.out",
});

// Footer link items: stagger slide-up per column
gsap.utils.toArray(".footer-links ul li").forEach((li, i) => {
  gsap.from(li, {
    scrollTrigger: {
      trigger: li,
      start: "top 95%",
    },
    opacity: 0,
    x: -16,
    duration: 0.4,
    delay: (i % 5) * 0.07,
    ease: "power2.out",
  });
});

// Social icons: pop in with stagger + spring bounce
gsap.from("#gsap-social-icons a", {
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 95%",
  },
  opacity: 0,
  scale: 0,
  duration: 0.45,
  stagger: 0.1,
  ease: "back.out(2)",
});

// Social icons: subtle hover scale via GSAP (non-CSS)
document.querySelectorAll(".social-icons a").forEach((icon) => {
  icon.addEventListener("mouseenter", () => {
    gsap.to(icon, { scale: 1.25, duration: 0.2, ease: "power1.out" });
  });
  icon.addEventListener("mouseleave", () => {
    gsap.to(icon, { scale: 1, duration: 0.2, ease: "power1.in" });
  });
});
