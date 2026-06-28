/* ============================================
   Gerald's Private Web — script.js
   ES5 Compatible
   ============================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     LOADER
  ───────────────────────────────────────── */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('out');
      }, 1500);
    });
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL (both directions)
     fade in + slide up  saat scroll turun
     fade out + slide down saat scroll naik
  ───────────────────────────────────────── */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;

      for (var i = 0; i < items.length; i++) {
        var el   = items[i];
        var rect = el.getBoundingClientRect();
        var inView = rect.top < vh * 0.89 && rect.bottom > 0;

        if (inView) {
          el.classList.add('visible');
          el.classList.remove('hidden');
        } else {
          el.classList.remove('visible');
          el.classList.add('hidden');
        }
      }
    }

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
  }

  /* ─────────────────────────────────────────
     HERO ENTRANCE
  ───────────────────────────────────────── */
  function initHeroEntrance() {
    var card = document.getElementById('heroCard');
    var hint = document.getElementById('scrollHint');
    if (!card) return;

    card.style.opacity   = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.85s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94)';

    if (hint) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.6s ease 1.5s';
    }

    setTimeout(function () {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
      if (hint) hint.style.opacity = '1';
    }, 1600);
  }

  /* ─────────────────────────────────────────
     HERO PARALLAX (mouse)
  ───────────────────────────────────────── */
  function initParallax() {
    var hero = document.getElementById('hero');
    var card = document.getElementById('heroCard');
    var bg   = document.getElementById('heroBg');

    if (!hero || !card) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    hero.addEventListener('mousemove', function (e) {
      var r  = hero.getBoundingClientRect();
      var x  = (e.clientX - r.left)  / r.width  - 0.5;
      var y  = (e.clientY - r.top)   / r.height - 0.5;

      card.style.transform = 'perspective(1200px) rotateX(' + (y * -3.5) + 'deg) rotateY(' + (x * 3.5) + 'deg) translateZ(0)';

      if (bg) {
        bg.style.transform = 'scale(1.04) translate(' + (x * 8) + 'px, ' + (y * 6) + 'px)';
      }
    });

    hero.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (bg) bg.style.transform = 'scale(1.04) translate(0px, 0px)';
    });
  }

  /* ─────────────────────────────────────────
     SCROLL HINT CLICK
  ───────────────────────────────────────── */
  function initScrollHint() {
    var btn  = document.getElementById('scrollHint');
    var dest = document.getElementById('deskripsi');
    if (!btn || !dest) return;

    function go() { dest.scrollIntoView({ behavior: 'smooth' }); }
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  }

  /* ─────────────────────────────────────────
     MARKDOWN PARSER (minimal, ES5)
     Untuk desk-singkat.md
  ───────────────────────────────────────── */
  function parseMd(raw) {
    var lines   = raw.split('\n');
    var html    = '';
    var inList  = false;

    function closeList() {
      if (inList) { html += '</ul>'; inList = false; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // h4
      if (/^####\s/.test(line)) {
        closeList();
        html += '<h4>' + esc(line.replace(/^####\s/, '')) + '</h4>';
        continue;
      }
      // h3
      if (/^###\s/.test(line)) {
        closeList();
        html += '<h3>' + esc(line.replace(/^###\s/, '')) + '</h3>';
        continue;
      }
      // h2
      if (/^##\s/.test(line)) {
        closeList();
        html += '<h2>' + esc(line.replace(/^##\s/, '')) + '</h2>';
        continue;
      }
      // h1
      if (/^#\s/.test(line)) {
        closeList();
        html += '<h1>' + esc(line.replace(/^#\s/, '')) + '</h1>';
        continue;
      }
      // hr
      if (/^---+$/.test(line.trim())) {
        closeList();
        html += '<hr/>';
        continue;
      }
      // list item
      if (/^[-*]\s/.test(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + inline(esc(line.replace(/^[-*]\s/, ''))) + '</li>';
        continue;
      }
      // empty line
      if (line.trim() === '') {
        closeList();
        continue;
      }
      // paragraph
      closeList();
      html += '<p>' + inline(esc(line)) + '</p>';
    }

    closeList();
    return html;
  }

  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function inline(s) {
    // bold
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // italic
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // inline code
    s = s.replace(/`(.+?)`/g, '<code>$1</code>');
    // link [text](url)
    s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  /* ─────────────────────────────────────────
     LOAD desk-singkat.md via fetch
  ───────────────────────────────────────── */
  function loadDeskripsi() {
    var container = document.getElementById('deskContent');
    if (!container) return;

    fetch('./assets/deskripsi/desk-singkat.md')
      .then(function (res) {
        if (!res.ok) throw new Error('Gagal fetch');
        return res.text();
      })
      .then(function (raw) {
        var rendered = parseMd(raw);

        // Cek apakah semua section kosong (hanya heading, tanpa konten)
        var stripped = raw
          .split('\n')
          .filter(function (l) { return !/^#+\s/.test(l) && l.trim() !== ''; })
          .join('');

        if (stripped.length === 0) {
          container.innerHTML = '<p class="desk-empty">Belum ada deskripsi. Isi <code>assets/deskripsi/desk-singkat.md</code> dulu bang.</p>';
        } else {
          container.innerHTML = rendered;
        }
      })
      .catch(function () {
        container.innerHTML = '<p class="desk-empty">Tidak bisa memuat deskripsi. Pastikan file <code>assets/deskripsi/desk-singkat.md</code> ada.</p>';
      });
  }

  /* ─────────────────────────────────────────
     REDUCED MOTION CHECK
  ───────────────────────────────────────── */
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    initLoader();
    initHeroEntrance();
    initScrollHint();
    loadDeskripsi();

    if (!reducedMotion()) {
      initParallax();
    }

    setTimeout(function () {
      initScrollReveal();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
