/* Cato Use Case Library — shared behaviour (no dependencies, file:// safe) */
(function () {
  "use strict";

  var CAT = window.UC_CATALOG || [];

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var STATUS = {
    ready: { cls: "badge-ready", label: "Field-ready" },
    wip:   { cls: "badge-wip",   label: "In development" },
    new:   { cls: "badge-new",   label: "New" }
  };
  function catSlug(c) { return c.toLowerCase().replace(/\s+/g, "-"); }
  function catChipClass(c) { return "chip chip-cat-" + catSlug(c); }

  /* ---------- index page: render + filter cards ---------- */
  function initIndex() {
    var grid = $("#uc-sections");
    if (!grid) return;

    var searchBox = $("#uc-search");
    var state = { q: "", cat: "All", vert: "All" };
    var CATS = ["Access", "Management", "Network", "Security", "AI Security", "Migration"];

    function matches(uc) {
      if (state.cat !== "All" && uc.category !== state.cat) return false;
      if (state.vert !== "All" && uc.vertical !== state.vert) return false;
      if (!state.q) return true;
      var hay = (uc.title + " " + uc.summary + " " + uc.tags.join(" ") + " " + uc.category + " " + (uc.vertical || "") + " " + ((window.UC_SEARCH && window.UC_SEARCH[uc.id]) || "")).toLowerCase();
      return state.q.toLowerCase().split(/\s+/).every(function (t) { return hay.indexOf(t) !== -1; });
    }

    function cardHTML(uc) {
      var st = STATUS[uc.status] || STATUS.ready;
      return '<a class="uc-card" href="' + esc(uc.file) + '">' +
        '<div class="uc-top"><span class="' + catChipClass(uc.category) + '">' + esc(uc.category) + "</span>" +
        '<span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
        "<h3>" + esc(uc.title) + "</h3>" +
        "<p>" + esc(uc.summary) + "</p>" +
        '<div class="uc-tags">' + (uc.vertical ? '<span class="tag tag-vert">' + esc(uc.vertical) + "</span>" : "") +
        uc.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
        '<span class="uc-cta">Open use case →</span></a>';
    }

    function render() {
      var shown = CAT.filter(matches);
      var html = "";
      CATS.forEach(function (cat) {
        var items = shown.filter(function (u) { return u.category === cat; });
        if (!items.length) return;
        html += '<div class="category-h"><h2 id="cat-' + catSlug(cat) + '">' + cat + " use cases</h2>" +
                '<span class="cat-count">' + items.length + " of " +
                CAT.filter(function (u) { return u.category === cat; }).length + "</span></div>" +
                '<div class="uc-grid">' + items.map(cardHTML).join("") + "</div>";
      });
      if (!shown.length) {
        html = '<div class="card" style="text-align:center;color:var(--ink-2)">No use cases match “' +
               esc(state.q) + '”. Try a different term or clear the filters.</div>';
      }
      grid.innerHTML = html;
      var rc = $("#result-count");
      if (rc) rc.textContent = shown.length + " of " + CAT.length + " use cases";
    }

    if (searchBox) searchBox.addEventListener("input", function () { state.q = this.value.trim(); render(); });
    // clickable tags: filter the library by the clicked tag instead of opening the card
    grid.addEventListener("click", function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains("tag")) return;
      e.preventDefault();
      e.stopPropagation();
      state.q = t.textContent.trim();
      if (searchBox) searchBox.value = state.q;
      render();
      if (searchBox) searchBox.focus();
    });
    $$(".filter-btn[data-cat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".filter-btn[data-cat]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        state.cat = btn.getAttribute("data-cat");
        render();
      });
    });
    // vertical filter row, built from catalog entries that declare a vertical
    var vbar = $("#vertical-bar");
    if (vbar) {
      var verts = [];
      CAT.forEach(function (u) { if (u.vertical && verts.indexOf(u.vertical) === -1) verts.push(u.vertical); });
      verts.sort();
      vbar.innerHTML = '<span class="vert-label">Vertical:</span>' +
        ['All'].concat(verts).map(function (v) {
          return '<button class="filter-btn' + (v === 'All' ? ' active' : '') + '" data-vert="' + esc(v) + '">' + esc(v) + '</button>';
        }).join("");
      $$(".filter-btn[data-vert]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          $$(".filter-btn[data-vert]").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          state.vert = btn.getAttribute("data-vert");
          render();
        });
      });
    }
    render();
  }

  /* ---------- use-case pages: TOC, scroll-spy, pager ---------- */
  function initPage() {
    var body = document.body;
    var pageId = body.getAttribute("data-uc");
    if (!pageId) return;

    // Build TOC from h2[id]
    var toc = $("#toc-links");
    var heads = $$("section[id] > h2, h2[id]").map(function (h) {
      return h.closest("section[id]") || h;
    });
    var sections = $$("main section[id]");
    if (toc && sections.length) {
      toc.innerHTML = sections.map(function (s) {
        var h = $("h2", s);
        return h ? '<a href="#' + s.id + '" data-t="' + s.id + '">' + esc(h.textContent) + "</a>" : "";
      }).join("");
      if ("IntersectionObserver" in window) {
        var links = {};
        $$("a[data-t]", toc).forEach(function (a) { links[a.getAttribute("data-t")] = a; });
        var current = null;
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              if (current) current.classList.remove("active");
              current = links[e.target.id];
              if (current) current.classList.add("active");
            }
          });
        }, { rootMargin: "-15% 0px -70% 0px" });
        sections.forEach(function (s) { io.observe(s); });
      }
    }

    // Prev / next pager from catalog order
    var pager = $("#pager");
    if (pager && CAT.length) {
      var idx = CAT.findIndex(function (u) { return u.id === pageId; });
      if (idx !== -1) {
        var prev = CAT[(idx - 1 + CAT.length) % CAT.length];
        var next = CAT[(idx + 1) % CAT.length];
        pager.innerHTML =
          '<a class="prev" href="../' + esc(prev.file) + '"><div class="dir">← Previous</div><div class="pt">' + esc(prev.title) + "</div></a>" +
          '<a class="next" href="../' + esc(next.file) + '"><div class="dir">Next →</div><div class="pt">' + esc(next.title) + "</div></a>";
      }
    }
  }

  /* ---------- lightbox for screenshots and diagrams ---------- */
  function initLightbox() {
    var shots = $$("figure.shot img");
    var diagrams = $$(".diagram-card");
    if (!shots.length && !diagrams.length) return;
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", "Enlarged view — click or press Escape to close");
    var stage = document.createElement("div");
    stage.className = "lightbox-stage";
    lb.appendChild(stage);
    document.body.appendChild(lb);
    function close() { lb.classList.remove("open"); stage.innerHTML = ""; }
    function open(node) { stage.innerHTML = ""; stage.appendChild(node); lb.classList.add("open"); }
    shots.forEach(function (s) {
      s.addEventListener("click", function () {
        var img = document.createElement("img");
        img.src = s.src;
        img.alt = s.alt || "";
        open(img);
      });
    });
    diagrams.forEach(function (d) {
      if (!d.querySelector("svg")) return;
      if (d.querySelector(".phase-player") || d.closest(".phase-player")) return; // interactive: not a lightbox target
      d.classList.add("zoomable");
      d.setAttribute("title", "Click to enlarge");
      d.addEventListener("click", function () {
        var clone = d.cloneNode(true);
        clone.classList.remove("reveal", "zoomable");
        clone.classList.add("in");
        clone.removeAttribute("title");
        // duplicate ids from the page would be invalid — the dialog carries its own label
        clone.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
        clone.querySelectorAll("[aria-labelledby]").forEach(function (el) { el.removeAttribute("aria-labelledby"); });
        open(clone);
      });
    });
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- reveal-on-scroll ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- dark-mode toggle (head snippet applies the saved theme pre-paint) ---------- */
  function initTheme() {
    var inner = $(".topnav-inner");
    if (!inner) return;
    var root = document.documentElement;
    function isDark() { return root.getAttribute("data-theme") === "dark"; }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    function paint() {
      btn.textContent = isDark() ? "☀︎" : "☾";
      btn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
      btn.title = btn.getAttribute("aria-label");
    }
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("uc-theme", next); } catch (e) {}
      paint();
    });
    paint();
    var spacer = $(".spacer", inner);
    if (spacer) inner.insertBefore(btn, spacer.nextSibling);
    else inner.appendChild(btn);
  }

  /* ---------- phased migration player ---------- */
  function initPhasePlayers() {
    var players = $$(".phase-player");
    if (!players.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    players.forEach(function (pl) {
      var phases = $$(".phase", pl);
      if (phases.length < 2) return;
      pl.classList.add("ready");
      pl.setAttribute("tabindex", "0");
      pl.setAttribute("role", "group");
      pl.setAttribute("aria-roledescription", "phased walkthrough");
      var i = 0, timer = null;
      var autoMs = parseInt(pl.getAttribute("data-autoplay") || "0", 10);
      var caption = pl.querySelector(".phase-caption");
      var steps = pl.querySelector(".phase-steps");
      var dots = [];
      function capOf(ph) {
        var fc = ph.querySelector("figcaption");
        return ph.getAttribute("data-caption") || (fc ? fc.textContent : "");
      }
      phases.forEach(function (ph, idx) {
        var title = ph.getAttribute("data-title") || ("Phase " + idx);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "phase-dot";
        b.setAttribute("aria-label", title);
        b.innerHTML = '<span class="phase-dot-n">' + idx + "</span><span class=\"phase-dot-t\">" + esc(title) + "</span>";
        b.addEventListener("click", function () { stop(); show(idx); updatePlay(); });
        if (steps) steps.appendChild(b);
        dots.push(b);
      });
      function show(n) {
        i = (n + phases.length) % phases.length;
        phases.forEach(function (ph, idx) { ph.classList.toggle("active", idx === i); });
        dots.forEach(function (d, idx) {
          d.classList.toggle("active", idx === i);
          d.setAttribute("aria-current", idx === i ? "step" : "false");
        });
        if (caption) caption.textContent = capOf(phases[i]);
      }
      function next() { show(i + 1); }
      function prev() { show(i - 1); }
      function start() { if (timer || !autoMs || reduce) return; timer = setInterval(next, autoMs); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function updatePlay() {
        if (!pp) return;
        pp.textContent = timer ? "❚❚" : "▶";
        pp.setAttribute("aria-label", timer ? "Pause" : "Play walkthrough");
      }
      // controls sit inside a .diagram-card on some pages — don't let clicks bubble to a zoom handler
      pl.addEventListener("click", function (e) { if (e.target.closest(".phase-nav, .phase-dot")) e.stopPropagation(); });
      var pv = pl.querySelector(".phase-prev"),
          nx = pl.querySelector(".phase-next"),
          pp = pl.querySelector(".phase-play");
      if (pv) pv.addEventListener("click", function () { stop(); prev(); updatePlay(); });
      if (nx) nx.addEventListener("click", function () { stop(); next(); updatePlay(); });
      if (pp) { if (reduce) { pp.style.display = "none"; } else pp.addEventListener("click", function () { if (timer) stop(); else start(); updatePlay(); }); }
      pl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { stop(); next(); updatePlay(); e.preventDefault(); }
        else if (e.key === "ArrowLeft") { stop(); prev(); updatePlay(); e.preventDefault(); }
      });
      show(0);
      if (autoMs && !reduce && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) { if (en.isIntersecting) start(); else stop(); updatePlay(); });
        }, { threshold: 0.4 });
        io.observe(pl);
      }
      updatePlay();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initIndex();
    initPage();
    initLightbox();
    initReveal();
    initPhasePlayers();
  });
})();
