function initNavigation() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  if (!toggle || !menu) {
    return;
  }
  toggle.addEventListener('click', function () {
    menu.classList.toggle('open');
  });
}

function initHero() {
  const root = document.querySelector('[data-hero]');
  if (!root) {
    return;
  }
  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const prev = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  let index = 0;
  let timer = null;

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function restart() {
    if (timer) {
      window.clearInterval(timer);
    }
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  if (prev) {
    prev.addEventListener('click', function () {
      show(index - 1);
      restart();
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      restart();
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      show(i);
      restart();
    });
  });
  show(0);
  restart();
}

function initFilters() {
  const forms = Array.from(document.querySelectorAll('[data-filter-form]'));
  forms.forEach(function (form) {
    const input = form.querySelector('[data-filter-input]');
    const list = document.querySelector('[data-filter-list]');
    if (!input || !list) {
      return;
    }
    const cards = Array.from(list.querySelectorAll('.movie-card'));
    function apply() {
      const q = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = ((card.dataset.keywords || '') + ' ' + (card.dataset.title || '') + ' ' + (card.dataset.year || '')).toLowerCase();
        card.classList.toggle('is-filter-hidden', q && !text.includes(q));
      });
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });
    input.addEventListener('input', apply);
  });
}

function initMoviePlayer(streamUrl) {
  const video = document.getElementById('movieVideo');
  const layer = document.getElementById('playLayer');
  if (!video || !streamUrl) {
    return;
  }

  function prepare() {
    if (video.dataset.ready === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.dataset.ready = '1';
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.dataset.ready = '1';
      return;
    }
    video.src = streamUrl;
    video.dataset.ready = '1';
  }

  function start() {
    prepare();
    if (layer) {
      layer.classList.add('is-hidden');
    }
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (layer) {
    layer.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initHero();
  initFilters();
});
