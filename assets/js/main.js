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