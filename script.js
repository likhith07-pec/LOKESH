/**
 * LOKESH N.T. PORTFOLIO — script.js v2
 * Enhanced: loader, cursor, canvas particles, typing, scroll animations,
 *           skill bars, stat counters, navbar, mobile menu, contact form
 */

/* ============================================================
   1. LOADER
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initCanvas();
  }, 1900);
});

/* ============================================================
   2. CUSTOM CURSOR
============================================================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverEls = 'a, button, input, textarea, .skill-card, .equip-card, .stat-card, .cert-card, .edu-card, .timeline-card';
document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
});

/* ============================================================
   3. HERO CANVAS — Enhanced Particle Network
============================================================ */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const NUM = 75;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.r     = Math.random() * 1.8 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = -(Math.random() * 0.45 + 0.1);
      this.alpha = Math.random() * 0.6 + 0.1;
      // Some particles are electric-colored
      this.isElectric = Math.random() < 0.25;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
      if (this.x < 0)  this.x = W;
      if (this.x > W)  this.x = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      if (this.isElectric) {
        ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha * 0.7})`;
      } else {
        ctx.fillStyle = `rgba(96, 165, 250, ${this.alpha})`;
      }
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: NUM }, () => new Particle());
  }
  buildParticles();

  function drawConnections() {
    const DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const a = (1 - d / DIST) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          // Electric connections between electric particles
          if (particles[i].isElectric && particles[j].isElectric) {
            ctx.strokeStyle = `rgba(0, 212, 255, ${a * 1.5})`;
          } else {
            ctx.strokeStyle = `rgba(59, 130, 246, ${a})`;
          }
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   4. TYPING ANIMATION
============================================================ */
const typedEl = document.getElementById('typedText');
const phrases = [
  'Infra Electrical Engineer',
  'Data Center Operations Expert',
  'HSQE Safety Professional',
  'Preventive Maintenance Lead'
];
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  if (!typedEl) return;
  const current = phrases[pIdx];
  const display  = deleting ? current.substring(0, cIdx - 1) : current.substring(0, cIdx + 1);
  typedEl.innerHTML = display + '<span class="cursor-blink"></span>';
  deleting ? cIdx-- : cIdx++;

  let delay = deleting ? 42 : 70;
  if (!deleting && cIdx === current.length) {
    delay = 2400; deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    delay = 350;
  }
  setTimeout(type, delay);
}
setTimeout(type, 2100);

/* ============================================================
   5. NAVBAR — scroll + mobile toggle
============================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ============================================================
   6. BACK TO TOP
============================================================ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   7. SCROLL REVEAL — fade-up elements
============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
      siblings.forEach((el, idx) => {
        if (el === entry.target) {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   8. SKILL BARS — animate when visible
============================================================ */
const skillFills = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const w = target.getAttribute('data-w');
      setTimeout(() => { target.style.width = w + '%'; }, 250);
      barObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => barObserver.observe(el));

/* ============================================================
   9. STAT COUNTER ANIMATION
============================================================ */
function animateCount(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(interval);
  }, 22);
}

const statNums = document.querySelectorAll('.stat-number');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCount(el, target);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => countObserver.observe(el));

/* ============================================================
   10. CONTACT FORM
============================================================ */
/* ============================================================
   10. CONTACT FORM (EMAILJS INTEGRATED)
============================================================ */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';

    emailjs.send("service_3p0kuzx", "template_kx8wmj2", {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    })
    .then(function() {
        btn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        btn.disabled  = false;

        if (formSuccess) {
          formSuccess.classList.add('visible');
          form.reset();
          setTimeout(() => formSuccess.classList.remove('visible'), 4000);
        }
    }, function(error) {
        console.log(error);
        btn.innerHTML = '<span>Failed ❌</span>';
        btn.disabled = false;
    });
  });
}

/* ============================================================
   11. ACTIVE NAV HIGHLIGHT
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active { color: var(--electric); } .nav-links a.active::after { width: 100%; background: var(--electric); }`;
document.head.appendChild(navStyle);

/* ============================================================
   12. CARD TILT EFFECT
============================================================ */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s ease, border-color 0.3s, box-shadow 0.3s';
    });
  });
}
addTilt('.skill-card');
addTilt('.equip-card');
addTilt('.cert-card');

/* ============================================================
   13. HERO PARALLAX — subtle depth on scroll
============================================================ */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  const ghostText   = document.querySelector('.hero-ghost-text');
  const scrollY     = window.scrollY;

  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    heroContent.style.opacity   = 1 - (scrollY / (window.innerHeight * 0.7));
  }
  if (ghostText && scrollY < window.innerHeight) {
    ghostText.style.transform = `translateY(calc(-50% + ${scrollY * 0.08}px))`;
  }
}, { passive: true });