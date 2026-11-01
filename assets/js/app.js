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
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  /* dialog helpers shared by the lightbox and the feedback dialog: Tab stays inside the open
     dialog, the page behind does not scroll (scrollbar gap padded so nothing shifts), and focus
     goes back to whatever opened it. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapTab(box, e) {
    if (e.key !== "Tab") return;
    var f = $$(FOCUSABLE, box).filter(function (el) { return !el.hidden && el.getClientRects().length; });
    if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || !box.contains(a))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !box.contains(a))) { e.preventDefault(); first.focus(); }
  }
  var scrollLocks = 0, savedOverflow = "", savedPad = "";
  function lockScroll() {
    if (scrollLocks++) return;
    var de = document.documentElement, gap = window.innerWidth - de.clientWidth;
    savedOverflow = de.style.overflow;
    savedPad = document.body.style.paddingRight;
    de.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = gap + "px";
  }
  function unlockScroll() {
    if (!scrollLocks || --scrollLocks) return;
    document.documentElement.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPad;
  }
  function restoreFocus(el) {
    if (!el || !el.focus || !document.documentElement.contains(el)) return;
    try { el.focus({ preventScroll: false }); } catch (e) { el.focus(); }
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
      // the card link sits in a cell so the deck builder's + button can be its sibling, not nested inside the link
      return '<div class="uc-cell"><a class="uc-card" href="' + esc(uc.file) + '">' +
        '<div class="uc-top"><span class="' + catChipClass(uc.category) + '">' + esc(uc.category) + "</span>" +
        '<span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
        "<h3>" + (words ? hl(uc.title, words) : esc(uc.title)) + "</h3>" +
        "<p>" + (words ? hl(uc.summary, words) : esc(uc.summary)) + "</p>" +
        '<div class="uc-tags">' + (uc.vertical ? '<span class="tag tag-vert">' + esc(uc.vertical) + "</span>" : "") +
        uc.tags.filter(function (t) {   // the vertical chip already shows a tag that repeats it
          return !uc.vertical || t.toLowerCase() !== uc.vertical.toLowerCase();
        }).map(function (t) {
          var on = words && tagHit(t, words);
          return '<span class="tag' + (on ? " tag-hit" : "") + '">' + esc(t) + "</span>";
        }).join("") + "</div>" +
        matchedIn +
        '<span class="uc-cta">Open use case →</span></a></div>';
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
          // two tiers: pages where the query hits the title, tags, summary or category lead;
          // pages that only mention it in their body text sit in a collapsed group beneath
          var strong = ranked.filter(function (r) { var f = hits[r.u.id].fields; return f.title || f.tags || f.summary || f.cat; });
          var weak = ranked.filter(function (r) { return strong.indexOf(r) === -1; });
          if (!strong.length) { strong = weak; weak = []; }
          html = '<div class="category-h"><h2 id="search-results">Best matches</h2>' +
                 '<span class="cat-count">' + strong.length + " for “" + esc(state.q) + "”" +
                 (state.cat !== "All" ? " in " + esc(state.cat) : "") +
                 (state.vert !== "All" ? " · " + esc(state.vert) : "") + "</span></div>" +
                 '<div class="uc-grid uc-results">' + strong.map(function (r) { return cardHTML(r.u, hits[r.u.id]); }).join("") + "</div>";
          if (weak.length) {
            html += '<details class="uc-more"><summary>Also mentioned on ' + weak.length + " more page" + (weak.length > 1 ? "s" : "") +
                    "</summary>" + '<div class="uc-grid uc-results">' + weak.map(function (r) { return cardHTML(r.u, hits[r.u.id]); }).join("") + "</div></details>";
          }
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
      // deferred: on load, deck-export.js (a later DOMContentLoaded listener) still has to inject
      // the deck builder above the grid, which would push the heading down after we scrolled
      if (scroll && next.scrollCat) { var sc = next.scrollCat; setTimeout(function () { scrollToCat(sc); }, 0); }
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

  /* ---------- index folds: Start here + deck builder (A13) ----------
     <details class="fold" data-fold="«key»"> blocks remember open/closed in localStorage
     ("uc-fold:«key»" = "1"/"0"), written only when the reader clicks the summary. With nothing
     stored a fold is open on the first visit and closed on later ones ("uc-visited"), except the
     deck builder, which stays open while a deck selection exists ("uc-deck-selection", owned by
     deck-export.js). In-page links / hashes that point into a closed fold open it first
     (#start-here, #deck-builder — deck-export scrolls to #deck-builder on "Edit" links). The deck
     fold's summary mirrors the builder's "n selected" count; the fold hides itself when no
     builder was injected (prospect build, or deck-export.js absent). Pre-A13 markup: no-op. */
  function initFolds() {
    var folds = $$("details.fold[data-fold]");
    if (!folds.length) return;
    function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    var visited = get("uc-visited") === "1";
    put("uc-visited", "1");
    var hasSel = false;
    try { var sel = JSON.parse(get("uc-deck-selection") || "null"); hasSel = !!(sel && sel.ids && sel.ids.length); } catch (e) {}
    folds.forEach(function (d) {
      var key = d.getAttribute("data-fold"), saved = get("uc-fold:" + key);
      d.open = saved === "1" ? true : saved === "0" ? false : (!visited || (key === "deck-builder" && hasSel));
      var sum = d.querySelector("summary");
      // the click lands before the native toggle, so the new state is the inverse of the current one
      if (sum) sum.addEventListener("click", function () { put("uc-fold:" + key, d.open ? "0" : "1"); });
    });
    function foldFor(id) {
      if (!id || !/^[\w-]+$/.test(id)) return null;
      var t = document.getElementById(id);
      var d = t ? t.closest("details.fold") : null;
      return d || $('details.fold[data-fold="' + id + '"]');   // #deck-builder exists only after deck-export runs
    }
    function openFor(hash) {
      var d = foldFor(String(hash || "").replace(/^#/, ""));
      if (d && !d.open) d.open = true;   // a navigation, not a preference — not stored
    }
    openFor(location.hash);
    window.addEventListener("hashchange", function () { openFor(location.hash); });
    // same-hash clicks fire no hashchange; open before the default scroll runs
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) openFor(a.getAttribute("href"));
    });

    var deckFold = $("details.fold[data-fold='deck-builder']");
    if (!deckFold) return;
    var out = $(".deck-fold-count", deckFold);
    function mirror() {
      var c = $(".deck-builder .deck-count", deckFold), t = c ? c.textContent : "";
      if (/^0\b/.test(t)) t = "";   // only worth showing once something is picked
      if (out && out.textContent !== t) out.textContent = t;
    }
    // deck-export.js wires the builder in its own DOMContentLoaded listener, after this one
    setTimeout(function () {
      if (!$(".deck-builder", deckFold)) { deckFold.hidden = true; return; }
      mirror();
      if ("MutationObserver" in window) {
        new MutationObserver(mirror).observe($(".deck-builder", deckFold), { subtree: true, childList: true, characterData: true });
      }
    }, 0);
  }

  /* ---------- index: sticky, compact filter dock (A13) ----------
     #filter-dock (search + category row + vertical row + result count) is position: sticky
     under the topnav (--dock-top = the topnav's height while the topnav is itself sticky; on
     phones the index topnav scrolls away and the dock sticks at 0). A zero-height
     .filter-sentinel just above the dock tells us when it is stuck → .is-stuck switches the
     compact single-row layout. --dock-h (compact height) feeds the scroll-margin of the
     category headings. When a filter/search re-renders the grid while stuck, the page scrolls
     back to the top of the results so they are not left above the viewport. */
  function initFilterDock() {
    var dock = $("#filter-dock");
    if (!dock) return;
    var nav = $(".topnav"), root = document.documentElement;
    var sentinel = $(".filter-sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.className = "filter-sentinel";
      sentinel.setAttribute("aria-hidden", "true");
      dock.parentNode.insertBefore(sentinel, dock);
    }
    document.body.classList.add("has-filter-dock");
    var top = 0;
    function isStuck() { return sentinel.getBoundingClientRect().top < top - 1; }
    // compact rows scroll sideways — keep each row's active chip in view (scrollLeft only, never the page)
    function revealActive() {
      $$(".filter-cats, .vertical-bar", dock).forEach(function (strip) {
        var a = $(".filter-btn.active", strip);
        if (!a || strip.scrollWidth <= strip.clientWidth) return;
        var l = a.offsetLeft, r = l + a.offsetWidth;   // the stuck strip is position: relative
        if (l < strip.scrollLeft) strip.scrollLeft = l - 8;
        else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth + 8;
      });
    }
    function check() {
      var stuck = isStuck();
      if (stuck !== dock.classList.contains("is-stuck")) {
        dock.classList.toggle("is-stuck", stuck);
        if (stuck) revealActive();
      }
    }
    // compact height → --dock-h; full − compact → --dock-shrink, added as margin-bottom while
    // stuck so the dock's in-flow footprint never changes (no content jump as it compacts)
    function measure() {
      top = nav && getComputedStyle(nav).position === "sticky" ? nav.offsetHeight : 0;
      root.style.setProperty("--dock-top", top + "px");
      var was = dock.classList.contains("is-stuck");
      dock.classList.remove("is-stuck");
      var full = dock.offsetHeight;
      dock.classList.add("is-stuck");
      var compact = dock.offsetHeight;
      if (!was) dock.classList.remove("is-stuck");
      root.style.setProperty("--dock-h", compact + "px");
      root.style.setProperty("--dock-shrink", Math.max(0, full - compact) + "px");
      check();
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; check(); });
    }, { passive: true });
    var rt = null;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(measure, 100); });
    document.addEventListener("uc:cards-rendered", function () {
      measure();   // per-button counts and the result line change the dock's full height
      if (!dock.classList.contains("is-stuck")) return;
      revealActive();
      // land the first result just under the compact dock (past the in-flow footprint it
      // reserves), but never above the point where the dock would un-stick (+2)
      var py = window.pageYOffset, grid = $("#uc-sections");
      var unstick = sentinel.getBoundingClientRect().top + py - top + 2;
      var y = grid ? Math.max(unstick, grid.getBoundingClientRect().top + py - top - dock.offsetHeight - 12) : unstick;
      if (py > y) window.scrollTo({ top: y, left: 0, behavior: "instant" });   // no smooth glide per keystroke
    });
    measure();
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
        // a stuck filter dock is already on screen — scrolling "to" it would jump to its in-flow spot
        if (box.scrollIntoView && !box.closest(".is-stuck")) box.scrollIntoView({ block: "center" });
        return;
      }
      var brand = $(".topnav a.brand");
      var href = brand ? brand.getAttribute("href") : null;
      if (!href || !/index\.html$/.test(href)) return;
      e.preventDefault();
      location.href = href + "?focus=search";
    });
  }

  /* ---------- use-case pages: TOC, scroll-spy, pager, related, reading aids (A25) ----------
     TOC: built from main > section[id] > h2; the label is h2[data-toc] (or section[data-toc]) when
     authored, else the h2 text, shortened at a word boundary past TOC_MAX chars (full text in the
     link's title). The links sit in a <details class="toc-details"> inside aside.toc: forced open
     (summary inert) above 900px, collapsed into a sticky "On this page · «current»" bar at ≤ 900px.
     Scroll-spy (IntersectionObserver): the first section in document order crossing a band at
     20–35% of the viewport is current; the last current one stays lit while the band is between
     sections, and the final section lights once the page is scrolled to the bottom.
     Pager: category-scoped, no wrap ("n of N in «Category»" links to index.html?cat=…).
     Related strip: up to 4 catalog cards before the footer (see initRelated). */
  var TOC_MAX = 42;
  function tocLabel(sec, h) {
    var short = (h && h.getAttribute("data-toc")) || sec.getAttribute("data-toc");
    var full = (h ? h.textContent : "").replace(/\s+/g, " ").trim();
    if (short) return { text: short, title: full };
    if (full.length <= TOC_MAX) return { text: full, title: "" };
    var cut = full.slice(0, TOC_MAX + 1);
    var sp = cut.lastIndexOf(" ");
    cut = (sp > 20 ? cut.slice(0, sp) : full.slice(0, TOC_MAX)).replace(/[\s,;:·—–&-]+$/, "");
    return { text: cut + "…", title: full };
  }
  function catEntry(pageId) {
    for (var i = 0; i < CAT.length; i++) if (CAT[i].id === pageId) return CAT[i];
    return null;
  }
  function indexHref(params) { return "../index.html" + (params ? "?" + params : ""); }
  function catHref(cat) { return indexHref("cat=" + encodeURIComponent(cat)); }

  function initToc() {
    var toc = $("#toc-links");
    var sections = $$("main section[id]").filter(function (s) { return $("h2", s); });
    if (!toc || !sections.length) return;
    var aside = toc.closest("aside.toc") || toc.parentNode;
    toc.innerHTML = sections.map(function (s) {
      var l = tocLabel(s, $("h2", s));
      return '<a href="#' + esc(s.id) + '" data-t="' + esc(s.id) + '"' + (l.title ? ' title="' + esc(l.title) + '"' : "") + ">" + esc(l.text) + "</a>";
    }).join("");
    var links = {};
    $$("a[data-t]", toc).forEach(function (a) { links[a.getAttribute("data-t")] = a; });

    // wrap the links in a <details>; the authored .toc-title div becomes its summary
    var det = toc.closest("details.toc-details");
    var cur = null;
    if (!det) {
      det = document.createElement("details");
      det.className = "toc-details";
      var sum = document.createElement("summary");
      sum.className = "toc-title";
      var oldTitle = $(".toc-title", aside);
      sum.innerHTML = '<span class="toc-name">' + esc(oldTitle ? oldTitle.textContent.trim() : "On this page") + "</span>" +
        '<span class="toc-current" aria-hidden="true"></span>';
      if (oldTitle && oldTitle.parentNode) oldTitle.parentNode.removeChild(oldTitle);
      det.appendChild(sum);
      toc.parentNode.insertBefore(det, toc);
      det.appendChild(toc);
    }
    cur = $(".toc-current", det);
    var summary = $("summary", det);
    var mq = window.matchMedia ? window.matchMedia("(max-width: 900px)") : null;
    function narrow() { return !!(mq && mq.matches); }
    function applyMode() {
      det.open = !narrow();
      aside.classList.toggle("toc-collapsible", narrow());
    }
    applyMode();
    if (mq) {
      if (mq.addEventListener) mq.addEventListener("change", applyMode);
      else if (mq.addListener) mq.addListener(applyMode);
    }
    summary.addEventListener("click", function (e) { if (!narrow()) e.preventDefault(); });
    if (!narrow()) summary.setAttribute("tabindex", "-1");
    if (mq) {
      var syncTab = function () { if (narrow()) summary.removeAttribute("tabindex"); else summary.setAttribute("tabindex", "-1"); };
      if (mq.addEventListener) mq.addEventListener("change", syncTab); else if (mq.addListener) mq.addListener(syncTab);
    }
    // narrow: picking a link or pressing Esc folds the bar away again
    toc.addEventListener("click", function (e) {
      if (narrow() && e.target.closest && e.target.closest("a[data-t]")) det.open = false;
    });
    det.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && narrow() && det.open) { det.open = false; summary.focus(); }
    });
    // the sticky bar sits under the sticky topnav: expose its height as --toc-top
    var nav = $(".topnav");
    function setTop() {
      var h = 0;
      if (nav) {
        var pos = window.getComputedStyle(nav).position;
        if (pos === "sticky" || pos === "fixed") h = nav.offsetHeight;
      }
      document.documentElement.style.setProperty("--toc-top", h + "px");
    }
    setTop();
    window.addEventListener("resize", setTop);

    var active = null;
    function setActive(id) {
      var a = links[id];
      if (!a || a === active) return;
      if (active) { active.classList.remove("active"); active.removeAttribute("aria-current"); }
      active = a;
      a.classList.add("active");
      a.setAttribute("aria-current", "location");
      if (cur) cur.textContent = a.textContent;
    }
    setActive(sections[0].id);
    if (!("IntersectionObserver" in window)) return;
    var inBand = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { inBand[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < sections.length; i++) {
        if (inBand[sections[i].id]) { setActive(sections[i].id); return; }
      }
    }, { rootMargin: "-20% 0px -65% 0px" });
    sections.forEach(function (s) { io.observe(s); });
    // page bottom: the last visible section may never reach the band
    var foot = document.createElement("div");
    foot.className = "toc-end-sentinel";
    foot.setAttribute("aria-hidden", "true");
    var mainEl = sections[0].closest("main") || sections[0].parentNode;
    mainEl.appendChild(foot);
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getClientRects().length) { setActive(sections[i].id); return; }
      }
    }).observe(foot);
  }

  function initPage() {
    var body = document.body;
    var pageId = body.getAttribute("data-uc");
    if (!pageId) return;

    initToc();

    // Hero status badge: the HTML carries the authored badge as a fallback; once the catalog
    // entry has aged past the "New" window, swap a badge-new span for the field status badge.
    var me = catEntry(pageId);
    if (me) {
      var heroBadge = $(".hero .badge.badge-new");
      if (heroBadge && !isNew(me)) {
        var st = statusOf(me);
        heroBadge.className = "badge " + st.cls;
        heroBadge.textContent = st.label;
      }
    }

    // Prev / next within the page's category, in catalog order — no wrap at the ends
    var pager = $("#pager"), neighbours = {};
    if (pager && me) {
      var peers = CAT.filter(function (u) { return u.category === me.category; });
      var k = peers.indexOf(me);
      var prev = peers[k - 1], next = peers[k + 1];
      if (prev) neighbours[prev.id] = 1;
      if (next) neighbours[next.id] = 1;
      var gap = '<span class="pager-gap" aria-hidden="true"></span>';
      pager.classList.add("pager-cat");
      pager.innerHTML =
        (prev ? '<a class="prev" href="../' + esc(prev.file) + '"><div class="dir">← Previous</div><div class="pt">' + esc(prev.title) + "</div></a>" : gap) +
        '<a class="pager-pos" href="' + esc(catHref(me.category)) + '" title="All ' + esc(me.category) + ' use cases">' +
          '<span class="pp-n">' + (k + 1) + " of " + peers.length + '</span><span class="pp-cat">in ' + esc(me.category) + "</span></a>" +
        (next ? '<a class="next" href="../' + esc(next.file) + '"><div class="dir">Next →</div><div class="pt">' + esc(next.title) + "</div></a>" : gap);
    }
    if (me) initRelated(me, neighbours);
    initReadingAids(me);
  }

  /* ---------- related-pages strip (A25) ----------
     Up to 4 catalog entries, scored: shared tags ×2 + same category ×1 + same vertical ×3; the
     vendor playbook ↔ policy deep-dive pair (migration-x / migration-x-policy) always leads. Pager
     neighbours are skipped (they are linked just above). Platform Demo pages are only suggested
     from other Platform Demo pages. Injected as aside.related-strip before footer.footer. */
  function pairOf(a, b) { return a + "-policy" === b || b + "-policy" === a; }
  function initRelated(me, skip) {
    if ($(".related-strip")) return;
    var myTags = {};
    me.tags.forEach(function (t) { myTags[t.toLowerCase()] = 1; });
    var scored = [];
    CAT.forEach(function (u, i) {
      if (u === me || skip[u.id]) return;
      if (u.category === "Platform Demo" && me.category !== "Platform Demo") return;
      var shared = u.tags.filter(function (t) { return myTags[t.toLowerCase()]; });
      var sc = shared.length * 2 + (u.category === me.category ? 1 : 0) +
        (u.vertical && u.vertical === me.vertical ? 3 : 0) + (pairOf(me.id, u.id) ? 100 : 0);
      if (!shared.length && u.category !== me.category && !pairOf(me.id, u.id)) return;
      scored.push({ u: u, sc: sc, shared: shared, i: i });
    });
    scored.sort(function (a, b) { return b.sc - a.sc || a.i - b.i; });
    var pick = scored.slice(0, 4);
    if (!pick.length) return;
    var peers = CAT.filter(function (u) { return u.category === me.category; }).length;
    var strip = document.createElement("aside");
    strip.className = "related-strip";
    strip.setAttribute("aria-labelledby", "related-h");
    strip.innerHTML =
      '<div class="related-inner">' +
        '<div class="related-head"><div><div class="section-kicker">Keep exploring</div><h2 id="related-h">Related pages</h2></div>' +
        '<a class="related-all" href="' + esc(catHref(me.category)) + '">All ' + peers + " " + esc(me.category) + " use cases →</a></div>" +
        '<div class="related-grid">' + pick.map(function (r) {
          var u = r.u, st = statusOf(u);
          var tags = (r.shared.length ? r.shared : u.tags).slice(0, 3);
          return '<a class="uc-card uc-card-mini" href="../' + esc(u.file) + '">' +
            '<div class="uc-top"><span class="' + catChipClass(u.category) + '">' + esc(u.category) + "</span>" +
            '<span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
            "<h3>" + esc(u.title) + "</h3><p>" + esc(u.summary) + "</p>" +
            '<div class="uc-tags">' + tags.map(function (t) {
              return '<span class="tag' + (myTags[t.toLowerCase()] ? " tag-hit" : "") + '">' + esc(t) + "</span>";
            }).join("") + "</div></a>";
        }).join("") + "</div>" +
      "</div>";
    var footer = $("footer.footer") || $("footer");
    if (footer) footer.parentNode.insertBefore(strip, footer);
    else {
      var main = $(".main") || $("main");
      if (main) main.parentNode.insertBefore(strip, main.nextSibling);
    }
  }

  /* ---------- reading aids + print header (A25) ----------
     .read-progress: 3px bar fixed at the top edge, scaleX = scroll fraction (aria-hidden).
     .to-top: "↑ Top" button, bottom-left, shown once scrolled past 600px; moves focus to the h1.
     .print-header: print-only line "Cato Use Case Library · «Category» · «Title»" with the date
     from its data-printed attribute (refreshed on beforeprint); without JS, CSS prints the library
     name from body::before. beforeprint also makes lazy images eager so they reach the PDF. */
  function initReadingAids(me) {
    var bar = document.createElement("div");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = '<span class="read-progress-fill"></span>';
    document.body.insertBefore(bar, document.body.firstChild);
    var fill = bar.firstChild;

    var top = document.createElement("button");
    top.type = "button";
    top.className = "to-top";
    top.hidden = true;
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<span aria-hidden="true">↑</span> Top';
    document.body.appendChild(top);
    document.body.classList.add("has-reading-aids");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    top.addEventListener("click", function () {
      try { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); } catch (e) { window.scrollTo(0, 0); }
      var h1 = $(".hero h1") || $("h1");
      if (h1) {
        if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
        try { h1.focus({ preventScroll: true }); } catch (e2) { h1.focus(); }
      }
    });

    var ticking = false;
    function update() {
      ticking = false;
      var de = document.documentElement;
      var max = de.scrollHeight - window.innerHeight;
      var y = window.pageYOffset || de.scrollTop || 0;
      var f = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      fill.style.transform = "scaleX(" + f.toFixed(4) + ")";
      var show = y > 600;
      if (top.hidden === show) top.hidden = !show;
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    // print header
    var title = me ? me.title : (($(".hero h1") || {}).textContent || document.title.replace(/\s+—\s+Cato Use Case Library$/, ""));
    var ph = document.createElement("div");
    ph.className = "print-header";
    ph.setAttribute("aria-hidden", "true");
    ph.innerHTML = '<span class="prh-lib">Cato Use Case Library</span>' +
      (me ? '<span class="prh-cat">' + esc(me.category) + "</span>" : "") +
      '<span class="prh-title">' + esc(String(title).trim()) + "</span>";
    function stamp() {
      var d = new Date();
      var s;
      try { s = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
      catch (e) { s = d.toISOString().slice(0, 10); }
      ph.setAttribute("data-printed", "Printed " + s);
    }
    stamp();
    document.body.insertBefore(ph, bar.nextSibling);
    document.body.classList.add("has-print-header");
    window.addEventListener("beforeprint", function () {
      stamp();
      $$('img[loading="lazy"]').forEach(function (img) { img.loading = "eager"; });
    });
  }

  /* ---------- runbook tabs: Demo / PoV ----------
     WAI-ARIA tabs with automatic activation: ArrowLeft/Right cycle, Home/End jump, the active tab
     is the only Tab stop (roving tabindex). The choice is remembered library-wide in
     localStorage["uc-rb-tab"] ("demo" | "pov"); a hash that targets either section, or anything
     inside it, wins over the stored choice. No-JS and print stack both sections. */
  function initRunbookTabs() {
    var demo = $("section#demo"), pov = $("section#pov");
    if (!demo || !pov) return;
    var KEY = "uc-rb-tab";
    var bar = document.createElement("div");
    bar.className = "rb-tabs";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", "Runbooks");
    var tabs = [
      { id: "demo", icon: "🎬", label: "Demo runbook", sec: demo },
      { id: "pov", icon: "🧪", label: "PoV runbook", sec: pov }
    ];
    var btns = {}, current = null;
    function activate(id, opts) {
      opts = opts || {};
      current = id;
      tabs.forEach(function (t) {
        var on = t.id === id;
        t.sec.classList.toggle("rb-hidden", !on);
        if (on) t.sec.classList.add("in"); // reveal-on-scroll never fires for a hidden panel
        btns[t.id].classList.toggle("active", on);
        btns[t.id].setAttribute("aria-selected", on ? "true" : "false");
        btns[t.id].setAttribute("tabindex", on ? "0" : "-1");
      });
      if (opts.remember) lsSet(KEY, id);
      if (opts.focus) btns[id].focus();
    }
    tabs.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rb-tab";
      b.id = "rb-tab-" + t.id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", t.id);
      b.innerHTML = '<span aria-hidden="true">' + t.icon + "</span> " + esc(t.label);
      b.addEventListener("click", function () { activate(t.id, { remember: true }); });
      bar.appendChild(b);
      btns[t.id] = b;
      t.sec.setAttribute("role", "tabpanel");
      t.sec.setAttribute("aria-labelledby", b.id);
      t.sec.setAttribute("tabindex", "0");   // panels open on a heading, not a focusable element
    });
    bar.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var ids = tabs.map(function (t) { return t.id; }), i = ids.indexOf(current), n = null;
      if (e.key === "ArrowRight") n = (i + 1) % ids.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + ids.length) % ids.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = ids.length - 1;
      if (n === null) return;
      e.preventDefault();
      activate(ids[n], { remember: true, focus: true });
    });
    demo.parentNode.insertBefore(bar, demo);
    function tabFor(hash) {   // which panel holds the element a "#…" fragment points at
      if (!hash || hash.length < 2 || hash.charAt(0) !== "#") return null;
      var el = null;
      try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) {}
      if (!el) return null;
      for (var k = 0; k < tabs.length; k++) if (tabs[k].sec === el || tabs[k].sec.contains(el)) return tabs[k].id;
      return null;
    }
    // TOC links and in-page anchors switch to the right tab before the browser scrolls
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      var id = a && tabFor(a.getAttribute("href"));
      if (id && id !== current) activate(id, { remember: true });
    });
    window.addEventListener("hashchange", function () {
      var id = tabFor(location.hash);
      if (id && id !== current) activate(id, { remember: true });
    });
    var stored = lsGet(KEY);
    activate(tabFor(location.hash) || (stored === "pov" || stored === "demo" ? stored : "demo"));
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

  /* ---------- lightbox for screenshots and diagrams ----------
     Openers: every `figure.shot img` and every `.diagram-card` holding an SVG (phase players
     excluded). Each opener is a Tab stop (the img, or the card's SVG) and opens on click, Enter
     or Space. The dialog is modal: visible × button (focused on open), Esc / backdrop close,
     Tab trapped, page scroll locked, focus returned to the item last shown. ArrowLeft/Right step
     through the openers visible on the page ("n / N"; a hidden runbook tab's are skipped). Caption under the enlarged view: the figure's
     figcaption, or the card's .diagram-caption (inside the card, as a following sibling, or as a
     figcaption of a wrapping <figure>), or the spotlight's ol.spot-steps. Screenshots larger
     than the viewport get a 1:1 toggle (button, or click the image) and pan by scrolling. */
  function initLightbox() {
    var shots = $$("figure.shot img");
    var diagrams = $$(".diagram-card").filter(function (d) {
      return d.querySelector("svg") && !d.querySelector(".phase-player") && !d.closest(".phase-player");
    });
    if (!shots.length && !diagrams.length) return;
    var items = shots.concat(diagrams).sort(function (a, b) {
      return a.compareDocumentPosition(b) & 4 ? -1 : 1;   // document order
    });
    function targetOf(el) { return el.tagName === "IMG" ? el : el.querySelector("svg"); }

    var hint = document.createElement("span");
    hint.id = "lb-hint";
    hint.className = "sr-only";
    hint.textContent = "Press Enter to enlarge.";
    document.body.appendChild(hint);

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<div class="lb-bar"><span class="lb-count" aria-live="polite"></span>' +
      '<button type="button" class="lb-btn lb-zoom" aria-pressed="false" title="Actual size">1:1</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous" title="Previous (←)"><span aria-hidden="true">‹</span></button>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next" title="Next (→)"><span aria-hidden="true">›</span></button>' +
      '<button type="button" class="lb-btn lb-close" aria-label="Close" title="Close (Esc)"><span aria-hidden="true">×</span></button></div>' +
      '<div class="lightbox-stage"></div><div class="lb-caption" hidden></div>';
    document.body.appendChild(lb);
    var stage = $(".lightbox-stage", lb), cap = $(".lb-caption", lb), count = $(".lb-count", lb),
        closeBtn = $(".lb-close", lb), prevBtn = $(".lb-prev", lb), nextBtn = $(".lb-next", lb), zoomBtn = $(".lb-zoom", lb);
    zoomBtn.setAttribute("aria-label", "Actual size");
    var cur = -1, isOpen = false, gallery = [];   // gallery: the openers visible when it opened (not in a hidden tab)

    function squish(t) { return String(t || "").replace(/\s+/g, " ").trim(); }
    function captionOf(el) {   // → { text } or { steps: [..] } or null
      if (el.tagName === "IMG") {
        var fig = el.closest("figure"), fc = fig && $("figcaption", fig);
        return fc && squish(fc.textContent) ? { text: squish(fc.textContent) } : null;
      }
      var c = $(".diagram-caption, figcaption", el);
      var nx = el.nextElementSibling;
      if (!c && nx && nx.matches(".diagram-caption, figcaption")) c = nx;
      if (!c && el.parentElement && el.parentElement.tagName === "FIGURE") c = $(":scope > figcaption", el.parentElement);
      if (c && squish(c.textContent)) return { text: squish(c.textContent) };
      if (nx && nx.matches("ol.spot-steps")) {
        return { steps: $$("li", nx).map(function (li) {
          var t = li.cloneNode(true);
          $$(".spot-n", t).forEach(function (n) { n.remove(); });
          return squish(t.textContent);
        }) };
      }
      return null;
    }
    function nameOf(el) {
      if (el.tagName === "IMG") return el.alt ? "Enlarged screenshot: " + el.alt : "Enlarged screenshot";
      var svg = el.querySelector("svg"), t = svg && svg.querySelector("title");
      var n = (t && t.textContent.trim()) || (svg && svg.getAttribute("aria-label")) || "";
      return n ? "Enlarged diagram: " + n : "Enlarged diagram";
    }
    function setZoom(on, ev) {
      var img = $("img", stage);
      if (!img || (on && !img.classList.contains("can-zoom"))) on = false;
      var fx = 0.5, fy = 0.5;
      if (on && ev && img) {
        var r = img.getBoundingClientRect();
        fx = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
        fy = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      }
      lb.classList.toggle("lb-zoomed", on);
      zoomBtn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) {
        stage.scrollLeft = fx * stage.scrollWidth - stage.clientWidth / 2;
        stage.scrollTop = fy * stage.scrollHeight - stage.clientHeight / 2;
      }
    }
    function render(n) {
      cur = (n + gallery.length) % gallery.length;
      var el = gallery[cur];
      setZoom(false);
      stage.innerHTML = "";
      if (el.tagName === "IMG") {
        var img = document.createElement("img");
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || "";
        var check = function () {
          var big = img.naturalWidth > img.clientWidth * 1.15 || img.naturalHeight > img.clientHeight * 1.15;
          img.classList.toggle("can-zoom", big);
          zoomBtn.hidden = !big;
          keepFocus();
        };
        zoomBtn.hidden = true;
        img.addEventListener("load", check);
        img.addEventListener("click", function (e) { setZoom(!lb.classList.contains("lb-zoomed"), e); });
        stage.appendChild(img);
        if (img.complete) check();
      } else {
        zoomBtn.hidden = true;
        var clone = el.cloneNode(true);
        clone.classList.remove("reveal", "zoomable");
        clone.classList.add("in");
        clone.removeAttribute("title");
        $$(".diagram-caption, figcaption", clone).forEach(function (c) { c.remove(); });   // shown below instead
        var csvg = clone.querySelector("svg");
        if (csvg) {
          csvg.removeAttribute("tabindex");
          csvg.removeAttribute("aria-describedby");
          var t = csvg.querySelector("title");
          if (t && t.textContent.trim()) csvg.setAttribute("aria-label", t.textContent.trim());
        }
        // duplicate ids from the page would be invalid — the clone is named by aria-label instead.
        // (url(#…) fills defined in a page sprite outside the card still resolve.)
        clone.querySelectorAll("[id]").forEach(function (x) { x.removeAttribute("id"); });
        clone.querySelectorAll("[aria-labelledby]").forEach(function (x) { x.removeAttribute("aria-labelledby"); });
        stage.appendChild(clone);
      }
      var c = captionOf(el);
      cap.innerHTML = !c ? "" : c.steps
        ? '<ol class="lb-steps">' + c.steps.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>"
        : esc(c.text);
      cap.hidden = !c;
      lb.classList.toggle("lb-nocap", !c);
      lb.setAttribute("aria-label", nameOf(el));
      var many = gallery.length > 1;
      count.textContent = many ? (cur + 1) + " / " + gallery.length : "";
      prevBtn.hidden = nextBtn.hidden = !many;
      keepFocus();
    }
    function keepFocus() {
      var a = document.activeElement;
      if (isOpen && (!a || !lb.contains(a) || a.hidden)) closeBtn.focus();
    }
    function open(el) {
      gallery = items.filter(function (x) { return x === el || x.getClientRects().length; });
      if (!isOpen) { isOpen = true; lockScroll(); lb.classList.add("open"); }
      render(gallery.indexOf(el));
      closeBtn.focus();
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      lb.classList.remove("open", "lb-zoomed");
      stage.innerHTML = "";
      unlockScroll();
      restoreFocus(targetOf(gallery[cur]));
    }
    items.forEach(function (el) {
      var tgt = targetOf(el);
      if (el.tagName !== "IMG") {
        el.classList.add("zoomable");
        el.setAttribute("title", "Click to enlarge");
      }
      el.addEventListener("click", function () { open(el); });
      if (!tgt) return;
      if (!tgt.hasAttribute("tabindex")) tgt.setAttribute("tabindex", "0");
      var db = tgt.getAttribute("aria-describedby");
      if (!db || db.split(/\s+/).indexOf("lb-hint") === -1) tgt.setAttribute("aria-describedby", (db ? db + " " : "") + "lb-hint");
      tgt.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === " " || e.key === "Spacebar") && !e.altKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          open(el);
        }
      });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { render(cur - 1); });
    nextBtn.addEventListener("click", function () { render(cur + 1); });
    zoomBtn.addEventListener("click", function () { setZoom(!lb.classList.contains("lb-zoomed")); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === stage) close(); });   // backdrop only
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") trapTab(lb, e);
      else if (lb.classList.contains("lb-zoomed")) return;   // arrows pan the 1:1 view
      else if (e.key === "ArrowLeft" && gallery.length > 1) { e.preventDefault(); render(cur - 1); }
      else if (e.key === "ArrowRight" && gallery.length > 1) { e.preventDefault(); render(cur + 1); }
    });
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
    var overlay = null, opener = null;
    function openDialog(type) {
      closeDialog();
      opener = document.activeElement;
      overlay = document.createElement("div");
      overlay.className = "fb-overlay";
      var title = type === "bug" ? "Report a bug" : "Send feedback";
      overlay.innerHTML =
        '<form class="fb-dialog" novalidate role="dialog" aria-modal="true" aria-labelledby="fb-title">' +
        '<h3 id="fb-title">' + title + "</h3>" +
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
      lockScroll();
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
    function escClose(e) {
      if (e.key === "Escape") { e.preventDefault(); closeDialog(); }
      else if (overlay) trapTab($(".fb-dialog", overlay), e);
    }
    function closeDialog() {
      document.removeEventListener("keydown", escClose);
      if (!overlay) return;
      overlay.remove();
      overlay = null;
      unlockScroll();
      var o = opener;
      opener = null;
      restoreFocus(o);
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

  /* ---------- phased migration player ----------
     Autoplay (data-autoplay="«ms»") runs only while the player is on screen and never under
     prefers-reduced-motion. The ▶/❚❚ button is a toggle (aria-pressed="true" = paused); a pause is
     remembered per page and player in localStorage["uc-phase-paused:«page»:«n»"] and survives
     scrolling away and reloads until the reader presses play again. Stepping by dot, ‹ ›, or the
     arrow keys (Home/End too) also halts autoplay for the rest of the visit, without storing. */
  function initPhasePlayers() {
    var players = $$(".phase-player");
    if (!players.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pageKey = document.body.getAttribute("data-uc") || location.pathname.replace(/^.*\//, "");
    players.forEach(function (pl, pIndex) {
      var phases = $$(".phase", pl);
      if (phases.length < 2) return;
      pl.classList.add("ready");
      pl.setAttribute("tabindex", "0");
      pl.setAttribute("role", "group");
      pl.setAttribute("aria-roledescription", "phased walkthrough");
      var sec = pl.closest("section"), h2 = sec && $("h2", sec);
      if (!pl.hasAttribute("aria-label")) pl.setAttribute("aria-label", (h2 && h2.textContent.trim()) || "Phased walkthrough");
      var i = 0, timer = null;
      var autoMs = parseInt(pl.getAttribute("data-autoplay") || "0", 10);
      var KEY = "uc-phase-paused:" + pageKey + ":" + pIndex;
      var userPaused = lsGet(KEY) === "1";   // stored: explicit pause button
      var halted = false;                    // this visit only: the reader stepped manually
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
        b.setAttribute("aria-label", "Phase " + idx + ": " + title);
        b.innerHTML = '<span class="phase-dot-n" aria-hidden="true">' + idx + '</span><span class="phase-dot-t" aria-hidden="true">' + esc(title) + "</span>";
        b.addEventListener("click", function () { manual(); show(idx); });
        if (steps) steps.appendChild(b);
        dots.push(b);
      });
      function show(n) {
        i = (n + phases.length) % phases.length;
        phases.forEach(function (ph, idx) { ph.classList.toggle("active", idx === i); });
        dots.forEach(function (d, idx) {
          d.classList.toggle("active", idx === i);
          d.setAttribute("aria-pressed", idx === i ? "true" : "false");
        });
        if (caption) caption.textContent = capOf(phases[i]);
      }
      function next() { show(i + 1); }
      function prev() { show(i - 1); }
      function canPlay() { return autoMs > 0 && !reduce; }
      function start() { if (timer || !canPlay()) return; timer = setInterval(next, autoMs); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function manual() { halted = true; stop(); updatePlay(); }
      var pv = pl.querySelector(".phase-prev"),
          nx = pl.querySelector(".phase-next"),
          pp = pl.querySelector(".phase-play");
      function updatePlay() {
        if (!pp) return;
        var playing = !!timer;
        pp.innerHTML = '<span aria-hidden="true">' + (playing ? "❚❚" : "▶") + "</span>";
        pp.setAttribute("aria-label", "Pause autoplay");
        pp.setAttribute("aria-pressed", playing ? "false" : "true");
        pp.title = playing ? "Pause" : "Play walkthrough";
      }
      // controls sit inside a .diagram-card on some pages — don't let clicks bubble to a zoom handler
      pl.addEventListener("click", function (e) { if (e.target.closest(".phase-nav, .phase-dot")) e.stopPropagation(); });
      if (pv) pv.addEventListener("click", function () { manual(); prev(); });
      if (nx) nx.addEventListener("click", function () { manual(); next(); });
      if (pp) {
        if (!canPlay()) pp.style.display = "none";
        else pp.addEventListener("click", function () {
          if (timer) { stop(); userPaused = true; lsSet(KEY, "1"); }
          else { userPaused = false; halted = false; lsSet(KEY, null); start(); }
          updatePlay();
        });
      }
      pl.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k === "ArrowRight") { manual(); next(); }
        else if (k === "ArrowLeft") { manual(); prev(); }
        else if (k === "Home") { manual(); show(0); }
        else if (k === "End") { manual(); show(phases.length - 1); }
        else return;
        e.preventDefault();
      });
      show(0);
      if (canPlay() && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) {
            if (en.isIntersecting && !userPaused && !halted) start(); else stop();
            updatePlay();
          });
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
    initFolds();
    initFilterDock();
    initSlashShortcut();
    initPage();
    initRunbookTabs();
    initCapturePlaceholders();
    initLightbox();
    initReveal();
    initPhasePlayers();
  });
})();
