/**
 * nav.js — Universal navbar + theme system
 * Load this as the FIRST script on every page (before DOMContentLoaded fires).
 * It applies the saved theme immediately (no flash) and injects the navbar on load.
 */
(function () {
  /* ── 1. Apply saved theme immediately to avoid flash ── */
  const saved = localStorage.getItem('study_theme') || 'paper';
  document.documentElement.setAttribute('data-theme', saved);

  /* ── 2. Expose changeTheme globally ── */
  window.changeTheme = function (val) {
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('study_theme', val);
  };

  /* ── 3. Inject navbar on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    function link(href, label) {
      const isActive = page === href || (href === 'index.html' && page === '');
      return `<li><a href="${href}" class="nav-link${isActive ? ' active' : ''}">${label}</a></li>`;
    }

    const navHTML = `
<nav class="navbar" id="main-nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-brand">IntroToC</a>
    <ul class="nav-links">
      ${link('index.html', 'Home')}
      ${link('study.html', 'Study')}
      ${link('problems.html', 'Problems')}
    </ul>
    <div class="nav-right">
      <span class="nav-theme-label">THEME:</span>
      <select class="nav-theme-select" id="theme-select" onchange="changeTheme(this.value)">
        <option value="paper">Paper (Light)</option>
        <option value="latte">Latte (Light)</option>
        <option value="nord">Nord (Icy)</option>
        <option value="dark-original">Original Dark</option>
        <option value="midnight-gold">Midnight Gold</option>
        <option value="neon-synth">Neon Synth</option>
        <option value="rose-pine">Rosé Pine</option>
      </select>
    </div>
  </div>
</nav>`;

    /* Remove any existing inline navbar the page may have */
    const existing = document.querySelector('nav.navbar, nav#main-nav');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    /* Sync select to saved theme */
    const sel = document.getElementById('theme-select');
    if (sel) sel.value = saved;

    /* study.html uses a sidebar layout — its .main and .sidebar already have
       margin-top:60px via inline style. For other pages we pad the body. */
    if (!document.querySelector('.app')) {
      document.body.style.paddingTop = '52px';
    }
  });
})();
