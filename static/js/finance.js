/* ══════════════════════════════════════════════════════════════
   Yirviel Somé — Finance Portfolio
   static/js/finance.js

   Place this file at: static/js/finance.js
   Then add to hugo.toml under [params]:
       customJS = ['js/finance.js']
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Live-style ticker bar ───────────────────────────── */
  function buildTicker() {
    const items = [
      { label: 'Python',        value: 'Quant Stack',   dir: 'up'   },
      { label: 'Black–Scholes', value: 'Options',       dir: 'up'   },
      { label: 'Monte Carlo',   value: 'VaR · CVaR',    dir: 'up'   },
      { label: 'Markowitz',     value: 'Efficient Frontier', dir: 'up' },
      { label: 'Fixed Income',  value: 'Yield Curves',  dir: 'up'   },
      { label: 'NumPy · Pandas',value: 'Data Stack',    dir: 'up'   },
      { label: 'Risk Modeling', value: 'Derivatives',   dir: 'up'   },
      { label: 'MSc Finance',   value: '2025',          dir: 'up'   },
      { label: 'Portfolio Opt.', value: 'Sharpe Ratio', dir: 'up'   },
    ];

    // duplicate for seamless loop
    const allItems = [...items, ...items];

    const wrap = document.createElement('div');
    wrap.className = 'ticker-wrap';

    const track = document.createElement('div');
    track.className = 'ticker-track';

    allItems.forEach(({ label, value, dir }) => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.innerHTML = `<span class="ticker-label">${label}</span> <span class="${dir}">${dir === 'up' ? '▲' : '▼'} ${value}</span>`;
      track.appendChild(el);
    });

    wrap.appendChild(track);

    // Insert right after the header
    const header = document.querySelector('header.header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(wrap, header.nextSibling);
    }
  }

  /* ── 2. Stats row below profile ─────────────────────────── */
  function buildStats() {
    const profile = document.querySelector('.profile');
    if (!profile) return;

    const stats = [
      { label: 'Specialisation',  value: 'Derivatives & Risk',     sub: 'Options · Monte Carlo · VaR' },
      { label: 'Primary Stack',   value: 'Python · Excel',          sub: 'Pandas · NumPy · Matplotlib' },
      { label: 'Status',          value: 'Open to roles',           sub: 'MSc 2025 · Paris & International' },
    ];

    const row = document.createElement('div');
    row.className = 'stats-row';

    stats.forEach(({ label, value, sub }) => {
      const cell = document.createElement('div');
      cell.className = 'stat-cell';
      cell.innerHTML = `
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        <div class="stat-sub">${sub}</div>
      `;
      row.appendChild(cell);
    });

    profile.insertAdjacentElement('afterend', row);
  }

  /* ── 3. Scroll-reveal animations ───────────────────────── */
  function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(18px);
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll('.post-entry, .stat-cell, .profile');
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.06}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
  }

  /* ── 4. Section label above post list ──────────────────── */
  function buildSectionLabel() {
    const firstEntry = document.querySelector('.post-entry');
    if (!firstEntry) return;
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'Selected Projects';
    firstEntry.parentNode.insertBefore(label, firstEntry);
  }

  /* ── 5. Typing effect on profile subtitle ───────────────── */
  function typeSubtitle() {
    const subtitle = document.querySelector('.profile p');
    if (!subtitle) return;
    const text = subtitle.textContent.trim();
    subtitle.textContent = '';
    subtitle.style.borderLeft = '2px solid var(--gold-dim)';
    subtitle.style.paddingLeft = '1rem';

    let i = 0;
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = 'color:var(--gold);animation:blink 1s step-end infinite;margin-left:1px;';
    subtitle.appendChild(cursor);

    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(blinkStyle);

    // Only run if page just loaded (not on back-nav)
    const type = () => {
      if (i < text.length) {
        subtitle.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 22);
      } else {
        // Remove cursor after done
        setTimeout(() => cursor.remove(), 800);
      }
    };

    setTimeout(type, 600);
  }

  /* ── 6. Card glow on mouse position ─────────────────────── */
  function initCardGlow() {
    document.querySelectorAll('.post-entry').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });

    const glowStyle = document.createElement('style');
    glowStyle.textContent = `
      .post-entry::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
          200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          rgba(59,130,246,0.06),
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      .post-entry:hover::after { opacity: 1; }
    `;
    document.head.appendChild(glowStyle);
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    buildTicker();
    buildStats();
    buildSectionLabel();
    initScrollReveal();
    typeSubtitle();
    initCardGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
