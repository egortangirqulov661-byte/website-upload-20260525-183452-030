(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('.menu-toggle');
    var mobileNav = qs('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slides = qsa('.hero-slide');
        if (!slides.length) {
            return;
        }

        var dots = qsa('.hero-dot');
        var prev = qs('.hero-prev');
        var next = qs('.hero-next');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-target-slide')) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                startTimer();
            });
        }

        startTimer();
    }

    function initFilters() {
        var scopes = qsa('.filter-scope');
        scopes.forEach(function (scope) {
            var section = scope.closest('section') || document;
            var input = qs('.card-search', section);
            var select = qs('.year-filter', section);
            var tagButtons = qsa('.tag-filter', section);
            var activeTag = '';

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var year = select ? select.value : '';
                qsa('.movie-card', scope).forEach(function (card) {
                    var text = [
                        card.getAttribute('data-title') || '',
                        card.getAttribute('data-genre') || '',
                        card.getAttribute('data-tags') || '',
                        card.getAttribute('data-year') || ''
                    ].join(' ').toLowerCase();
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchYear = !year || card.getAttribute('data-year') === year;
                    var matchTag = !activeTag || text.indexOf(activeTag.toLowerCase()) !== -1;
                    card.classList.toggle('is-hidden', !(matchQuery && matchYear && matchTag));
                });
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            if (select) {
                select.addEventListener('change', apply);
            }

            tagButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    activeTag = button.getAttribute('data-tag') || '';
                    tagButtons.forEach(function (item) {
                        item.classList.toggle('is-active', item === button);
                    });
                    apply();
                });
            });

            var params = new URLSearchParams(window.location.search);
            var initial = params.get('q');
            if (initial && input && input.classList.contains('global-search')) {
                input.value = initial;
                apply();
            }
        });
    }

    function attachStream(frame, autoplay) {
        var video = qs('video', frame);
        if (!video) {
            return;
        }

        var url = frame.getAttribute('data-video');
        if (!url) {
            return;
        }

        function play() {
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
            frame.classList.add('is-playing');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.src !== url) {
                video.src = url;
            }
            if (autoplay) {
                play();
            }
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!frame.hlsInstance) {
                frame.hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                frame.hlsInstance.loadSource(url);
                frame.hlsInstance.attachMedia(video);
            }
            if (autoplay) {
                play();
            }
            return;
        }

        video.src = url;
        if (autoplay) {
            play();
        }
    }

    function initPlayers() {
        qsa('.player-frame').forEach(function (frame) {
            var overlay = qs('.player-overlay', frame);
            var video = qs('video', frame);

            attachStream(frame, false);

            if (overlay) {
                overlay.addEventListener('click', function () {
                    attachStream(frame, true);
                });
            }

            if (video) {
                video.addEventListener('play', function () {
                    frame.classList.add('is-playing');
                });
            }
        });
    }

    initHero();
    initFilters();
    initPlayers();
})();
