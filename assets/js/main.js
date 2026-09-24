// =========================================================
// THEME TOGGLE
// =========================================================
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// =========================================================
// MOBILE SIDEBAR
// =========================================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobile-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  overlay.classList.toggle('active', isOpen);
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('active');
});

// Close sidebar on nav link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('active');
  });
});

// =========================================================
// TYPING ANIMATION
// =========================================================
const typingStrings = [
  'Android Developer | Java · Kotlin · Jetpack Compose',
  'Full Stack Developer | Spring Boot · Angular',
  'iOS Developer | Swift · SwiftUI',
  'Kotlin Multiplatform Developer',
  'React Native Developer',
  "AI/ML Integrations Developer",
  "Android/IOS & AR/VR Developer",
  "LLM API Integrator"
];
let typeIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const current = typingStrings[typeIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      typeIdx = (typeIdx + 1) % typingStrings.length;
      charIdx = 0;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, 25);
  } else {
    typingEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 60);
  }
}
type();

// =========================================================
// SCROLL REVEAL
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// =========================================================
// ACTIVE NAV LINK
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => navObserver.observe(section));

// =========================================================
// COUNTER ANIMATION
// =========================================================
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 40);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.hero-stat-num').forEach((el, i) => {
        const targets = [8, 5, 25];
        const suffixes = ['+', '', '+'];
        if (i < 3) animateCounter(el, targets[i], suffixes[i]);
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// =========================================================
// CURSOR GLOW (desktop only)
// =========================================================
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
        position:fixed; pointer-events:none; z-index:9998;
        width:300px; height:300px; border-radius:50%;
        background: radial-gradient(circle, rgba(0,229,176,0.06) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: left 0.15s ease, top 0.15s ease;
      `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// =========================================================
// TESTIMONIAL LIGHTBOX
// =========================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.testimonial-card img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* =========================================================
   i18n — tiny string-resource loader (like Android strings.xml)
   HTML:  data-i18n="key"                 -> element.textContent
          data-i18n-html="key"            -> element.innerHTML (for text with <strong>, <span>, <br>)
          data-i18n-attr="attr:key;..."   -> attributes (alt, aria-label, content ...)
          data-i18n-n="3"                 -> fills {n} in the string
   Files: /assets/i18n/en.json, /assets/i18n/ar.json
   Add a language: add a JSON file and one entry in LANGS.
   ========================================================= */
(function () {
  var LANGS = { en: { dir: 'ltr' }, ar: { dir: 'rtl' } };
  var root = document.documentElement;
  var cache = {};
  var current = window.__LANG || 'en';

  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('/assets/i18n/' + lang + '.json')
      .then(function (r) { if (!r.ok) throw new Error(lang + '.json: HTTP ' + r.status); return r.json(); })
      .then(function (d) { return (cache[lang] = d); });
  }

  function warn(key) { console.warn('[i18n] missing key:', key); }

  function apply(strings) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (k in strings) el.textContent = strings[k]; else warn(k);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (k in strings) el.innerHTML = strings[k]; else warn(k);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        var attr = pair.slice(0, i).trim(), k = pair.slice(i + 1).trim();
        if (!(k in strings)) return warn(k);
        el.setAttribute(attr, String(strings[k]).replace('{n}', el.getAttribute('data-i18n-n') || ''));
      });
    });
  }

  /* RTL: mirror the desktop layout (sidebar on the right, content offset from the right).
     Measured at runtime so it works with whatever sidebar width style.css uses. */
  function fixLayout() {
    var sb = document.getElementById('sidebar');
    var targets = [document.querySelector('.main-content'), document.querySelector('footer')];
    var rtl = root.dir === 'rtl', desktop = window.innerWidth > 900;
    targets.forEach(function (t) {
      if (!t) return;
      t.style.marginLeft = rtl && desktop ? '0' : '';
      t.style.marginRight = rtl && desktop && sb ? sb.offsetWidth + 'px' : '';
    });
  }
  window.addEventListener('resize', fixLayout);

  /* Language button: copy the theme toggle's look, make it a bit smaller, centre it right below the toggle */
  function placeLangBtn() {
    var theme = document.getElementById('theme-toggle'), b = document.getElementById('lang-toggle');
    if (!theme || !b) return;
    var r = theme.getBoundingClientRect();
    if (!r.width) return;
    var cs = getComputedStyle(theme), size = Math.round(Math.max(28, r.width * 0.82));
    ['backgroundColor', 'backgroundImage', 'boxShadow', 'color', 'backdropFilter',
     'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderTopLeftRadius'].forEach(function (p) {
      if (cs[p]) b.style[p] = cs[p];
    });
    b.style.borderWidth = cs.borderTopWidth; b.style.borderStyle = cs.borderTopStyle; b.style.borderColor = cs.borderTopColor;
    b.style.borderRadius = cs.borderTopLeftRadius;
    b.style.width = b.style.height = size + 'px';
    b.style.right = 'auto';
    b.style.top = Math.round(r.bottom + 8) + 'px';
    b.style.left = Math.round(r.left + (r.width - size) / 2) + 'px';
  }
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { setTimeout(placeLangBtn, 80); });
  window.addEventListener('resize', placeLangBtn);
  window.addEventListener('load', placeLangBtn);

  function setLang(lang, persist) {
    if (!LANGS[lang]) lang = 'en';
    return load(lang).then(function (strings) {
      current = lang;
      root.lang = lang;
      root.dir = LANGS[lang].dir;
      apply(strings);
      fixLayout();
      placeLangBtn();
      if (persist) { try { localStorage.setItem('lang', lang); } catch (e) {} }
      document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang, strings: strings } }));
    }).catch(function (err) {
      console.error('[i18n]', err);
    }).then(function () {
      root.classList.remove('i18n-loading');
    });
  }

  window.I18N = {
    get lang() { return current; },
    t: function (key) { var s = cache[current]; return s && key in s ? s[key] : key; },
    setLang: setLang,
    ready: null
  };

  var btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', function () {
    setLang(current === 'ar' ? 'en' : 'ar', true);
  });

  placeLangBtn();
  window.I18N.ready = setLang(current, false);
  setTimeout(function () { root.classList.remove('i18n-loading'); }, 2500); // fail-safe
})();