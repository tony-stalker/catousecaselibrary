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
  // Status model: "New" is derived from catalog `added` (first commit, YYYY-MM-DD) for the
  // first NEW_DAYS days, then the badge falls back to the entry's field status. A legacy
  // status of "new" (pages predating `added`) counts as ready once it has aged out.
  var NEW_DAYS = 90;
  function ageDays(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    var t = Date.parse(iso + "T00:00:00Z");
    if (isNaN(t)) return null;
    return Math.floor((Date.now() - t) / 86400000);
  }
  function isNew(uc) {
    var age = ageDays(uc.added);
    if (age === null) return uc.status === "new";
    return age <= NEW_DAYS;
  }
  function statusOf(uc) {
    if (isNew(uc)) return STATUS.new;
    return STATUS[uc.status === "new" ? "ready" : uc.status] || STATUS.ready;
  }
  window.UC_STATUS = { of: statusOf, isNew: isNew, newDays: NEW_DAYS };
  function catSlug(c) { return c.toLowerCase().replace(/\s+/g, "-"); }
  function catChipClass(c) { return "chip chip-cat-" + catSlug(c); }

  /* ---------- index page: render + filter cards ----------
     URL contract (A12): the index mirrors its filter state into the query string with
     history.replaceState — index.html?q=«text»&cat=«Category»&vert=«Vertical» — restores it on
     load and on popstate, and honours #cat-«slug» (the topnav / breadcrumb anchors) as the
     category filter plus a scroll to that heading. index.html?focus=search focuses the search
     box (used by the "/" shortcut on use-case pages). Empty values are omitted from the URL. */
  function initIndex() {
    var grid = $("#uc-sections");
    if (!grid) return;

    var searchBox = $("#uc-search");
    var state = { q: "", cat: "All", vert: "All" };
    var CATS = ["Access", "Management", "Network", "Security", "AI Security", "Migration", "Platform Demo"];
    function catFromSlug(slug) {
      for (var i = 0; i < CATS.length; i++) if (catSlug(CATS[i]) === slug) return CATS[i];
      return null;
    }

    /* ---- search v2 (A11): tokenised, prefix-matched, scored ----
       Query → tokens (same [a-z0-9-] grammar as build-search.py). Each token is a prefix match
       against the words of a field; a page matches when EVERY token hits in some field. Score =
       title ×6 + tags ×4 + summary ×2 + category/vertical ×2 + body ×1 (body = the sorted word
       list in search-index.js, binary-searched). window.UC_SYNONYMS (search-synonyms.js) expands a
       token or phrase to its group; synonym hits count at half weight so the typed word wins. */
    var WEIGHTS = { title: 6, tags: 4, summary: 2, cat: 2, body: 1 };
    var FIELD_LABEL = { title: "title", tags: "tags", summary: "summary", cat: "category", body: "page text" };
    var FIELD_ORDER = ["title", "tags", "summary", "cat", "body"];
    function tokens(s) {
      var out = [];
      String(s || "").toLowerCase().replace(/[a-z0-9][a-z0-9-]*/g, function (w) {
        w = w.replace(/^-+|-+$/g, "");
        if (w) out.push(w);
        return w;
      });
      return out;
    }
    // field words for title/tags/summary carry a hyphen-stripped twin so "sdwan" prefix-matches "SD-WAN"
    function fieldWords(s) {
      var ws = tokens(s), out = ws.slice();
      ws.forEach(function (w) { if (w.indexOf("-") !== -1) out.push(w.replace(/-/g, "")); });
      return out;
    }
    var fieldCache = {};
    function fieldsOf(uc) {
      var f = fieldCache[uc.id];
      if (f) return f;
      f = fieldCache[uc.id] = {
        title: fieldWords(uc.title),
        tags: fieldWords(uc.tags.join(" ")),
        summary: fieldWords(uc.summary),
        cat: fieldWords(uc.category + " " + (uc.vertical || "")),
        tagsExact: uc.tags.map(function (t) { return tokens(t).join(" "); })
      };
      return f;
    }
    var bodyCache = {};
    function bodyWords(id) {   // read UC_SEARCH lazily — it may be loaded after app.js
      if (bodyCache[id]) return bodyCache[id];
      var src = window.UC_SEARCH && window.UC_SEARCH[id];
      if (!src) return null;
      var arr = src.split(" ");
      for (var i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) { arr.sort(); break; }
      return (bodyCache[id] = arr);
    }
    function prefixInSorted(arr, t) {   // binary search for the first word >= t, then check the prefix
      var lo = 0, hi = arr.length;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (arr[mid] < t) lo = mid + 1; else hi = mid; }
      return lo < arr.length && arr[lo].slice(0, t.length) === t;
    }
    function prefixIn(list, t) {
      for (var i = 0; i < list.length; i++) if (list[i].slice(0, t.length) === t) return true;
      return false;
    }

    // synonym groups → phrase map (every key and term points at its group's full term list)
    var SYN = {}, SYN_PHRASES = [];
    (function () {
      var groups = window.UC_SYNONYMS || {};
      Object.keys(groups).forEach(function (key) {
        var terms = [key].concat(groups[key] || []).map(function (t) { return tokens(t).join(" "); })
          .filter(function (t, i, a) { return t && a.indexOf(t) === i; });
        terms.forEach(function (t) {
          var mine = SYN[t] || (SYN[t] = []);
          terms.forEach(function (x) { if (x !== t && mine.indexOf(x) === -1) mine.push(x); });
          if (t.indexOf(" ") !== -1 && SYN_PHRASES.indexOf(t) === -1) SYN_PHRASES.push(t);
        });
      });
      SYN_PHRASES.sort(function (a, b) { return b.split(" ").length - a.split(" ").length || b.length - a.length; });
    })();
    // query → [{words:[...], alts:[{words:[...], syn:true}]}] — multi-word synonym phrases in the
    // query collapse to one token so "zero trust" is a single requirement, not two common words
    function parseQuery(q) {
      var ws = tokens(q), joined = " " + ws.join(" ") + " ", found = [];
      SYN_PHRASES.forEach(function (p) {
        var at = joined.indexOf(" " + p + " ");
        if (at === -1) return;
        found.push(p);
        joined = joined.slice(0, at + 1) + "\u0000".repeat(p.length) + joined.slice(at + 1 + p.length);
      });
      var out = [];
      found.forEach(function (p) { out.push(mkToken(p.split(" "), p)); });
      joined.split(" ").forEach(function (w) { if (w && w.indexOf("\u0000") === -1) out.push(mkToken([w], w)); });
      return out;
    }
    function mkToken(words, key) {
      var alts = [{ words: words, syn: false }];
      var stripped = words.join("").replace(/-/g, "");
      if (words.length === 1 && words[0].indexOf("-") !== -1 && stripped) alts.push({ words: [stripped], syn: false });
      (SYN[key] || []).forEach(function (t) { alts.push({ words: t.split(" "), syn: true }); });
      return { words: words, alts: alts };
    }
    // one word against one page: which fields prefix-match it
    function wordFields(uc, w) {
      var f = fieldsOf(uc), hit = {};
      if (prefixIn(f.title, w)) hit.title = true;
      if (prefixIn(f.tags, w)) hit.tags = true;
      if (prefixIn(f.summary, w)) hit.summary = true;
      if (prefixIn(f.cat, w)) hit.cat = true;
      var body = bodyWords(uc.id);
      if (body && prefixInSorted(body, w)) hit.body = true;
      return hit;
    }
    // score a page against the parsed query; null when a token finds nothing
    function scorePage(uc, parsed) {
      var total = 0, fields = {}, hlWords = [];
      for (var i = 0; i < parsed.length; i++) {
        var best = 0, bestFields = null, bestWords = null;
        parsed[i].alts.forEach(function (alt) {
          var perField = null, any = true;
          alt.words.forEach(function (w) {
            var h = wordFields(uc, w);
            if (!Object.keys(h).length) any = false;
            if (perField === null) perField = h;
            else FIELD_ORDER.forEach(function (k) { if (!h[k]) delete perField[k]; });
          });
          if (!any || !perField) return;
          var s = 0;
          FIELD_ORDER.forEach(function (k) { if (perField[k]) s += WEIGHTS[k]; });
          if (!s) { s = 0.5; perField = { body: true }; } // words hit, but in different fields each
          if (alt.syn) s *= 0.5;
          if (s > best) { best = s; bestFields = perField; bestWords = alt.words; }
        });
        if (!best) return null;
        total += best;
        FIELD_ORDER.forEach(function (k) { if (bestFields[k]) fields[k] = true; });
        hlWords = hlWords.concat(bestWords);
      }
      // exact tag facet: the query (as typed, e.g. a clicked card tag) equals one of the page's tags
      var qn = parsed.map(function (t) { return t.words.join(" "); }).join(" ");
      if (fieldsOf(uc).tagsExact.indexOf(qn) !== -1) total += 4;
      return { score: total, fields: fields, words: hlWords };
    }
    var scoreCache = { q: null, map: {} };
    function hitsFor(q) {   // every page's hit record for q (cached per query string)
      if (scoreCache.q === q) return scoreCache.map;
      var parsed = parseQuery(q), map = {};
      if (parsed.length) CAT.forEach(function (uc) { var r = scorePage(uc, parsed); if (r) map[uc.id] = r; });
      else CAT.forEach(function (uc) { map[uc.id] = { score: 0, fields: {}, words: [] }; });
      scoreCache = { q: q, map: map };
      return map;
    }
    function facetOk(uc, cat, vert) {
      if (cat !== "All" && uc.category !== cat) return false;
      if (vert !== "All" && uc.vertical !== vert) return false;
      return true;
    }
    function matches(uc) {
      if (!facetOk(uc, state.cat, state.vert)) return false;
      if (!state.q) return true;
      return !!hitsFor(state.q)[uc.id];
    }
    // <mark> the matched words (whole word, case-insensitive) in an escaped text
    function hl(text, words) {
      var s = esc(text);
      if (!words || !words.length) return s;
      var uniq = words.filter(function (w, i, a) { return w && a.indexOf(w) === i; })
        .sort(function (a, b) { return b.length - a.length; })
        .map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
      var re = new RegExp("(^|[^a-z0-9])((?:" + uniq.join("|") + ")[a-z0-9-]*)", "gi");
      return s.replace(re, function (m, pre, word) { return pre + "<mark>" + word + "</mark>"; });
    }
    function tagHit(tag, words) {
      var tw = fieldWords(tag);
      return words.some(function (w) { return prefixIn(tw, w); });
    }

    function cardHTML(uc, hit) {
      var st = statusOf(uc), words = hit ? hit.words : null;
      var matchedIn = "";
      if (hit && hit.fields) {
        var list = FIELD_ORDER.filter(function (k) { return hit.fields[k]; }).map(function (k) { return FIELD_LABEL[k]; });
        if (list.length) matchedIn = '<span class="uc-matched">matched in: ' + list.join(" · ") + "</span>";
      }
      return '<a class="uc-card" href="' + esc(uc.file) + '">' +
        '<div class="uc-top"><span class="' + catChipClass(uc.category) + '">' + esc(uc.category) + "</span>" +
        '<span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
        "<h3>" + (words ? hl(uc.title, words) : esc(uc.title)) + "</h3>" +
        "<p>" + (words ? hl(uc.summary, words) : esc(uc.summary)) + "</p>" +
        '<div class="uc-tags">' + (uc.vertical ? '<span class="tag tag-vert">' + esc(uc.vertical) + "</span>" : "") +
        uc.tags.map(function (t) {
          var on = words && tagHit(t, words);
          return '<span class="tag' + (on ? " tag-hit" : "") + '">' + esc(t) + "</span>";
        }).join("") + "</div>" +
        matchedIn +
        '<span class="uc-cta">Open use case →</span></a>';
    }
    // six most-used catalog tags, for the empty state
    function popularTags(n) {
      var freq = {};
      CAT.forEach(function (u) { u.tags.forEach(function (t) { freq[t] = (freq[t] || 0) + 1; }); });
      return Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); }).slice(0, n);
    }

    /* search box: clear button (wraps the input when index.html has no .search-wrap yet) */
    var clearBtn = null;
    if (searchBox) {
      var wrap = searchBox.closest(".search-wrap");
      if (!wrap) {
        wrap = document.createElement("span");
        wrap.className = "search-wrap";
        searchBox.parentNode.insertBefore(wrap, searchBox);
        wrap.appendChild(searchBox);
      }
      clearBtn = $(".search-clear", wrap);
      if (!clearBtn) {
        clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "search-clear";
        clearBtn.setAttribute("aria-label", "Clear search");
        clearBtn.title = "Clear search (Esc)";
        clearBtn.innerHTML = "&times;";
        wrap.appendChild(clearBtn);
      }
      clearBtn.addEventListener("click", function () {
        state.q = "";
        searchBox.value = "";
        render();
        syncUrl();
        searchBox.focus();
      });
      searchBox.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && searchBox.value) {
          e.preventDefault();
          e.stopPropagation(); // the lightbox listens for Escape on document
          state.q = "";
          searchBox.value = "";
          render();
          syncUrl();
        }
      });
    }

    // per-button result counts while a query is active: how many hits that button would show
    // (query ∧ the other facet). Rendered as a trailing <span class="btn-count">, removed when q is empty.
    function paintCounts() {
      var hits = state.q ? hitsFor(state.q) : null;
      function setCount(b, n) {
        var c = $(".btn-count", b);
        if (n === null) { if (c) c.parentNode.removeChild(c); return; }
        if (!c) { c = document.createElement("span"); c.className = "btn-count"; b.appendChild(c); }
        c.textContent = n;
        b.classList.toggle("is-empty", n === 0);
      }
      $$(".filter-btn[data-cat]").forEach(function (b) {
        var cat = b.getAttribute("data-cat");
        setCount(b, hits ? CAT.filter(function (u) { return hits[u.id] && facetOk(u, cat, state.vert); }).length : null);
      });
      $$(".filter-btn[data-vert]").forEach(function (b) {
        var v = b.getAttribute("data-vert");
        setCount(b, hits ? CAT.filter(function (u) { return hits[u.id] && facetOk(u, state.cat, v); }).length : null);
      });
    }
    function paintButtons() {
      $$(".filter-btn[data-cat]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-cat") === state.cat); });
      $$(".filter-btn[data-vert]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-vert") === state.vert); });
      if (searchBox && searchBox.value.trim() !== state.q) searchBox.value = state.q;
      if (clearBtn) clearBtn.hidden = !state.q;
      paintCounts();
    }
    function emptyHTML() {
      var filters = [];
      if (state.cat !== "All") filters.push(state.cat);
      if (state.vert !== "All") filters.push(state.vert);
      var what = state.q ? "match “" + esc(state.q) + "”" : "are tagged " + esc(filters.join(" + "));
      if (state.q && filters.length) what += " in " + esc(filters.join(" + "));
      return '<div class="card uc-empty"><p>No use cases ' + what + ". Try a shorter word, a different spelling, or clear the filters.</p>" +
        '<p class="uc-empty-label">Popular tags</p><div class="uc-tags">' +
        popularTags(6).map(function (t) { return '<button type="button" class="tag">' + esc(t) + "</button>"; }).join("") +
        "</div></div>";
    }

    function render() {
      paintButtons();
      var shown = CAT.filter(matches);
      var html = "";
      if (state.q) {
        // one flat list ranked by score (ties keep catalog order); the category chip on each card
        // replaces the per-category headings, so the best title match is always first
        var hits = hitsFor(state.q);
        var ranked = shown.map(function (u, i) { return { u: u, i: i, s: hits[u.id].score }; })
          .sort(function (a, b) { return b.s - a.s || a.i - b.i; });
        if (ranked.length) {
          html = '<div class="category-h"><h2 id="search-results">Best matches</h2>' +
                 '<span class="cat-count">' + ranked.length + " for “" + esc(state.q) + "”" +
                 (state.cat !== "All" ? " in " + esc(state.cat) : "") +
                 (state.vert !== "All" ? " · " + esc(state.vert) : "") + "</span></div>" +
                 '<div class="uc-grid uc-results">' + ranked.map(function (r) { return cardHTML(r.u, hits[r.u.id]); }).join("") + "</div>";
        }
      } else {
        CATS.forEach(function (cat) {
          var items = shown.filter(function (u) { return u.category === cat; });
          if (!items.length) return;
          html += '<div class="category-h"><h2 id="cat-' + catSlug(cat) + '">' + cat + " use cases</h2>" +
                  '<span class="cat-count">' + items.length + " of " +
                  CAT.filter(function (u) { return u.category === cat; }).length + "</span></div>" +
                  '<div class="uc-grid">' + items.map(function (u) { return cardHTML(u, null); }).join("") + "</div>";
        });
      }
      if (!shown.length) html = emptyHTML();
      grid.innerHTML = html;
      var rc = $("#result-count");
      if (rc) rc.textContent = shown.length + " of " + CAT.length + " use cases" + (state.q ? ", ranked by relevance" : "");
      // deck-export.js (stripped from the prospect build) re-injects its card buttons on this
      document.dispatchEvent(new CustomEvent("uc:cards-rendered"));
    }

    /* ---- URL state ---- */
    var canHistory = !!(window.history && history.replaceState);
    function syncUrl() {
      if (!canHistory) return;
      var parts = [];
      if (state.q) parts.push("q=" + encodeURIComponent(state.q));
      if (state.cat !== "All") parts.push("cat=" + encodeURIComponent(state.cat));
      if (state.vert !== "All") parts.push("vert=" + encodeURIComponent(state.vert));
      var url = location.pathname + (parts.length ? "?" + parts.join("&") : "");
      // keep a non-category hash (e.g. #deck-builder); a #cat- hash is now expressed as ?cat=
      if (location.hash && !/^#cat-/.test(location.hash)) url += location.hash;
      if (url !== location.pathname + location.search + location.hash) {
        try { history.replaceState(history.state, "", url); } catch (e) {}
      }
    }
    function readUrl() {
      var p = {};
      location.search.replace(/^\?/, "").split("&").forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf("="), k = decodeURIComponent(i === -1 ? kv : kv.slice(0, i));
        try { p[k] = decodeURIComponent((i === -1 ? "" : kv.slice(i + 1)).replace(/\+/g, " ")); } catch (e) { p[k] = ""; }
      });
      var next = { q: (p.q || "").trim(), cat: "All", vert: "All", scrollCat: null, focus: p.focus === "search" };
      if (p.cat && CATS.indexOf(p.cat) !== -1) next.cat = p.cat;
      else if (p.cat) { var bySlug = catFromSlug(catSlug(p.cat)); if (bySlug) next.cat = bySlug; }
      var m = /^#cat-([a-z0-9-]+)$/.exec(location.hash || "");
      if (m) { var fromHash = catFromSlug(m[1]); if (fromHash) { next.cat = fromHash; next.scrollCat = fromHash; } }
      if (p.vert) {
        var known = CAT.some(function (u) { return u.vertical === p.vert; });
        if (known) next.vert = p.vert;
      }
      return next;
    }
    function scrollToCat(cat) {
      var h = document.getElementById("cat-" + catSlug(cat));
      if (h && h.scrollIntoView) h.scrollIntoView({ block: "start" });
    }
    function applyUrl(scroll) {
      var next = readUrl();
      state.q = next.q; state.cat = next.cat; state.vert = next.vert;
      render();
      if (scroll && next.scrollCat) scrollToCat(next.scrollCat);
      if (next.focus && searchBox) {
        searchBox.focus();
        if (searchBox.scrollIntoView) searchBox.scrollIntoView({ block: "center" });
      }
      syncUrl(); // normalises #cat-… → ?cat=… and drops ?focus=search
    }

    if (searchBox) searchBox.addEventListener("input", function () { state.q = this.value.trim(); render(); syncUrl(); });
    // clickable tags: filter the library by the clicked tag instead of opening the card
    grid.addEventListener("click", function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains("tag")) return;
      e.preventDefault();
      e.stopPropagation();
      state.q = t.textContent.trim();
      if (searchBox) searchBox.value = state.q;
      render();
      syncUrl();
      if (searchBox) searchBox.focus();
    });
    $$(".filter-btn[data-cat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.cat = btn.getAttribute("data-cat");
        render();
        syncUrl();
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
          state.vert = btn.getAttribute("data-vert");
          render();
          syncUrl();
        });
      });
    }
    // topnav "#cat-…" links (same-document hash navigation) select that category and scroll to it
    // (browsers fire popstate alongside hashchange — coalesce so the grid renders once)
    var pendingApply = null;
    function scheduleApply() {
      if (pendingApply) return;
      pendingApply = setTimeout(function () { pendingApply = null; applyUrl(true); }, 0);
    }
    window.addEventListener("hashchange", scheduleApply);
    // back/forward between states this page wrote (or a hash the user navigated through)
    window.addEventListener("popstate", scheduleApply);
    applyUrl(true);
  }

  /* ---------- "/" focuses search ----------
     On index the shortcut focuses #uc-search; elsewhere it jumps to index.html?focus=search
     (the brand link in .topnav already carries the right relative path to index). Ignored while
     typing in a field or with a modifier held. */
  function initSlashShortcut() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      var t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
      var box = $("#uc-search");
      if (box) {
        e.preventDefault();
        box.focus();
        if (box.select) box.select();
        if (box.scrollIntoView) box.scrollIntoView({ block: "center" });
        return;
      }
      var brand = $(".topnav a.brand");
      var href = brand ? brand.getAttribute("href") : null;
      if (!href || !/index\.html$/.test(href)) return;
      e.preventDefault();
      location.href = href + "?focus=search";
    });
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

    // Hero status badge: the HTML carries the authored badge as a fallback; once the catalog
    // entry has aged past the "New" window, swap a badge-new span for the field status badge.
    var me = null;
    for (var i = 0; i < CAT.length; i++) if (CAT[i].id === pageId) { me = CAT[i]; break; }
    if (me) {
      var heroBadge = $(".hero .badge.badge-new");
      if (heroBadge && !isNew(me)) {
        var st = statusOf(me);
        heroBadge.className = "badge " + st.cls;
        heroBadge.textContent = st.label;
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

  /* ---------- platform facts (assets/js/platform-facts.js — single source) ----------
     Any element carrying data-fact="«key»" (HTML or SVG <text>/<tspan>) has its text replaced
     with window.UC_FACTS[key]; the authored text stays as the no-JS fallback. No-op when the
     facts file is not loaded (pages predating the include) or a key is unknown. */
  function initFacts() {
    var F = window.UC_FACTS;
    if (!F) return;
    $$("[data-fact]").forEach(function (el) {
      var v = F[el.getAttribute("data-fact")];
      if (typeof v === "string" && el.textContent !== v) el.textContent = v;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFacts();
    initTheme();
    initFeedback();
    initIndex();
    initSlashShortcut();
    initPage();
    initRunbookTabs();
    initCapturePlaceholders();
    initLightbox();
    initReveal();
    initPhasePlayers();
  });
})();
