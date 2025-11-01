/* script.js
   Full behavior for the portfolio:
   - Typewriter animation
   - Theme toggle (persisted)
   - Smooth anchor scroll
   - Scroll reveal (sections) + animate skill bars from inline widths
   - Simple particle float animations for .particles placeholders
   - Parallax subtle movement for hero image background
   - Contact form demo handling
   - Small accessibility helpers
*/

/* ---------- Typewriter ---------- */
(function typewriterInit() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = [
    'Full-Stack Developer',
    'React & Node.js Engineer',
    'AI Integrator',
    'Open Source Contributor'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const speedType = 60, speedDelete = 35, pause = 1400;

  function tick() {
    const current = roles[roleIdx % roles.length];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx++;
      }
    }
    setTimeout(tick, deleting ? speedDelete : speedType);
  }
  tick();
})();

/* ---------- Theme toggle (persisted) ---------- */
(function themeInit() {
  const btn = document.getElementById('theme-toggle');
  const body = document.body;
  const storageKey = 'portfolio-theme'; // 'dark' or 'light'

  function applyTheme(isDark) {
    if (isDark) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    try { localStorage.setItem(storageKey, isDark ? 'dark' : 'light'); } catch(e){}
  }

  // init from storage or system
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch(e){ saved = null; }
  if (saved === 'dark') applyTheme(true);
  else if (saved === 'light') applyTheme(false);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }

  if (btn) btn.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark-mode')));
})();

/* ---------- Smooth anchor scroll ---------- */
(function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (ev) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        ev.preventDefault();
        const offset = 72; // account for fixed navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ---------- Prepare skill bars (capture target widths then reset) ---------- */
(function prepareSkillBars() {
  const progressEls = Array.from(document.querySelectorAll('.progress'));
  progressEls.forEach(p => {
    // if inline style width is present (e.g., "95%"), capture it
    let target = p.style.width || p.getAttribute('data-width') || p.getAttribute('data-value') || '';
    target = String(target).trim();
    if (target.endsWith('%')) {
      p.dataset.target = target;
    } else if (target !== '') {
      // numeric
      p.dataset.target = target + '%';
    } else {
      // try reading computed width relative to parent (fallback)
      p.dataset.target = '80%';
    }
    // reset to 0 for initial animation
    p.style.width = '0%';
  });
})();

/* ---------- Scroll reveal + animate skill bars ---------- */
(function scrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');

      // animate progress bars inside this revealed section
      const bars = entry.target.querySelectorAll('.progress');
      bars.forEach(bar => {
        const target = bar.dataset.target || bar.getAttribute('data-value') || bar.getAttribute('data-width') || '80%';
        // small timeout to allow CSS transition
        setTimeout(() => { bar.style.width = target; }, 60);
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => io.observe(r));
})();

/* ---------- Particles simple animation (for .particles container) ---------- */
(function particlesAnimate() {
  const container = document.querySelector('.particles');
  if (!container) return;

  // if static particle placeholders present, animate them
  const staticParticles = Array.from(container.querySelectorAll('.particle'));
  if (staticParticles.length) {
    staticParticles.forEach((p, i) => {
      // randomize size & position
      const size = (Math.random() * 5) + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${20 + Math.random() * 60}%`;
      p.style.opacity = 0.3 + Math.random() * 0.7;

      // animate loop using CSS transforms via JS to allow different trajectories
      function animateOnce() {
        const dx = (Math.random() - 0.5) * 120;
        const dy = -120 - Math.random() * 200;
        p.style.transition = `transform ${6 + Math.random()*6}s linear, opacity ${6 + Math.random()*6}s ease`;
        p.style.transform = `translate(${dx}px, ${dy}px)`;
        p.style.opacity = 0;
        // reset after duration
        setTimeout(() => {
          p.style.transition = 'none';
          p.style.transform = 'translate(0,0)';
          p.style.opacity = 0.6 + Math.random() * 0.4;
          // schedule next
          setTimeout(animateOnce, 100 + Math.random() * 1500);
        }, (6 + Math.random()*6) * 1000);
      }
      // small delay per particle
      setTimeout(animateOnce, i * 300 + Math.random() * 800);
    });
  } else {
    // if none there, create a few programmatically
    const COUNT = 20;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = (Math.random() * 6) + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${20 + Math.random() * 60}%`;
      p.style.opacity = 0.5 + Math.random() * 0.5;
      container.appendChild(p);
      // animate similar to above
      (function animate(el) {
        function once() {
          const dx = (Math.random() - 0.5) * 120;
          const dy = -120 - Math.random() * 220;
          el.style.transition = `transform ${7 + Math.random()*6}s linear, opacity ${7 + Math.random()*6}s ease`;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
          el.style.opacity = 0;
          setTimeout(() => {
            el.style.transition = 'none';
            el.style.transform = 'translate(0,0)';
            el.style.opacity = 0.6 + Math.random()*0.4;
            setTimeout(once, 100 + Math.random() * 1200);
          }, (7 + Math.random()*6) * 1000);
        }
        setTimeout(once, Math.random() * 1000);
      })(p);
    }
  }
})();

/* ---------- Parallax subtle movement for hero parallax-bg ---------- */
(function parallaxHero() {
  const parallax = document.querySelector('.parallax-bg');
  if (!parallax) return;
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12; // horizontal parallax
    const y = (e.clientY / window.innerHeight - 0.5) * 8; // vertical parallax
    parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  // gentle motion on idle
  let t = 0;
  function idleMove() {
    t += 0.005;
    const x = Math.sin(t) * 4;
    const y = Math.cos(t) * 2;
    parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(idleMove);
  }
  requestAnimationFrame(idleMove);
})();

/* ---------- Contact form demo handling ---------- */
(function contactFormDemo() {
  const form = document.getElementById('contact-form') || document.querySelector('form#contact-form') || document.querySelector('#contact form');
  if (!form) return;
  // look for a visible status element or create one
  let status = document.getElementById('form-status');
  if (!status) {
    status = document.createElement('p');
    status.id = 'form-status';
    status.style.marginTop = '0.6rem';
    form.appendChild(status);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // find inputs generically
    const name = form.querySelector('input[type="text"], input[name="name"], #name') ? (form.querySelector('input[type="text"], input[name="name"], #name').value || '').trim() : '';
    const email = form.querySelector('input[type="email"], input[name="email"], #email, #emailField') ? (form.querySelector('input[type="email"], input[name="email"], #email, #emailField').value || '').trim() : '';
    const message = form.querySelector('textarea, textarea[name="message"], #message') ? (form.querySelector('textarea, textarea[name="message"], #message').value || '').trim() : '';

    if (!name || !email || !message) {
      status.textContent = 'Please complete all fields before sending.';
      status.style.color = 'var(--highlight-color)';
      return;
    }
    status.textContent = 'Sending message...';
    status.style.color = 'var(--accent-color)';
    // simulate network delay
    setTimeout(() => {
      status.textContent = `Thanks ${name}! (Demo) Your message was received — I will contact you soon.`;
      status.style.color = 'var(--accent-color)';
      form.reset();
    }, 900);
  });
})();

/* ---------- Small accessibility helpers ---------- */
(function a11yHelpers() {
  // make Enter key activate buttons & anchors for keyboard users
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') el.click();
    });
  });
})();
