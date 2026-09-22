/* ============================================================
   Stackly — Login & Signup 
   ============================================================ */

(() => {
  'use strict';

  /* Where to go after login — one URL per role */
  const DASHBOARD_URLS = {
    user:      'analyst-dashboard.html',
    admin:     'analyst-dashboard.html',
    executive: 'executive-dashboard.html',
    analyst:   'analyst-dashboard.html',
  };
  const LOGIN_URL = 'login.html';
  const HOME_URL  = 'index.html';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const NAME_RE  = /^\p{L}[\p{L}\s.'-]{1,59}$/u;

  /* Each rule returns an error message, or '' when the value is fine. */
  const rules = {
    name(value) {
      if (!value.trim()) return 'Enter your full name.';
      if (!NAME_RE.test(value.trim())) return 'Use letters only, at least 2 characters.';
      return '';
    },
    email(value) {
      if (!value.trim()) return 'Enter your email address.';
      if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email, like name@company.com.';
      return '';
    },
    loginPassword(value) {
      if (!value) return 'Enter your password.';
      if (value.length < 8) return 'Password must be at least 8 characters.';
      return '';
    },
    newPassword(value) {
      if (!value) return 'Create a password.';
      if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        return 'Use at least 8 characters with a letter and a number.';
      }
      return '';
    },
    confirm(value, form) {
      if (!value) return 'Confirm your password.';
      const password = form.querySelector('[data-validate="newPassword"]');
      if (password && value !== password.value) return "Passwords don't match.";
      return '';
    }
  };

  const setError = (input, message) => {
    const field = input.closest('.field');
    const errorEl = field && field.querySelector('.field-error');
    if (!field || !errorEl) return;
    field.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorEl.textContent = message;
  };

  const validateInput = (input, form) => {
    const rule = rules[input.dataset.validate];
    const message = rule ? rule(input.value, form) : '';
    setError(input, message);
    return !message;
  };

  const validateForm = (form) => {
    const inputs = Array.from(form.querySelectorAll('[data-validate]'));
    let firstInvalid = null;
    inputs.forEach((input) => {
      if (!validateInput(input, form) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  /* Validate a field once it has been visited, then keep it live. */
  const wireLiveValidation = (form) => {
    form.querySelectorAll('[data-validate]').forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value !== '' || input.closest('.field').classList.contains('is-invalid')) {
          validateInput(input, form);
        }
      });
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('is-invalid')) {
          validateInput(input, form);
        }
        // keep "confirm password" in step when the password changes
        if (input.dataset.validate === 'newPassword') {
          const confirm = form.querySelector('[data-validate="confirm"]');
          if (confirm && confirm.value) validateInput(confirm, form);
        }
      });
    });
  };

  const selectedRole = (form) => {
    const checked = form.querySelector('input[name="role"]:checked');
    return checked ? checked.value : 'user';
  };

  /* ---------- Login page ---------- */
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    const submitBtn = document.getElementById('loginSubmit');
    const statusEl  = document.getElementById('loginStatus');
    const notice    = document.getElementById('registeredNotice');

    // Shown after a successful signup redirect
    if (notice && new URLSearchParams(window.location.search).get('registered') === '1') {
      notice.hidden = false;
    }

    const goToDashboard = (message) => {
      const role = selectedRole(loginForm);
      const dest = DASHBOARD_URLS[role] || DASHBOARD_URLS.user;
      // Remember who signed in so dashboards can show the account in the
      // header. sessionStorage lives for this tab only; the email is also
      // passed as a query param fallback (new tab / copied URL).
      const emailEl = loginForm.querySelector('#loginEmail');
      const email = emailEl ? emailEl.value.trim() : '';
      try {
        sessionStorage.setItem('stackly_session', JSON.stringify({ email, role }));
      } catch (_) { /* storage unavailable — query param still carries it */ }
      statusEl.textContent = message;
      window.setTimeout(() => {
        window.location.href = dest;
      }, 700);
    };

    wireLiveValidation(loginForm);

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitBtn.disabled) return;
      statusEl.textContent = '';
      if (!validateForm(loginForm)) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in…';
      goToDashboard(`Signing you in as ${selectedRole(loginForm)}…`);
    });
  }

  /* ---------- Signup page ---------- */
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    const submitBtn = document.getElementById('signupSubmit');
    const statusEl  = document.getElementById('signupStatus');

    wireLiveValidation(signupForm);

    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitBtn.disabled) return;
      statusEl.textContent = '';
      if (!validateForm(signupForm)) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Account created';
      statusEl.textContent = 'Taking you to log in…';
      signupForm.reset(); // nothing is kept
      window.setTimeout(() => {
        window.location.href = `${LOGIN_URL}?registered=1`;
      }, 900);
    });

  }

  /* ----------------------------------------------------------
     PASSWORD SHOW / HIDE TOGGLE
  ---------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pw-toggle');
    if (!btn) return;

    const targetId = btn.dataset.target;
    const input    = targetId ? document.getElementById(targetId) : null;
    const wrap     = btn.closest('.pw-wrap');
    if (!input || !wrap) return;

    const isShowing = input.type === 'text';
    input.type = isShowing ? 'password' : 'text';
    wrap.classList.toggle('is-visible', !isShowing);
    btn.setAttribute('aria-label', isShowing ? 'Show password' : 'Hide password');
  });

})();