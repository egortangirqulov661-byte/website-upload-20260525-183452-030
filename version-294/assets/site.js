document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var url = new URL(window.location.href);
  var query = url.searchParams.get('q') || '';
  var searchInput = document.querySelector('[data-search-input]');
  var liveFilter = document.querySelector('[data-live-filter]');
  var sortSelect = document.querySelector('[data-sort-select]');
  var grid = document.querySelector('[data-filter-grid]');

  if (searchInput && query) {
    searchInput.value = query;
  }

  if (liveFilter && query) {
    liveFilter.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function getCards() {
    if (!grid) {
      return [];
    }

    return Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
  }

  function applyFilter() {
    var keyword = normalize(liveFilter ? liveFilter.value : query);

    getCards().forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-tags')
      ].join(' '));

      card.classList.toggle('hidden-card', keyword && haystack.indexOf(keyword) === -1);
    });
  }

  function applySort() {
    if (!grid || !sortSelect) {
      return;
    }

    var mode = sortSelect.value;
    var cards = getCards();

    cards.sort(function (a, b) {
      if (mode === 'year') {
        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
      }

      if (mode === 'rating') {
        return Number(b.getAttribute('data-rating')) - Number(a.getAttribute('data-rating'));
      }

      if (mode === 'views') {
        return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
      }

      return 0;
    });

    cards.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  if (liveFilter) {
    liveFilter.addEventListener('input', applyFilter);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      applySort();
      applyFilter();
    });
  }

  if (grid) {
    applySort();
    applyFilter();
  }
});
