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
    var CATS = ["Access", "Management", "Network", "Security", "AI Security", "Migration", "Platform Demo"];

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
      // deck-export.js (stripped from the prospect build) re-injects its card buttons on this
      document.dispatchEvent(new CustomEvent("uc:cards-rendered"));
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

  /* ---------- runbook tabs: Demo / PoV ---------- */
  function initRunbookTabs() {
    var demo = $("section#demo"), pov = $("section#pov");
    if (!demo || !pov) return;
    var bar = document.createElement("div");
    bar.className = "rb-tabs";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", "Runbooks");
    var tabs = [
      { id: "demo", label: "🎬 Demo runbook", sec: demo },
      { id: "pov", label: "🧪 PoV runbook", sec: pov }
    ];
    var btns = {};
    function activate(id) {
      tabs.forEach(function (t) {
        var on = t.id === id;
        t.sec.classList.toggle("rb-hidden", !on);
        if (on) t.sec.classList.add("in"); // reveal-on-scroll never fires for a hidden panel
        btns[t.id].classList.toggle("active", on);
        btns[t.id].setAttribute("aria-selected", on ? "true" : "false");
        btns[t.id].setAttribute("tabindex", on ? "0" : "-1");
      });
    }
    tabs.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rb-tab";
      b.setAttribute("role", "tab");
      b.textContent = t.label;
      b.addEventListener("click", function () { activate(t.id); });
      bar.appendChild(b);
      btns[t.id] = b;
    });
    demo.parentNode.insertBefore(bar, demo);
    // TOC links and in-page anchors switch to the right tab before the browser scrolls
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href="#demo"], a[href="#pov"]');
      if (a) activate(a.getAttribute("href").slice(1));
    });
    window.addEventListener("hashchange", function () {
      if (location.hash === "#pov") activate("pov");
      else if (location.hash === "#demo") activate("demo");
    });
    activate(location.hash === "#pov" ? "pov" : "demo");
  }

  /* ---------- capture placeholders ----------
     Every <!-- capture-wanted: «CMA Area → Screen — what it shows» --> marker (the
     shopping list in _extract/CAPTURE-LIST.md) is rendered as a clearly labelled,
     illustrative mock console in its place until the real capture is embedded.
     Markers are removed by build-prospect.py, so prospects never see these. */
  var PH_SECTIONS = ["Home", "Monitor", "Network", "Security", "Access", "Assets", "Resources", "Administration", "Account", "AI Security"];
  function phHash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
  function phParse(raw) {
    var t = raw.replace(/^[\s«"]+|[\s»"]+$/g, "").replace(/^CMA\s+/i, "");
    var parts = t.split(/\s+[—–-]\s+/);
    var path = parts.length > 1 ? parts[0] : "", detail = parts.length > 1 ? parts.slice(1).join(" — ") : t;
    var segs = path.split(/\s*(?:→|->|>)\s*/).filter(Boolean);
    var kind = /^Cato Client|^Client\b|device —|^Cato Client device/i.test(t) ? "client" : /console|terminal|nslookup|S3|SIEM|Sentinel|Splunk/i.test(path || t) && !segs.length ? "external" : "console";
    var section = null;
    PH_SECTIONS.forEach(function (sct) { if (!section && segs.length && segs[0].toLowerCase().indexOf(sct.toLowerCase()) === 0) section = sct; });
    if (!section && !segs.length) { var m = /^(Audit Trail|Events|Posture|Reports|Experience Monitoring|Private Access Policy|Applications Portal|Connection Details|App Connector)/i.exec(t); if (m) segs = [m[1]]; }
    return { kind: kind, section: section, segs: segs, title: segs.length ? segs[segs.length - 1] : (kind === "client" ? "Cato Client" : "Console view"), detail: detail, seed: phHash(t) };
  }
  function phSvg(p) {
    var e = esc, W = 960, H = 540, s = '<svg class="ph" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-hidden="true" focusable="false">';
    s += '<rect class="ph-bg" x="0" y="0" width="' + W + '" height="' + H + '" rx="12"/>';
    if (p.kind === "client") {
      s += '<rect class="ph-desk" x="0" y="0" width="' + W + '" height="' + H + '" rx="12"/>';
      s += '<rect class="ph-win" x="280" y="90" width="400" height="360" rx="14"/>';
      s += '<circle class="ph-ring" cx="480" cy="170" r="34"/><circle class="ph-ring-core" cx="480" cy="170" r="12"/>';
      s += '<text class="ph-h" x="480" y="236" text-anchor="middle">' + e(p.title.slice(0, 32)) + '</text>';
      s += '<text class="ph-s" x="480" y="262" text-anchor="middle">' + e(p.detail.slice(0, 44)) + '</text>';
      s += '<rect class="ph-row" x="320" y="290" width="320" height="14" rx="7"/><rect class="ph-row" x="320" y="314" width="260" height="14" rx="7"/><rect class="ph-row" x="320" y="338" width="290" height="14" rx="7"/>';
      s += '<rect class="ph-btn" x="380" y="390" width="200" height="34" rx="17"/>';
    } else {
      /* top bar + sidebar + content */
      s += '<rect class="ph-top" x="0" y="0" width="' + W + '" height="48"/>';
      s += '<circle class="ph-logo" cx="34" cy="24" r="10"/><rect class="ph-top-t" x="56" y="17" width="150" height="14" rx="7"/>';
      s += '<rect class="ph-side" x="0" y="48" width="190" height="' + (H - 48) + '"/>';
      var y = 84;
      PH_SECTIONS.slice(0, 8).forEach(function (sct) {
        var on = p.section === sct;
        if (on) s += '<rect class="ph-side-on" x="10" y="' + (y - 18) + '" width="170" height="30" rx="8"/>';
        s += '<text class="ph-nav' + (on ? ' on' : '') + '" x="26" y="' + (y + 3) + '">' + e(sct) + '</text>';
        y += 40;
      });
      var crumb = p.segs.length ? p.segs.join("  ›  ") : (p.kind === "external" ? p.title : "Cato Management Application");
      s += '<text class="ph-crumb" x="222" y="86">' + e(crumb.slice(0, 70)) + '</text>';
      s += '<text class="ph-h" x="222" y="124">' + e(p.title.slice(0, 48)) + '</text>';
      s += '<text class="ph-s" x="222" y="150">' + e(p.detail.slice(0, 92)) + '</text>';
      var widgets = 2 + (p.seed % 2), wx = 222, ww = Math.floor((W - 222 - 30 - (widgets - 1) * 16) / widgets);
      for (var i = 0; i < widgets; i++) {
        var x = wx + i * (ww + 16);
        s += '<rect class="ph-card" x="' + x + '" y="176" width="' + ww + '" height="96" rx="10"/>';
        s += '<rect class="ph-row" x="' + (x + 16) + '" y="194" width="' + Math.round(ww * 0.4) + '" height="12" rx="6"/>';
        s += '<rect class="ph-val" x="' + (x + 16) + '" y="218" width="' + Math.round(ww * 0.28) + '" height="22" rx="6"/>';
        s += '<path class="ph-spark" d="M' + (x + 16) + ' 258 l' + Math.round(ww * 0.2) + ' -10 l' + Math.round(ww * 0.2) + ' 6 l' + Math.round(ww * 0.2) + ' -16 l' + Math.round(ww * 0.25) + ' 8"/>';
      }
      var rows = 4 + (p.seed % 4), ry = 296;
      s += '<rect class="ph-card" x="222" y="' + (ry - 10) + '" width="' + (W - 252) + '" height="' + (rows * 30 + 44) + '" rx="10"/>';
      s += '<rect class="ph-head" x="238" y="' + (ry + 4) + '" width="' + (W - 284) + '" height="22" rx="6"/>';
      for (var r = 0; r < rows; r++) {
        var yy = ry + 40 + r * 30, w1 = 120 + ((p.seed >>> (r + 2)) % 90), w2 = 80 + ((p.seed >>> (r + 5)) % 140);
        s += '<rect class="ph-row" x="238" y="' + yy + '" width="' + w1 + '" height="12" rx="6"/>';
        s += '<rect class="ph-row" x="' + (238 + w1 + 24) + '" y="' + yy + '" width="' + w2 + '" height="12" rx="6"/>';
        s += '<rect class="ph-pill' + ((r + p.seed) % 3 === 0 ? ' warn' : '') + '" x="' + (W - 160) + '" y="' + (yy - 4) + '" width="72" height="20" rx="10"/>';
      }
    }
    return s + '</svg>';
  }
  function initCapturePlaceholders() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT), found = [];
    while (walker.nextNode()) { if (/capture-wanted:/i.test(walker.currentNode.nodeValue)) found.push(walker.currentNode); }
    found.forEach(function (c) {
      var raw = c.nodeValue.replace(/^\s*capture-wanted:\s*/i, "");
      var p = phParse(raw);
      var fig = document.createElement("figure");
      fig.className = "shot shot-placeholder";
      fig.setAttribute("aria-label", "Illustrative mock-up, not a real capture");
      fig.innerHTML = '<div class="ph-frame">' + phSvg(p) + '<span class="ph-badge">Illustrative mock-up · capture pending</span></div>'
        + '<figcaption><strong>Illustrative mock-up</strong> of ' + esc(p.segs.length ? p.segs.join(" → ") : p.title) + ': ' + esc(p.detail) + '. A real console capture will replace this.</figcaption>';
      var host = c.parentNode;
      /* a marker sitting directly inside a list item or paragraph: place the figure after that block */
      var block = host;
      while (block && block !== document.body && /^(LI|P|TD|TH|SPAN|STRONG|EM|A|H[1-6])$/.test(block.tagName)) block = block.parentNode;
      if (block !== host && block && block !== document.body) {
        var inner = c.parentNode; while (inner.parentNode !== block) inner = inner.parentNode;
        if (inner.nextSibling) block.insertBefore(fig, inner.nextSibling); else block.appendChild(fig);
      } else host.insertBefore(fig, c.nextSibling);
    });
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
  /* ---------- feedback: report bug / feedback buttons (hosted mode only) ----------
     Buttons appear only when the library is served over http(s) — a server-side
     endpoint (/api/feedback, see _extract/server.py) records submissions to
     feedback-log.txt in the web root. Name is mandatory so reports are traceable. */
  function initFeedback() {
    if (!/^https?:$/.test(location.protocol)) return;
    var inner = $(".topnav-inner");
    if (!inner) return;
    var spacer = $(".spacer", inner);
    function makeBtn(label, type) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fb-btn";
      b.textContent = label;
      b.addEventListener("click", function () { openDialog(type); });
      return b;
    }
    var bugBtn = makeBtn("🐞 Report bug", "bug");
    var fbBtn = makeBtn("💬 Feedback", "feedback");
    if (spacer && spacer.nextSibling) {
      inner.insertBefore(bugBtn, spacer.nextSibling);
      inner.insertBefore(fbBtn, bugBtn.nextSibling);
    } else {
      inner.appendChild(bugBtn);
      inner.appendChild(fbBtn);
    }
    var overlay = null;
    function openDialog(type) {
      closeDialog();
      overlay = document.createElement("div");
      overlay.className = "fb-overlay";
      var title = type === "bug" ? "Report a bug" : "Send feedback";
      overlay.innerHTML =
        '<form class="fb-dialog" novalidate>' +
        "<h3>" + title + "</h3>" +
        '<label>Your name <span class="fb-req">*</span><br>' +
        '<input class="fb-name" type="text" maxlength="80" autocomplete="name" required></label>' +
        '<label>' + (type === "bug" ? "What went wrong? Include the page and what you expected." : "What should we improve?") +
        ' <span class="fb-req">*</span><br>' +
        '<textarea class="fb-msg" rows="5" maxlength="4000" required></textarea></label>' +
        '<div class="fb-note">Logged with your name, this page (' + location.pathname + ") and a timestamp.</div>" +
        '<div class="fb-actions"><button type="button" class="btn btn-ghost fb-cancel">Cancel</button>' +
        '<button type="submit" class="btn btn-primary">Submit</button></div>' +
        '<div class="fb-status" aria-live="polite"></div>' +
        "</form>";
      document.body.appendChild(overlay);
      var form = $(".fb-dialog", overlay);
      var status = $(".fb-status", overlay);
      $(".fb-cancel", overlay).addEventListener("click", closeDialog);
      overlay.addEventListener("click", function (e) { if (e.target === overlay) closeDialog(); });
      document.addEventListener("keydown", escClose);
      $(".fb-name", overlay).focus();
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = $(".fb-name", overlay).value.trim();
        var msg = $(".fb-msg", overlay).value.trim();
        if (!name) { status.textContent = "Your name is required."; $(".fb-name", overlay).focus(); return; }
        if (!msg) { status.textContent = "Please describe the " + (type === "bug" ? "bug." : "feedback."); $(".fb-msg", overlay).focus(); return; }
        status.textContent = "Sending…";
        fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: type, name: name, message: msg, page: location.pathname })
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.textContent = "Thanks " + name + " — logged.";
          setTimeout(closeDialog, 1200);
        }).catch(function () {
          status.textContent = "Couldn't reach the server — try again, or tell Tony directly.";
        });
      });
    }
    function escClose(e) { if (e.key === "Escape") closeDialog(); }
    function closeDialog() {
      if (overlay) { overlay.remove(); overlay = null; }
      document.removeEventListener("keydown", escClose);
    }
  }

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
    initFeedback();
    initIndex();
    initPage();
    initRunbookTabs();
    initCapturePlaceholders();
    initLightbox();
    initReveal();
    initPhasePlayers();
  });
})();
