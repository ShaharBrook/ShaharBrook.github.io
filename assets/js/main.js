/* ==========================================================================
   main.js — four small progressive enhancements. ~2KB, no dependencies.

     1. Language switch (EN / עב) without a page reload
     2. Current year in the footer
     3. A hairline under the header once you scroll
     4. Fade-in on scroll for cards (respects prefers-reduced-motion)

   Everything here is optional. With JavaScript disabled the page still
   renders in full, and the language links still work — they just reload
   with ?lang=he instead of swapping in place.
   ========================================================================== */

(function () {
  'use strict';

  // Tells the inline <head> failsafe that this file loaded, so it does not
  // un-hide the scroll-reveal elements out from under us.
  window.__revealReady = true;

  var root = document.documentElement;

  /* ---- 1. Language switch -----------------------------------------------
     The visible copy is swapped by CSS off <html lang> — see section 2b of
     styles.css. All this does is flip the attribute and keep the things that
     live outside the <body> (title, meta description) in sync.

     CUSTOMIZE: the title and description shown per language.
     -------------------------------------------------------------------- */
  var LANG_META = {
    en: {
      title: 'Shahar Brook — Ship AI-generated code safely',
      description: 'Senior engineer helping teams ship AI-generated code safely: code review, security checks, and the agents and guardrails that keep a codebase clean. Also builds CRMs, products and landing pages.'
    },
    he: {
      title: 'שחר ברוק — לשלוח קוד שנכתב ב־AI בלי הסיכון',
      description: 'מהנדס תוכנה בכיר: review ואבטחה לקוד שנכתב ב־AI, סוכנים וחוקים ששומרים על הקוד נקי, ובניית מוצרים, מערכות CRM ודפי נחיתה.'
    }
  };

  var langButtons = document.querySelectorAll('.lang-btn');
  var descMeta = document.querySelector('meta[name="description"]');

  function setLanguage(lang, pushUrl) {
    if (!LANG_META[lang]) return;

    root.lang = lang;
    root.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = LANG_META[lang].title;
    if (descMeta) descMeta.setAttribute('content', LANG_META[lang].description);

    for (var i = 0; i < langButtons.length; i++) {
      var isActive = langButtons[i].getAttribute('data-lang') === lang;
      // aria-current, not aria-pressed: these are links, not toggle buttons.
      if (isActive) langButtons[i].setAttribute('aria-current', 'true');
      else langButtons[i].removeAttribute('aria-current');
    }

    try { localStorage.setItem('lang', lang); } catch (e) { /* private mode */ }

    // Keep the URL shareable without adding a history entry per click.
    if (pushUrl && window.history && history.replaceState) {
      history.replaceState(null, '', '?lang=' + lang + location.hash);
    }
  }

  for (var i = 0; i < langButtons.length; i++) {
    langButtons[i].addEventListener('click', function (event) {
      event.preventDefault();
      setLanguage(this.getAttribute('data-lang'), true);
    });
  }

  // Sync the button state with whatever the inline <head> script decided.
  setLanguage(root.lang === 'he' ? 'he' : 'en', false);

  /* ---- 2. Footer year -------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- 3. Sticky-header border ----------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 4. Scroll reveal -------------------------------------------------
     Elements marked class="reveal" in the HTML start hidden (see the `.js
     .reveal` rule in styles.css) and fade in as they enter the viewport.
     If the browser lacks IntersectionObserver, or the visitor prefers
     reduced motion, everything is simply shown at once.
     -------------------------------------------------------------------- */
  var targets = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    for (var j = 0; j < targets.length; j++) targets[j].classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  targets.forEach(function (el, index) {
    // Small stagger so a row of cards arrives in sequence, not as a block.
    el.style.transitionDelay = (index % 4) * 70 + 'ms';
    observer.observe(el);
  });
})();
