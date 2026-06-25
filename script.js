/* ============================================
   Gerald's Private Web — script.js
   ES5 Compatible
   ============================================ */

(function () {
  'use strict';

  /* ── Loader ── */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 1300);
    });
  }

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    function checkReveal() {
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var rect = el.getBoundingClientRect();
        var elTop = rect.top;
        var elBottom = rect.bottom;

        var triggerPoint = windowHeight * 0.88;

        if (elTop < triggerPoint && elBottom > 0) {
          el.classList.add('visible');
          el.classList.remove('hidden');
        } else {
          el.classList.remove('visible');
          el.classList.add('hidden');
        }
      }
    }

    // Initial check
    checkReveal();

    // On scroll
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal, { passive: true });
  }

  /* ── Hero Scroll Button ── */
  function initHeroScroll() {
    var btn = document.getElementById('heroScroll');
    if (!btn) return;

    function scrollToNext() {
      var deskripsi = document.getElementById('deskripsi');
      if (deskripsi) {
        deskripsi.scrollIntoView({ behavior: 'smooth' });
      }
    }

    btn.addEventListener('click', scrollToNext);

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToNext();
      }
    });
  }

  /* ── Hero Card Subtle Parallax on Mouse ── */
  function initHeroParallax() {
    var hero = document.getElementById('hero');
    var card = hero ? hero.querySelector('.hero-card') : null;
    var orb1 = hero ? hero.querySelector('.hero-orb-1') : null;
    var orb2 = hero ? hero.querySelector('.hero-orb-2') : null;

    if (!hero || !card) return;

    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      var y = (e.clientY - rect.top)  / rect.height - 0.5;

      var cardTiltX = y * -4;
      var cardTiltY = x *  4;

      card.style.transform = 'perspective(1000px) rotateX(' + cardTiltX + 'deg) rotateY(' + cardTiltY + 'deg) translateZ(0)';

      if (orb1) {
        orb1.style.transform = 'translate(' + (x * 25) + 'px, ' + (y * 20) + 'px)';
      }
      if (orb2) {
        orb2.style.transform = 'translate(' + (x * -18) + 'px, ' + (y * -15) + 'px)';
      }
    });

    hero.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (orb1) orb1.style.transform = 'translate(0, 0)';
      if (orb2) orb2.style.transform = 'translate(0, 0)';
    });
  }

  /* ── Hero Entrance Animation ── */
  function initHeroEntrance() {
    var loader   = document.getElementById('loader');
    var heroCard = document.querySelector('#hero .hero-card');
    var heroScroll = document.getElementById('heroScroll');

    if (!heroCard) return;

    heroCard.style.opacity  = '0';
    heroCard.style.transform = 'translateY(32px)';
    heroCard.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';

    if (heroScroll) {
      heroScroll.style.opacity = '0';
      heroScroll.style.transition = 'opacity 0.6s ease 1.4s';
    }

    var delay = loader ? 1400 : 200;

    setTimeout(function () {
      heroCard.style.opacity  = '1';
      heroCard.style.transform = 'translateY(0)';
      if (heroScroll) {
        heroScroll.style.opacity = '1';
      }
    }, delay);
  }

  /* ── Reduced Motion Check ── */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── Init All ── */
  function init() {
    initLoader();
    initHeroEntrance();

    if (!prefersReducedMotion()) {
      initHeroParallax();
    }

    initHeroScroll();

    // Slight delay before init scroll reveal so entrance anim plays first
    setTimeout(function () {
      initScrollReveal();
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
