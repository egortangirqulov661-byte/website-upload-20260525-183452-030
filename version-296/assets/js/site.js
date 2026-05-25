(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-nav]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      menu.classList.toggle('is-open');
    });
  }

  const slides = [...document.querySelectorAll('[data-hero-slide]')];
  const dots = [...document.querySelectorAll('[data-hero-dot]')];
  let currentSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  if (slides.length > 1) {
    setInterval(() => showSlide(currentSlide + 1), 5200);
  }

  const searchInput = document.querySelector('[data-search-input]');
  const filterSelects = [...document.querySelectorAll('[data-filter-select]')];
  const cards = [...document.querySelectorAll('.movie-card')];

  const filterCards = () => {
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    const selectTerms = filterSelects.map((select) => select.value.trim().toLowerCase()).filter(Boolean);

    cards.forEach((card) => {
      const haystack = `${card.dataset.title || ''} ${card.dataset.meta || ''}`.toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesSelects = selectTerms.every((term) => haystack.includes(term));
      card.classList.toggle('is-hidden', !(matchesSearch && matchesSelects));
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  filterSelects.forEach((select) => {
    select.addEventListener('change', filterCards);
  });

  const loadHls = () => new Promise((resolve, reject) => {
    if (window.Hls) {
      resolve(window.Hls);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
    script.onload = () => resolve(window.Hls);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const playerShell = document.querySelector('[data-player-shell]');
  const video = document.querySelector('#player');
  const playButton = document.querySelector('[data-play-button]');
  let playerReady = false;

  const startPlayer = async () => {
    if (!video || !playerShell) return;
    const streamUrl = video.dataset.stream;
    if (!streamUrl) return;

    try {
      if (!playerReady) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else {
          const Hls = await loadHls();
          if (Hls && Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
          } else {
            video.src = streamUrl;
          }
        }
        playerReady = true;
      }

      playerShell.classList.add('is-playing');
      await video.play();
    } catch (error) {
      playerShell.classList.remove('is-playing');
    }
  };

  if (playButton) {
    playButton.addEventListener('click', startPlayer);
  }

  if (video) {
    video.addEventListener('click', () => {
      if (video.paused) {
        startPlayer();
      }
    });

    video.addEventListener('play', () => {
      playerShell?.classList.add('is-playing');
    });
  }
})();
