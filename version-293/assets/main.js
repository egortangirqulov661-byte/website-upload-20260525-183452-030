(function () {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (navToggle && mobileMenu) {
        navToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll("[data-slide]"));
    let active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === active);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(active + 1);
        }, 5600);
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    const pageSearch = document.querySelector("[data-page-search]");

    if (pageSearch && query) {
        pageSearch.value = query;
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
        const grid = document.querySelector("[data-filter-grid]");
        if (!grid) {
            return;
        }

        const textInput = document.querySelector("[data-page-search]");
        const yearSelect = document.querySelector("[data-filter-year]");
        const regionSelect = document.querySelector("[data-filter-region]");
        const keyword = normalize(textInput ? textInput.value : "");
        const year = yearSelect ? yearSelect.value : "";
        const region = regionSelect ? regionSelect.value : "";
        const items = Array.from(grid.querySelectorAll(".movie-card, .rank-item"));

        items.forEach(function (item) {
            const haystack = normalize(item.getAttribute("data-search"));
            const itemYear = item.getAttribute("data-year") || "";
            const itemRegion = item.getAttribute("data-region") || "";
            const matchText = !keyword || haystack.indexOf(keyword) !== -1;
            const matchYear = !year || itemYear === year;
            const matchRegion = !region || itemRegion === region;
            item.classList.toggle("is-hidden", !(matchText && matchYear && matchRegion));
        });
    }

    document.querySelectorAll("[data-page-search], [data-filter-year], [data-filter-region]").forEach(function (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
    });

    applyFilter();
})();
