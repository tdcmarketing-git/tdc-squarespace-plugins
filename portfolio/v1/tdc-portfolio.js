/* ================================================================
   TDC Portfolio Plugin v1.0
   Fetches Squarespace portfolio JSON and renders hero/list/grid
   Usage: <div class="tdc-portfolio" data-source="/commercial"
          data-layout="hero" data-limit="6" data-sort="manual"></div>
   ================================================================ */
(function () {
  'use strict';

  var VERSION = '1.0.0';
  var AUTOPLAY_MS = 6000;
  var cache = new Map();

  /* ---- FETCH & NORMALIZE ---- */
  async function fetchPortfolio(sourcePath) {
    if (cache.has(sourcePath)) return cache.get(sourcePath);

    var url = sourcePath.replace(/\/$/, '') + '?format=json';
    var res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);

    var data = await res.json();
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('No items array in response');
    }

    var items = data.items.map(function (it) {
      return {
        title: it.title || 'Untitled',
        url: it.fullUrl || '#',
        image: it.assetUrl || '',
        excerpt: (it.excerpt || '').replace(/<[^>]*>/g, '').trim(),
        publishOn: it.publishOn || it.addedOn || 0,
        displayIndex: typeof it.displayIndex === 'number' ? it.displayIndex : 999
      };
    });

    cache.set(sourcePath, items);
    return items;
  }

  /* ---- SORT & LIMIT ---- */
  function prepareItems(items, sort, limit) {
    var sorted = items.slice();
    if (sort === 'newest') sorted.sort(function (a, b) { return b.publishOn - a.publishOn; });
    else if (sort === 'oldest') sorted.sort(function (a, b) { return a.publishOn - b.publishOn; });
    else sorted.sort(function (a, b) { return a.displayIndex - b.displayIndex; });
    return limit > 0 ? sorted.slice(0, limit) : sorted;
  }

  /* ---- ESCAPE ---- */
  function esc(s) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(s).replace(/[&<>"']/g, function (c) { return map[c]; });
  }

  /* ---- HERO LAYOUT ---- */
  function renderHero(container, items, opts) {
    if (!items.length) { container.innerHTML = ''; return; }

    var slidesHtml = items.map(function (it, i) {
      return '<div class="tdc-hero-slide' + (i === 0 ? ' active' : '') + '" ' +
        'style="background-image:url(\'' + esc(it.image) + '\')">' +
        '<div class="tdc-hero-content">' +
        '<h2 class="tdc-hero-title">' + esc(it.title) + '</h2>' +
        '<p class="tdc-hero-excerpt">' + esc(it.excerpt) + '</p>' +
        '<a href="' + esc(it.url) + '" class="tdc-hero-btn">View Project</a>' +
        '</div></div>';
    }).join('');

    var dotsHtml = '';
    if (items.length > 1) {
      dotsHtml = '<div class="tdc-hero-dots">' +
        items.map(function (_, i) {
          return '<button class="tdc-hero-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
        }).join('') + '</div>';
    }

    var arrowsHtml = '';
    if (items.length > 1) {
      arrowsHtml = '<button class="tdc-hero-arrow prev" aria-label="Previous">&#8249;</button>' +
        '<button class="tdc-hero-arrow next" aria-label="Next">&#8250;</button>' +
        '<div class="tdc-hero-progress"><div class="tdc-hero-progress-bar"></div></div>';
    }

    container.innerHTML = '<div class="tdc-hero">' + slidesHtml + arrowsHtml + dotsHtml + '</div>';

    if (items.length < 2) return;

    var hero = container.querySelector('.tdc-hero');
    var slides = hero.querySelectorAll('.tdc-hero-slide');
    var dots = hero.querySelectorAll('.tdc-hero-dot');
    var bar = hero.querySelector('.tdc-hero-progress-bar');
    var idx = 0, timer, progressTimer, startTime;

    function go(newIdx) {
      slides[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
      idx = (newIdx + slides.length) % slides.length;
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      restart();
    }

    function tick() {
      var elapsed = Date.now() - startTime;
      var pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (bar) bar.style.width = pct + '%';
    }

    function restart() {
      clearInterval(progressTimer);
      clearTimeout(timer);
      startTime = Date.now();
      if (bar) bar.style.width = '0%';
      progressTimer = setInterval(tick, 50);
      timer = setTimeout(function () { go(idx + 1); }, AUTOPLAY_MS);
    }

    hero.querySelector('.prev').addEventListener('click', function () { go(idx - 1); });
    hero.querySelector('.next').addEventListener('click', function () { go(idx + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.dataset.idx)); });
    });

    hero.addEventListener('mouseenter', function () {
      clearInterval(progressTimer);
      clearTimeout(timer);
    });
    hero.addEventListener('mouseleave', restart);

    restart();
  }

  /* ---- LIST LAYOUT ---- */
  function renderList(container, items) {
    container.innerHTML = '<div class="tdc-list">' +
      items.map(function (it) {
        return '<a href="' + esc(it.url) + '" class="tdc-list-item">' +
          '<div class="tdc-list-img" style="background-image:url(\'' + esc(it.image) + '\')"></div>' +
          '<div class="tdc-list-content">' +
          '<h3 class="tdc-list-title">' + esc(it.title) + '</h3>' +
          '<p class="tdc-list-excerpt">' + esc(it.excerpt) + '</p>' +
          '<span class="tdc-list-link">View Project &rarr;</span>' +
          '</div></a>';
      }).join('') + '</div>';
  }

  /* ---- GRID LAYOUT ---- */
  function renderGrid(container, items, cols) {
    container.innerHTML = '<div class="tdc-grid" style="--tdc-cols:' + cols + '">' +
      items.map(function (it) {
        return '<a href="' + esc(it.url) + '" class="tdc-grid-item">' +
          '<div class="tdc-grid-img" style="background-image:url(\'' + esc(it.image) + '\')"></div>' +
          '<div class="tdc-grid-overlay">' +
          '<h3 class="tdc-grid-title">' + esc(it.title) + '</h3>' +
          '</div></a>';
      }).join('') + '</div>';
  }

  /* ---- INIT ONE BLOCK ---- */
  async function initBlock(el) {
    var source = el.dataset.source;
    var layout = (el.dataset.layout || 'hero').toLowerCase();
    var limit = parseInt(el.dataset.limit) || 0;
    var sort = (el.dataset.sort || 'manual').toLowerCase();
    var cols = parseInt(el.dataset.columns) || 3;

    if (!source) {
      el.innerHTML = '<div class="tdc-portfolio-error">Missing data-source attribute.</div>';
      return;
    }

    el.innerHTML = '<div class="tdc-portfolio-loading">Loading&hellip;</div>';

    try {
      var items = await fetchPortfolio(source);
      var prepared = prepareItems(items, sort, limit);

      if (layout === 'list') renderList(el, prepared);
      else if (layout === 'grid') renderGrid(el, prepared, cols);
      else renderHero(el, prepared);
    } catch (err) {
      console.error('[TDC Portfolio]', err);
      el.innerHTML = '<div class="tdc-portfolio-error">Unable to load portfolio: ' + esc(err.message) + '</div>';
    }
  }

  /* ---- BOOT ---- */
  function boot() {
    document.querySelectorAll('.tdc-portfolio:not([data-tdc-init])').forEach(function (el) {
      el.setAttribute('data-tdc-init', '1');
      initBlock(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-scan on Squarespace AJAX navigation
  window.addEventListener('mercury:load', boot);

  console.log('[TDC Portfolio] v' + VERSION + ' loaded');
})();
