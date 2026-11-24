/* =====================================================================
   PORTFOLIO — VANILLA JAVASCRIPT
   Organized by feature. Each block is independent, so you can remove
   a feature by deleting its block without breaking the others.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. CURRENT YEAR (footer)
  ------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* -------------------------------------------------------------
     2. DARK / LIGHT MODE (saved to localStorage)
  ------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // Restore saved theme, otherwise respect system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });


  /* -------------------------------------------------------------
     3. STICKY NAVBAR EFFECT ON SCROLL
  ------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  function handleNavbarScroll() {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 40);
    }
    lastScrollY = y;
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* -------------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  const navbarInner = document.querySelector('.navbar__inner');

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    navLinksEl?.classList.remove('mobile-open');
    navbarInner?.classList.remove('menu-open');
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinksEl?.classList.toggle('mobile-open', isOpen);
    navbarInner?.classList.toggle('menu-open', isOpen);
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* -------------------------------------------------------------
     5. SMOOTH SCROLL + ACTIVE NAV LINK ON SCROLL
  ------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140; // offset for fixed navbar

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* -------------------------------------------------------------
     6. SCROLL REVEAL ANIMATION (IntersectionObserver)
  ------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* -------------------------------------------------------------
     7. ANIMATED STATISTICS (count up when visible)
  ------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stats__number');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));
  }


  /* -------------------------------------------------------------
     8. SKILL BAR ANIMATION (fills + counts up % when visible)
  ------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  if ('IntersectionObserver' in window && skillBars.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const fill = bar.querySelector('.skill-bar__fill');
          const percentLabel = bar.querySelector('.skill-bar__percent');
          const target = parseInt(fill?.getAttribute('data-fill'), 10) || 0;

          if (fill) fill.style.width = target + '%';

          if (percentLabel) {
            const duration = 1200;
            const start = performance.now();
            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              percentLabel.textContent = Math.round(progress * target) + '%';
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }


  /* -------------------------------------------------------------
     9. PROJECT CATEGORY FILTERING
  ------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        card.classList.toggle('filtered-out', !shouldShow);
      });
    });
  });


  /* -------------------------------------------------------------
     10. CONTACT FORM (validation + Netlify Forms submit)
  ------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    input?.closest('.form-group')?.classList.toggle('error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    if (name.length < 2) {
      showFieldError('name', 'Please enter your name.');
      isValid = false;
    } else {
      showFieldError('name', '');
    }

    if (!isValidEmail(email)) {
      showFieldError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      showFieldError('email', '');
    }

    if (subject.length < 2) {
      showFieldError('subject', 'Please add a subject.');
      isValid = false;
    } else {
      showFieldError('subject', '');
    }

    if (message.length < 10) {
      showFieldError('message', 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      showFieldError('message', '');
    }

    if (!formStatus) return;

    if (!isValid) {
      formStatus.textContent = 'Please fix the fields highlighted above.';
      formStatus.className = 'form-status error';
      return;
    }

    // Send the message to Netlify Forms (the form carries data-netlify="true").
    // Netlify captures the submission and notifies the site owner by email.
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    formStatus.textContent = 'Sending your message...';
    formStatus.className = 'form-status';

    const body = new URLSearchParams(new FormData(form));
    body.set('form-name', 'contact');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then((response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      formStatus.textContent = `Thanks, ${name.split(' ')[0]}! Your message has been sent — I'll get back to you soon.`;
      formStatus.className = 'form-status success';
      form.reset();
    }).catch(() => {
      formStatus.textContent = 'Sorry, something went wrong — please email me directly at salauddiny16@gmail.com.';
      formStatus.className = 'form-status error';
    }).finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
  });


  /* -------------------------------------------------------------
     11. BACK TO TOP BUTTON
  ------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
// ================================
// CUSTOM CURSOR
// ================================

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;

let outlineX = 0;
let outlineY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();
