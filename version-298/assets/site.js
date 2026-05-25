(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var navLinks = document.querySelector('[data-nav-links]');

    if (menuButton && navLinks) {
      menuButton.addEventListener('click', function() {
        navLinks.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function() {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function() {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function() {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          show(Number(dot.getAttribute('data-hero-dot')) || 0);
          start();
        });
      });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function(scope) {
      var input = scope.querySelector('[data-filter-input]');
      var year = scope.querySelector('[data-filter-year]');
      var region = scope.querySelector('[data-filter-region]');
      var root = scope.parentElement || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var y = year ? year.value : '';
        var r = region ? region.value : '';
        cards.forEach(function(card) {
          var text = card.getAttribute('data-search') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var cardRegion = card.getAttribute('data-region') || '';
          var visible = true;
          if (q && text.indexOf(q) === -1) {
            visible = false;
          }
          if (y && cardYear !== y) {
            visible = false;
          }
          if (r && cardRegion.indexOf(r) === -1) {
            visible = false;
          }
          card.classList.toggle('is-hidden', !visible);
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      if (region) {
        region.addEventListener('change', apply);
      }
    });
  });
})();
