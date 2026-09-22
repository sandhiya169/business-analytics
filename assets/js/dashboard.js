/* ============================================================
   Stackly — Dashboard 
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const sidebar   = document.getElementById('dashSidebar');
  const scrim     = document.getElementById('dashScrim');
  const menuBtn   = document.getElementById('dashMenuToggle');
  const navItems  = Array.from(document.querySelectorAll('.dash-nav-item'));
  const pages     = Array.from(document.querySelectorAll('.dash-page'));
  const titleEl   = document.getElementById('dashTopbarTitle');
  const subEl     = document.getElementById('dashTopbarSub');

  /* ---------- signed-in account in the topbar ---------- */
  (() => {
    const readSession = () => {
      try {
        const raw = sessionStorage.getItem('stackly_session');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch (_) { /* storage unavailable */ }
      return { email: '', role: '' };
    };

    const session = readSession();
    const email = (session.email || '').trim();
    if (!email || !email.includes('@')) return; // keep demo fallback text

    const nameEl   = document.querySelector('.dash-user-name');
    const avatarEl = document.querySelector('.dash-user-avatar');
    const roleEl   = document.querySelector('.dash-user-role');
    const sidebarEmailEl = document.getElementById('dashSidebarEmail');

    if (sidebarEmailEl) {
      sidebarEmailEl.textContent = email;
      sidebarEmailEl.title = email;
    }

    if (nameEl) {
      nameEl.textContent = email;
      nameEl.title = email;
    }
    if (avatarEl) {
      const local = email.split('@')[0].replace(/[^a-z0-9]/gi, '');
      avatarEl.textContent = (local.slice(0, 2) || 'U').toUpperCase();
    }
    if (roleEl && session.role) {
      roleEl.textContent = session.role.charAt(0).toUpperCase() + session.role.slice(1);
    }
  })();

  if (!navItems.length || !pages.length) return;

  /* ---------- mobile off-canvas sidebar ---------- */
  const openSidebar = () => {
    sidebar.classList.add('open');
    scrim.classList.add('show');
    menuBtn.setAttribute('aria-expanded', 'true');
  };
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }
  if (scrim) scrim.addEventListener('click', closeSidebar);

  /* ---------- page switching ---------- */
  const showPage = (key, updateHash) => {
    const targetItem = navItems.find((item) => item.dataset.page === key);
    const targetPage  = pages.find((page) => page.dataset.page === key);
    if (!targetItem || !targetPage) return;

    navItems.forEach((item) => {
      const isActive = item === targetItem;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    pages.forEach((page) => page.classList.toggle('active', page === targetPage));

    if (titleEl) titleEl.textContent = targetItem.dataset.label || targetItem.textContent.trim();
    if (subEl && targetItem.dataset.sub) subEl.textContent = targetItem.dataset.sub;

    if (updateHash) {
      // hash updates disabled — keeps the URL clean
    }
    targetPage.setAttribute('tabindex', '-1');
    document.title = document.title.split(' — ')[0] + ' — ' + (targetItem.dataset.label || targetItem.textContent.trim());
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      showPage(item.dataset.page, true);
      closeSidebar();
      document.querySelector('.dash-pages').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- initial page: hash, else first nav item ---------- */
  const initialKey = window.location.hash.replace('#', '');
  const hasInitial = navItems.some((item) => item.dataset.page === initialKey);
  showPage(hasInitial ? initialKey : navItems[0].dataset.page, false);

  /* ---------- toggle switches (settings) — visual only ---------- */
  document.querySelectorAll('.switch input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', () => {
      const row = input.closest('.toggle-row');
      if (row) row.classList.toggle('is-on', input.checked);
    });
  });

  /* ---------- close mobile sidebar on escape ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });
});
