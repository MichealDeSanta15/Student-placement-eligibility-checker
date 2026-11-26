document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");

    function openTab(name) {
        tabs.forEach(function (tab) {
            tab.classList.toggle("active", tab.getAttribute("data-tab") === name);
        });
        panels.forEach(function (panel) {
            panel.classList.toggle("active", panel.id === name);
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            openTab(tab.getAttribute("data-tab"));
        });
    });

    var stats = document.querySelectorAll(".stat-num");
    stats.forEach(function (el) {
        var raw = el.getAttribute("data-value");
        var target = parseFloat(raw);
        if (isNaN(target)) {
            return;
        }
        var isDecimal = raw.indexOf(".") !== -1;
        var shown = 0;
        var timer = setInterval(function () {
            shown = shown + target / 25;
            if (shown >= target) {
                clearInterval(timer);
                el.textContent = isDecimal ? target.toFixed(2) : target;
            } else {
                el.textContent = isDecimal ? shown.toFixed(2) : Math.round(shown);
            }
        }, 28);
    });

    var search = document.getElementById("search");
    var clear = document.getElementById("clearSearch");
    var rows = document.querySelectorAll("#studentTable tbody tr");

    function filterRows() {
        var text = search.value.toLowerCase().trim();
        rows.forEach(function (row) {
            var match = row.textContent.toLowerCase().indexOf(text) !== -1;
            row.classList.toggle("hide", !match);
        });
    }

    if (search) {
        search.addEventListener("input", filterRows);
    }

    if (clear) {
        clear.addEventListener("click", function () {
            search.value = "";
            filterRows();
            search.focus();
        });
    }

    var topBtn = document.getElementById("topBtn");
    if (topBtn) {
        window.addEventListener("scroll", function () {
            topBtn.classList.toggle("show", window.scrollY > 240);
        });
        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    var message = document.querySelector(".msg");
    if (message) {
        setTimeout(function () {
            message.style.transition = "opacity 0.5s";
            message.style.opacity = "0";
            setTimeout(function () {
                message.style.display = "none";
            }, 500);
        }, 4000);
    }
});
