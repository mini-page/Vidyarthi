/* ============================================
   Vidyarthi Digital Library – Premium Scripts
   Apple / Linear / Stripe quality interactions
   ============================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ==========================================
  // 1. LOADING SCREEN
  // ==========================================
  const loadingScreen = document.querySelector('.loading-screen');

  function hideLoadingScreen() {
    if (!loadingScreen) return;
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
    requestAnimationFrame(() => {
      const pageContent = document.querySelector('.page-content');
      if (pageContent) pageContent.classList.add('visible');
    });
  }

  if (loadingScreen) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => setTimeout(hideLoadingScreen, 1200));
    setTimeout(hideLoadingScreen, 2500);
  } else {
    window.addEventListener('load', () => {
      const pc = document.querySelector('.page-content');
      if (pc) pc.classList.add('visible');
    });
  }

  // ==========================================
  // 2. SCROLL PROGRESS
  // ==========================================
  const scrollProgress = document.querySelector('.scroll-progress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress.style.transform = `scaleX(${p || 0})`;
  }

  // ==========================================
  // 3. FLOATING PILL NAV – TAB SWITCHING
  // ==========================================
  const pillItems = document.querySelectorAll('.nav-pill-item');
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  pillItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }

    item.addEventListener('click', (e) => {
      pillItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ==========================================
  // 4. TOP BAR + NAVBAR SHRINK (on scroll)
  // ==========================================
  const topBar = document.querySelector('.top-bar');
  const navbar = document.querySelector('.navbar');
  let scrollTimer = null;
  let lastScrollY = 0;
  let scrollingDown = false;

  function updateScrollEffects() {
    const y = window.scrollY;
    scrollingDown = y > lastScrollY && y > 80;
    lastScrollY = y;

    // Top bar: visible after 300px, shrunk when scrolling down, expanded when stopped/scrolling up
    if (topBar) {
      topBar.classList.toggle('visible', y > 300);
      if (scrollingDown && y > 400) {
        topBar.classList.add('shrunk');
      } else {
        topBar.classList.remove('shrunk');
      }
    }

    // Navbar: shrunk when scrolling down, expanded when stopped or scrolling up
    if (navbar) {
      if (scrollingDown && y > 200) {
        navbar.classList.add('shrunk');
      } else {
        navbar.classList.remove('shrunk');
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        navbar.classList.remove('shrunk');
      }, 800); // expand 800ms after scroll stops
    }
  }

  // ==========================================
  // 5. SCROLL-TRIGGERED REVEALS (all types)
  // ==========================================
  const revealSelector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur, .reveal-pop';

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll(revealSelector).forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll(revealSelector).forEach(el => el.classList.add('visible'));
  }

  // ==========================================
  // 7. ANIMATED COUNTERS
  // ==========================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = prefersReducedMotion ? 0 : 1800;
    const start = performance.now();

    function ease(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(ease(p) * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }

    requestAnimationFrame(tick);
  }

  // ==========================================
  // 8. CUSTOM CURSOR GLOW (Desktop)
  // ==========================================
  if (!isMobile && !isTouch) {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      let mx = 0, my = 0, gx = 0, gy = 0;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.classList.add('active'); });
      document.addEventListener('mouseleave', () => glow.classList.remove('active'));
      (function anim() {
        gx += (mx - gx) * 0.12;
        gy += (my - gy) * 0.12;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(anim);
      })();
    }
  }

  // ==========================================
  // 9. MAGNETIC BUTTONS (Desktop)
  // ==========================================
  if (!isMobile && !isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.12}px, ${(e.clientY - r.top - r.height/2) * 0.12}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ==========================================
  // 10. CARD TILT (Desktop)
  // ==========================================
  if (!isMobile && !isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .value-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(800px) rotateX(${(0.5-y)*5}deg) rotateY(${(x-0.5)*5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ==========================================
  // 11. FAQ ACCORDION
  // ==========================================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const wasOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('open');
        f.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!wasOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 12. GALLERY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach((item, i) => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.transition = `opacity 0.3s ease ${i*0.04}s, transform 0.3s ease ${i*0.04}s`;
          if (match) {
            item.style.display = '';
            requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  // ==========================================
  // 13. CONTACT FORM → WhatsApp
  // ==========================================
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;

      const name = fd.get('name') || '';
      const phone = fd.get('phone') || '';
      const goal = fd.get('goal') || 'Not specified';
      const message = fd.get('message') || '';

      const text = `Hi Vidyarthi! 👋\n\nI want to book a seat.\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n🎯 Goal: ${goal}\n💬 Message: ${message}`;
      const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;

      btn.innerHTML = '✓ Opening WhatsApp...';
      btn.style.background = 'linear-gradient(135deg, #10B981, #34D399)';

      setTimeout(() => {
        window.open(url, '_blank');
        btn.innerHTML = orig;
        btn.style.background = '';
        form.reset();
      }, 1200);
    });
  }

  // ==========================================
  // 15. HERO WORD-BY-WORD REVEAL
  // ==========================================
  const h1 = document.querySelector('.hero-text h1');
  if (h1 && !prefersReducedMotion) {
    const words = [];
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'word';
            span.style.animationDelay = (0.2 + Math.random() * 0.3) + 's';
            span.textContent = part;
            frag.appendChild(span);
          } else {
            frag.appendChild(document.createTextNode(part));
          }
        });
        node.parentNode.replaceChild(frag, node);
      }
    }
    h1.classList.add('hero-word-reveal');
  }

  // ==========================================
  // 16. SMOOTH ANCHOR SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 17. SCROLL HANDLER (throttled)
  // ==========================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateScrollEffects();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ==========================================
  // 18. YEAR + INITIAL
  // ==========================================
  const y = document.getElementById('currentYear');
  if (y) y.textContent = new Date().getFullYear();
  updateScrollProgress();
  updateScrollEffects();

})();
