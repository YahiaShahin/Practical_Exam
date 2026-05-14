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

    <!-- hamburger button — visible only on small screens -->
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <!-- nav links + theme — collapses on mobile -->
    <div class="nav-collapse" id="nav-collapse">
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
  </div>
</nav>`;

    /* Remove any existing inline navbar the page may have */
    const existing = document.querySelector('nav.navbar, nav#main-nav');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    /* Sync select to saved theme */
    const sel = document.getElementById('theme-select');
    if (sel) sel.value = saved;

    /* Hamburger toggle */
    const hamburger = document.getElementById('nav-hamburger');
    const collapse  = document.getElementById('nav-collapse');
    if (hamburger && collapse) {
      hamburger.addEventListener('click', function () {
        const open = collapse.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });
      /* Close menu when a nav link is tapped */
      collapse.querySelectorAll('.nav-link').forEach(function (a) {
        a.addEventListener('click', function () {
          collapse.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Navbar is position:sticky — it sits in the document flow naturally.
       No padding needed on any page. The study page sidebar/main offset
       is handled via CSS (top: 52px on sticky sidebar). */
  });
})();
