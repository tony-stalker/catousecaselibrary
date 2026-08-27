/* Cato Use Case Library — Migration Planner (internal).
   Deterministic composition: selected inputs -> rules in planner-rules.js -> a sequenced plan.
   No network calls, no persistence beyond this page. */
(function () {
  "use strict";

  var RULES = window.PLANNER_RULES || { phases: [], dimensions: [] };
  var CAT = window.UC_CATALOG || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var byId = {};
  CAT.forEach(function (c) { byId[c.id] = c; });

  var dim = {};
  (RULES.dimensions || []).forEach(function (d) { dim[d.dimension] = d; });

  /* ---------- form wiring ---------- */

  var SELECTS = [
    { el: "f-wan", dimension: "wan" },
    { el: "f-sdwan", dimension: "sdwan-vendor" },
    { el: "f-proxy", dimension: "proxy-sse" },
    { el: "f-fw", dimension: "firewall" },
    { el: "f-ra", dimension: "remote-access" }
  ];

  function fill(sel, dimension) {
    var d = dim[dimension];
    if (!d) return;
    (d.options || []).forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.key;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
  }

  function checkboxes(host, dimension) {
    var d = dim[dimension];
    if (!d) return;
    (d.options || []).forEach(function (o) {
      var id = "cb-" + dimension + "-" + o.key;
      var wrap = document.createElement("label");
      wrap.className = "cb";
      wrap.setAttribute("for", id);
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = id; cb.value = o.key;
      cb.setAttribute("data-dim", dimension);
      wrap.appendChild(cb);
      wrap.appendChild(document.createTextNode(o.label));
      host.appendChild(wrap);
    });
  }

  SELECTS.forEach(function (s) { fill($("#" + s.el), s.dimension); });
  checkboxes($("#f-sec"), "security-controls");
  checkboxes($("#f-drivers"), "drivers");

  /* SD-WAN vendor only matters when the transport involves SD-WAN. */
  var wanSel = $("#f-wan"), sdwanWrap = $("#f-sdwan-wrap");
  function syncSdwan() {
    var v = wanSel.value;
    var show = v === "sdwan" || v === "hybrid-mpls-internet";
    sdwanWrap.hidden = !show;
    if (!show) $("#f-sdwan").value = "";
  }
  wanSel.addEventListener("change", syncSdwan);
  syncSdwan();

  /* ---------- composition ---------- */

  function selected() {
    var picks = [];
    SELECTS.forEach(function (s) {
      var v = $("#" + s.el).value;
      if (!v) return;
      var d = dim[s.dimension];
      if (!d) return;
      var o = (d.options || []).filter(function (x) { return x.key === v; })[0];
      if (o) picks.push({ dimension: s.dimension, option: o });
    });
    Array.prototype.forEach.call(document.querySelectorAll("input[type=checkbox][data-dim]"), function (cb) {
      if (!cb.checked) return;
      var d = dim[cb.getAttribute("data-dim")];
      if (!d) return;
      var o = (d.options || []).filter(function (x) { return x.key === cb.value; })[0];
      if (o) picks.push({ dimension: cb.getAttribute("data-dim"), option: o });
    });
    /* Steps every migration needs regardless of the incumbent estate. No control
       selects these — they join any plan that has something to plan against. */
    if (picks.length && dim.common) {
      var always = (dim.common.options || [])[0];
      if (always) picks.unshift({ dimension: "common", option: always });
    }
    return picks;
  }

  /* Steps arriving from different dimensions often say the same thing twice.
     Normalise hard before comparing so near-duplicates collapse. */
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\b(the|a|an|and|to|of|for|on|in|with|then|its|their)\b/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  function dedupe(items) {
    var seen = {}, out = [];
    items.forEach(function (it) {
      var k = norm(it.text);
      if (!k || seen[k]) {
        if (seen[k] && it.from) seen[k].from.push(it.from);
        return;
      }
      var rec = { text: it.text, from: it.from ? [it.from] : [] };
      seen[k] = rec; out.push(rec);
    });
    return out;
  }

  function compose(picks) {
    var phases = {}, risks = [], prereqs = [], evidence = [], pages = {};

    (RULES.phases || []).forEach(function (p) { phases[p.key] = { def: p, steps: [] }; });

    picks.forEach(function (p) {
      var o = p.option, label = o.label;
      (o.phases || []).forEach(function (ph) {
        if (!phases[ph.phase]) return;           /* unknown phase key: ignore rather than invent */
        (ph.steps || []).forEach(function (s) {
          phases[ph.phase].steps.push({ text: s, from: label });
        });
      });
      (o.risks || []).forEach(function (r) { risks.push({ text: r, from: label }); });
      (o.prereqs || []).forEach(function (r) { prereqs.push({ text: r, from: label }); });
      (o.evidence || []).forEach(function (r) { evidence.push({ text: r, from: label }); });
      (o.pages || []).forEach(function (id) { if (byId[id]) pages[id] = true; });
    });

    Object.keys(phases).forEach(function (k) { phases[k].steps = dedupe(phases[k].steps); });

    return {
      phases: (RULES.phases || []).map(function (p) { return phases[p.key]; })
        .filter(function (p) { return p && p.steps.length; }),
      risks: dedupe(risks),
      prereqs: dedupe(prereqs),
      evidence: dedupe(evidence),
      pages: Object.keys(pages)
    };
  }

  /* ---------- render ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function summary(picks) {
    var name = $("#f-name").value.trim();
    var sites = $("#f-sites").value.trim();
    var spread = $("#f-spread");
    var spreadTxt = spread.value ? spread.options[spread.selectedIndex].text.toLowerCase() : "";
    var estate = picks.filter(function (p) {
      return p.dimension !== "drivers" && p.dimension !== "security-controls"
        && p.dimension !== "common";
    }).map(function (p) { return p.option.label; });
    var drivers = picks.filter(function (p) { return p.dimension === "drivers"; })
      .map(function (p) { return p.option.label.toLowerCase(); });

    var bits = [];
    if (name) bits.push("<strong>" + esc(name) + "</strong>");
    if (sites) bits.push(esc(sites) + " site" + (sites === "1" ? "" : "s") + (spreadTxt ? ", " + esc(spreadTxt) : ""));
    else if (spreadTxt) bits.push(esc(spreadTxt));
    var s = bits.join(" &mdash; ");
    if (estate.length) s += (s ? ". " : "") + "Displacing " + esc(estate.join(", ")) + ".";
    if (drivers.length) s += " Driven by " + esc(drivers.join(", ")) + ".";
    return s;
  }

  function pageLinks(ids) {
    return ids.map(function (id) {
      var c = byId[id];
      return '<a href="' + esc(c.file) + '">' + esc(c.title) + "</a>";
    }).join("");
  }

  function list(items, showSource) {
    return "<ul>" + items.map(function (i) {
      var src = showSource && i.from.length
        ? ' <span class="pl-src">&mdash; ' + esc(i.from.slice(0, 3).join(", ")) + "</span>"
        : "";
      return "<li>" + esc(i.text) + src + "</li>";
    }).join("") + "</ul>";
  }

  /* A real estate contributes 30+ risks. Flat, that is a wall nobody reads;
     grouped by what they come from, it is eight short lists you can triage. */
  function grouped(items) {
    var order = [], groups = {};
    items.forEach(function (i) {
      var k = i.from.length ? i.from[0] : "General";
      if (!groups[k]) { groups[k] = []; order.push(k); }
      groups[k].push(i);
    });
    return order.map(function (k) {
      return '<div class="pl-grp"><h4>' + esc(k) + "</h4><ul>"
        + groups[k].map(function (i) { return "<li>" + esc(i.text) + "</li>"; }).join("")
        + "</ul></div>";
    }).join("");
  }

  function render(plan, picks) {
    var out = $("#pl-out");
    if (!plan.phases.length) {
      out.innerHTML = '<div class="card pl-empty"><p>Nothing to plan yet &mdash; pick at least '
        + "one part of the existing estate.</p></div>";
      return;
    }

    var h = '<div class="card" style="margin-bottom:18px">'
      + '<div class="section-kicker">Migration plan</div>'
      + '<p class="pl-sum">' + summary(picks) + "</p>"
      + '<div class="pl-actions">'
      + '<button type="button" class="btn btn-primary" id="pl-view">Present</button>'
      + '<button type="button" class="btn btn-ghost" id="pl-pptx">PowerPoint</button>'
      + '<button type="button" class="btn btn-ghost" id="pl-xlsx">Excel</button>'
      + '<button type="button" class="btn btn-ghost" id="pl-print">Print / PDF</button>'
      + '<button type="button" class="btn btn-ghost" id="pl-copy">Copy as Markdown</button>'
      + "</div></div>";

    if (plan.prereqs.length) {
      h += '<div class="callout warn" style="margin-bottom:18px"><div class="co-title">'
        + "Before phase one (" + plan.prereqs.length + ")</div>"
        + grouped(plan.prereqs) + "</div>";
    }

    var scenes = window.PlannerTopology ? window.PlannerTopology.scenes(picks) : [];

    h += '<div class="pl-doc" id="pl-doc">';
    if (scenes.length) {
      h += '<div class="card" style="margin-bottom:18px"><div class="section-kicker">'
        + "Topology &mdash; before, during, after</div>"
        + scenes.map(function (sc) {
            return '<figure class="pl-topo"><h4>' + esc(sc.title) + "</h4>" + sc.svg
              + "<figcaption>" + esc(sc.caption) + "</figcaption></figure>";
          }).join("")
        + '<div class="pl-actions"><button type="button" class="btn btn-ghost" id="pl-drawio">'
        + "Download .drawio</button></div></div>";
    }
    h += '<div class="card" style="margin-bottom:18px">';
    plan.phases.forEach(function (p, i) {
      h += '<div class="pl-phase"><h3><span class="pl-num">' + (i + 1) + ".</span>"
        + esc(p.def.title) + "</h3>";
      if (p.def.objective) h += '<p class="pl-obj">' + esc(p.def.objective) + "</p>";
      h += list(p.steps, true) + "</div>";
    });
    h += "</div>";

    if (plan.risks.length) {
      h += '<div class="callout risk" style="margin-bottom:18px"><div class="co-title">'
        + "Name these early (" + plan.risks.length + ")</div>"
        + grouped(plan.risks) + "</div>";
    }

    if (plan.evidence.length) {
      h += '<div class="card" style="margin-bottom:18px"><div class="section-kicker">'
        + "Evidence that closes the migration (" + plan.evidence.length + ")</div>"
        + grouped(plan.evidence) + "</div>";
    }

    if (plan.pages.length) {
      h += '<div class="card"><div class="section-kicker">The detail lives here ('
        + plan.pages.length + ')</div><div class="pl-links">'
        + pageLinks(plan.pages) + "</div></div>";
    }

    h += "</div>";                       /* /pl-doc */
    h += renderDeck(plan, picks);

    out.innerHTML = h;
    /* the deck must be laid out (not display:none) to be measured, so reflow while it is on
       screen, then hide it again */
    var dw = $("#pl-deckwrap");
    dw.classList.add("on");
    reflow();
    dw.classList.remove("on");
    showSlide(0);

    $("#pl-print").addEventListener("click", function () { window.print(); });
    $("#pl-copy").addEventListener("click", function () { copyMd(plan, picks, this); });
    $("#pl-pptx").addEventListener("click", function (e) {
      var btn = e.currentTarget;
      var title = $("#f-name").value.trim() || "Migration plan";
      try {
        window.PlannerExport.pptx(slidesFromDom(), title);
        btn.textContent = "Downloaded";
      } catch (err) {
        btn.textContent = "Failed";
        if (window.console) console.error(err);
      }
      setTimeout(function () { btn.textContent = "PowerPoint"; }, 1800);
    });
    $("#pl-xlsx").addEventListener("click", function (e) {
      var btn = e.currentTarget;
      try {
        window.PlannerExport.xlsx(workbook(plan, picks), $("#f-name").value.trim() || "Migration plan");
        btn.textContent = "Downloaded";
      } catch (err) {
        btn.textContent = "Failed";
        if (window.console) console.error(err);
      }
      setTimeout(function () { btn.textContent = "Excel"; }, 1800);
    });

    var dio = $("#pl-drawio");
    if (dio) dio.addEventListener("click", function () {
      window.PlannerExport.drawio(window.PlannerTopology.drawio(picks),
        ($("#f-name").value.trim() || "Migration plan") + " topology");
      dio.textContent = "Downloaded";
      setTimeout(function () { dio.textContent = "Download .drawio"; }, 1800);
    });
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { showSlide(deck.i + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { showSlide(deck.i - 1); e.preventDefault(); }
      else if (e.key === "Home") { showSlide(0); e.preventDefault(); }
      else if (e.key === "End") { showSlide(deck.total - 1); e.preventDefault(); }
    }

    /* Changing depth rebuilds the deck from scratch — it has to be measured again. */
    function onDepth() {
      deck.depth = this.value;
      var wasOn = $("#pl-deckwrap").classList.contains("on");
      var host = $("#pl-deckwrap").parentNode, holder = document.createElement("div");
      holder.innerHTML = renderDeck(plan, picks);
      host.replaceChild(holder.firstChild, $("#pl-deckwrap"));
      $("#pl-deckwrap").classList.add("on");
      reflow();
      if (!wasOn) $("#pl-deckwrap").classList.remove("on");
      showSlide(0);
      bindDeck();
      if (wasOn) $("#pl-stage").focus();
    }

    function bindDeck() {
      $("#pl-prev").addEventListener("click", function () { showSlide(deck.i - 1); });
      $("#pl-next").addEventListener("click", function () { showSlide(deck.i + 1); });
      $("#pl-depth").value = deck.depth;
      $("#pl-depth").addEventListener("change", onDepth);
      $("#pl-stage").addEventListener("keydown", onKey);
    }
    bindDeck();

    var vbtn = $("#pl-view");
    vbtn.addEventListener("click", function () {
      var on = $("#pl-deckwrap").classList.toggle("on");
      $("#pl-doc").classList.toggle("off", on);
      vbtn.textContent = on ? "Document" : "Present";
      if (on) $("#pl-stage").focus();
    });

  }

  /* ---------- slides ----------
     Slides pack to the space that exists, not to a fixed bullet count: each section is
     emitted whole, then reflowed against the real stage height so a slide carries as much
     as it can hold and no more. That is what keeps the deck short and dense rather than
     long and half empty. */

  var deck = { i: 0, total: 0, depth: "summary" };

  /* Flatten a grouped section into list items, its headings included. */
  function groupItems(items, cap) {
    var order = [], g = {};
    items.forEach(function (i) {
      var k = i.from.length ? i.from[0] : "General";
      if (!g[k]) { g[k] = []; order.push(k); }
      g[k].push(i.text);
    });
    var out = [];
    order.forEach(function (k) {
      if (cap === -1) {                       /* summary: where it concentrates, not what it says */
        out.push({ t: k + " — " + g[k].length });
        return;
      }
      var list = cap ? g[k].slice(0, cap) : g[k];
      out.push({ t: k + (cap && g[k].length > cap ? " — " + list.length + " of " + g[k].length : ""),
        head: true });
      list.forEach(function (t) { out.push({ t: t }); });
    });
    return out;
  }

  function buildSlides(plan, picks) {
    var isSummary = deck.depth === "summary";
    var cap = isSummary ? -1 : 0;
    var name = $("#f-name").value.trim() || "Migration plan";

    var slides = [{ cls: "sl-title", title: name, sub: summary(picks).replace(/<[^>]+>/g, "") }];

    (window.PlannerTopology ? window.PlannerTopology.scenes(picks) : []).forEach(function (sc) {
      slides.push({ kicker: "Topology", title: sc.title, sub: sc.caption, svg: sc.svg });
    });

    if (plan.prereqs.length) {
      slides.push({ kicker: "Before phase one", title: "Prerequisites",
        sub: isSummary ? plan.prereqs.length + " prerequisites, by where they come from. The full list is in the document and the workbook." : "",
        items: groupItems(plan.prereqs, cap) });
    }

    var STEP_CAP = 5;
    plan.phases.forEach(function (p, i) {
      var steps = p.steps, shown = isSummary ? steps.slice(0, STEP_CAP) : steps;
      var items = shown.map(function (s) { return { t: s.text }; });
      if (steps.length > shown.length) {
        items.push({ t: "+ " + (steps.length - shown.length) + " more in the full plan", muted: true });
      }
      slides.push({
        kicker: "Phase " + (i + 1) + " of " + plan.phases.length,
        title: p.def.title, sub: p.def.objective, items: items
      });
    });

    if (plan.risks.length) {
      slides.push({ kicker: "Name these early", title: "Risks",
        sub: isSummary ? plan.risks.length + " risks, by where they concentrate." : "",
        items: groupItems(plan.risks, cap) });
    }
    if (plan.evidence.length) {
      slides.push({ kicker: "Proof", title: "Evidence that closes it",
        sub: isSummary ? plan.evidence.length + " artefacts, by what they prove." : "",
        items: groupItems(plan.evidence, cap) });
    }
    if (!isSummary && plan.pages.length) {
      slides.push({ kicker: "Reference", title: "Where the detail lives",
        items: plan.pages.map(function (id) { return { t: byId[id].title }; }) });
    }
    return slides;
  }

  function slideHtml(s) {
    var h = '<div class="pl-slide' + (s.cls ? " " + s.cls : "") + '">';
    if (s.kicker) h += '<div class="sl-kicker">' + esc(s.kicker) + "</div>";
    h += "<h2>" + esc(s.title) + "</h2>";
    if (s.sub) h += '<p class="sl-sub">' + esc(s.sub) + "</p>";
    if (s.svg) h += '<figure class="pl-topo">' + s.svg + "</figure>";
    if (s.items && s.items.length) {
      h += '<ul class="sl-list">' + s.items.map(function (i) {
        var c = i.head ? "sl-h" : (i.muted ? "sl-more" : "");
        return "<li" + (c ? ' class="' + c + '"' : "") + ">" + esc(i.t) + "</li>";
      }).join("") + "</ul>";
    }
    return h + '<div class="sl-foot"><span class="sl-name"></span>'
      + '<span class="sl-no"></span></div></div>';
  }

  function contSlide(el) {
    var d = document.createElement("div");
    d.className = "pl-slide";
    d.setAttribute("data-cont", "1");
    var k = el.querySelector(".sl-kicker");
    d.innerHTML = (k ? '<div class="sl-kicker">' + k.innerHTML + "</div>" : "")
      + "<h2>" + esc(el.querySelector("h2").textContent.replace(/ \(cont\.\)$/, "")) + " (cont.)</h2>"
      + '<ul class="sl-list"></ul>'
      + '<div class="sl-foot"><span class="sl-name"></span><span class="sl-no"></span></div>';
    return d;
  }

  /* How much vertical room the list actually has: the slide's content box less every
     sibling that is not the list. scrollHeight is unreliable here — the slide is an
     absolutely positioned flex column, so it reports no overflow even when there is some. */
  function listRoom(el) {
    var cs = window.getComputedStyle(el);
    var room = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    Array.prototype.forEach.call(el.children, function (c) {
      if (!c.classList.contains("sl-list")) room -= c.getBoundingClientRect().height;
    });
    return room;
  }

  function listFits(el, ul) {
    return ul.getBoundingClientRect().height <= listRoom(el) + 1;
  }

  /* Fit a slide's list in the least space: try one column, then two, and only split onto a
     continuation when even two columns will not hold it. Splitting last is what keeps the
     deck short; trying one column first is what stops short lists becoming two stubby ones. */
  function reflow() {
    var stage = $("#pl-stage");
    if (!stage) return;
    var guard = 0;
    for (var n = 0; n < stage.children.length && guard < 800; n++) {
      var el = stage.children[n];
      el.classList.add("active");
      var ul = el.querySelector(".sl-list");
      if (ul) {
        ul.classList.remove("sl-2col");
        if (!listFits(el, ul) && ul.children.length > 3) ul.classList.add("sl-2col");

        while (!listFits(el, ul) && ul.children.length > 1 && guard++ < 800) {
          var next = stage.children[n + 1];
          if (!next || !next.hasAttribute("data-cont")) {
            next = contSlide(el);
            stage.insertBefore(next, el.nextSibling);
          }
          var nul = next.querySelector(".sl-list");
          nul.insertBefore(ul.lastElementChild, nul.firstChild);
          if (ul.lastElementChild && ul.lastElementChild.classList.contains("sl-h")) {
            nul.insertBefore(ul.lastElementChild, nul.firstChild);
          }
        }
      }
      el.classList.remove("active");
    }

    /* An overfilled slide followed by a stub reads worse than two even ones. */
    for (var m = 0; m < stage.children.length - 1; m++) {
      var a = stage.children[m], bcont = stage.children[m + 1];
      if (!bcont.hasAttribute("data-cont")) continue;
      var au = a.querySelector(".sl-list"), bu = bcont.querySelector(".sl-list");
      if (!au || !bu) continue;
      a.classList.add("active");
      while (au.children.length - 1 > bu.children.length + 1
             && bu.getBoundingClientRect().height < listRoom(bcont)) {
        bu.insertBefore(au.lastElementChild, bu.firstChild);
      }
      a.classList.remove("active");
    }

    var name = $("#f-name").value.trim() || "Migration plan";
    deck.total = stage.children.length;
    Array.prototype.forEach.call(stage.children, function (el, i) {
      var nm = el.querySelector(".sl-name"), no = el.querySelector(".sl-no");
      if (nm) nm.textContent = name;
      if (no) no.textContent = (i + 1) + " / " + deck.total;
    });
  }

  function slidesFromDom() {
    return Array.prototype.map.call(document.querySelectorAll("#pl-stage .pl-slide"), function (el) {
      var k = el.querySelector(".sl-kicker"), sub = el.querySelector(".sl-sub");
      var out = {
        cls: el.classList.contains("sl-title") ? "sl-title" : "",
        kicker: k ? k.textContent : "",
        title: el.querySelector("h2").textContent,
        sub: sub ? sub.textContent : "",
        foot: (el.querySelector(".sl-name") || {}).textContent || ""
      };
      var groups = [], flat = [];
      Array.prototype.forEach.call(el.querySelectorAll(".sl-list li"), function (li) {
        if (li.classList.contains("sl-h")) groups.push({ group: li.textContent, items: [] });
        else if (groups.length) groups[groups.length - 1].items.push(li.textContent);
        else flat.push(li.textContent);
      });
      if (groups.length) out.groups = groups;
      if (flat.length) out.bullets = flat;
      return out;
    });
  }

  function showSlide(n) {
    var els = document.querySelectorAll("#pl-stage .pl-slide");
    if (!els.length) return;
    deck.i = (n + els.length) % els.length;
    Array.prototype.forEach.call(els, function (el, idx) {
      el.classList.toggle("active", idx === deck.i);
    });
    var c = $("#pl-count");
    if (c) c.textContent = (deck.i + 1) + " / " + els.length;
  }

  function renderDeck(plan, picks) {
    return '<div class="pl-deck" id="pl-deckwrap"><div class="pl-stage" id="pl-stage" tabindex="0" '
      + 'role="group" aria-roledescription="slide deck">'
      + buildSlides(plan, picks).map(slideHtml).join("")
      + '</div><div class="pl-rail">'
      + '<button type="button" class="btn btn-ghost" id="pl-prev" aria-label="Previous slide">←</button>'
      + '<span class="pl-count" id="pl-count">1 / 1</span>'
      + '<button type="button" class="btn btn-ghost" id="pl-next" aria-label="Next slide">→</button>'
      + '<select id="pl-depth" aria-label="Deck depth">'
      + '<option value="summary">Summary deck</option>'
      + '<option value="full">Full detail</option></select>'
      + "</div></div>";
  }

  /* ---------- workbook ----------
     One tab per heading. The extra columns are deliberately empty: this is meant to
     leave the planner and become the tracker the migration is actually run from. */

  function fieldRows(picks) {
    var f = [
      ["Reference", $("#f-name").value.trim()],
      ["Sites in scope", $("#f-sites").value.trim() ? Number($("#f-sites").value.trim()) : ""],
      ["Geographic spread", $("#f-spread").value
        ? $("#f-spread").options[$("#f-spread").selectedIndex].text : ""]
    ];
    var byDim = {};
    picks.forEach(function (p) {
      if (p.dimension === "common") return;
      (byDim[p.dimension] = byDim[p.dimension] || []).push(p.option.label);
    });
    var names = {
      "wan": "WAN transport", "sdwan-vendor": "SD-WAN vendor", "proxy-sse": "Web proxy / SSE",
      "firewall": "Perimeter firewall", "remote-access": "Remote access",
      "security-controls": "Controls to match", "drivers": "Drivers"
    };
    Object.keys(names).forEach(function (k) {
      if (byDim[k]) f.push([names[k], byDim[k].join(", ")]);
    });
    return f.map(function (r) { return [r[0], r[1]]; });
  }

  function workbook(plan, picks) {
    var sheets = [];

    sheets.push({
      name: "Summary",
      columns: [{ title: "Field", width: 26 }, { title: "Value", width: 70 }],
      rows: fieldRows(picks).concat([
        ["", ""],
        ["Phases", plan.phases.length],
        ["Steps", plan.phases.reduce(function (n, p) { return n + p.steps.length; }, 0)],
        ["Prerequisites", plan.prereqs.length],
        ["Risks", plan.risks.length],
        ["Evidence items", plan.evidence.length],
        ["Use cases referenced", plan.pages.length]
      ])
    });

    var planRows = [];
    plan.phases.forEach(function (p, i) {
      p.steps.forEach(function (st, j) {
        planRows.push([i + 1, p.def.title, p.def.objective, j + 1, st.text,
          st.from.join(", "), "Not started", "", "", "", ""]);
      });
    });
    sheets.push({
      name: "Plan",
      columns: [
        { title: "Phase #", width: 9 }, { title: "Phase", width: 24 },
        { title: "Objective", width: 46 }, { title: "Step #", width: 8 },
        { title: "Step", width: 62 }, { title: "Driven by", width: 30 },
        { title: "Status", width: 14 }, { title: "Owner", width: 18 },
        { title: "Start", width: 12 }, { title: "Due", width: 12 }, { title: "Notes", width: 40 }
      ],
      rows: planRows
    });

    sheets.push({
      name: "Prerequisites",
      columns: [
        { title: "Driven by", width: 30 }, { title: "Prerequisite", width: 70 },
        { title: "Status", width: 14 }, { title: "Owner", width: 18 },
        { title: "Needed by", width: 13 }, { title: "Notes", width: 40 }
      ],
      rows: plan.prereqs.map(function (r) {
        return [r.from.join(", "), r.text, "Outstanding", "", "", ""];
      })
    });

    sheets.push({
      name: "Risks",
      columns: [
        { title: "Driven by", width: 30 }, { title: "Risk", width: 70 },
        { title: "Likelihood", width: 12 }, { title: "Impact", width: 12 },
        { title: "Mitigation", width: 46 }, { title: "Owner", width: 18 },
        { title: "Status", width: 14 }
      ],
      rows: plan.risks.map(function (r) {
        return [r.from.join(", "), r.text, "", "", "", "", "Open"];
      })
    });

    sheets.push({
      name: "Evidence",
      columns: [
        { title: "Driven by", width: 30 }, { title: "Evidence artefact", width: 70 },
        { title: "Captured", width: 11 }, { title: "Date", width: 12 },
        { title: "Where it lives", width: 34 }, { title: "Notes", width: 40 }
      ],
      rows: plan.evidence.map(function (r) {
        return [r.from.join(", "), r.text, "No", "", "", ""];
      })
    });

    sheets.push({
      name: "Use cases",
      columns: [
        { title: "Use case", width: 52 }, { title: "Category", width: 16 },
        { title: "Page", width: 46 }, { title: "Tags", width: 44 }
      ],
      rows: plan.pages.map(function (id) {
        var c = byId[id];
        return [c.title, c.category, c.file, (c.tags || []).join(", ")];
      })
    });

    return sheets;
  }

  /* ---------- markdown export ---------- */

  function markdown(plan, picks) {
    var name = $("#f-name").value.trim() || "Migration plan";
    var lines = ["# " + name, ""];
    var strip = function (s) { return s.replace(/<[^>]+>/g, "").replace(/&mdash;/g, "—").replace(/&amp;/g, "&"); };
    lines.push(strip(summary(picks)), "");
    var mdGroups = function (items) {
      var order = [], g = {};
      items.forEach(function (i) {
        var k = i.from.length ? i.from[0] : "General";
        if (!g[k]) { g[k] = []; order.push(k); }
        g[k].push(i.text);
      });
      order.forEach(function (k) {
        lines.push("**" + k + "**", "");
        g[k].forEach(function (t) { lines.push("- " + t); });
        lines.push("");
      });
    };
    if (plan.prereqs.length) {
      lines.push("## Before phase one", "");
      mdGroups(plan.prereqs);
    }
    plan.phases.forEach(function (p, i) {
      lines.push("## " + (i + 1) + ". " + p.def.title, "");
      if (p.def.objective) lines.push("_" + p.def.objective + "_", "");
      p.steps.forEach(function (s) { lines.push("- " + s.text); });
      lines.push("");
    });
    if (plan.risks.length) {
      lines.push("## Name these early", "");
      mdGroups(plan.risks);
    }
    if (plan.evidence.length) {
      lines.push("## Evidence that closes the migration", "");
      mdGroups(plan.evidence);
    }
    if (plan.pages.length) {
      lines.push("## Reference", "");
      plan.pages.forEach(function (id) { lines.push("- " + byId[id].title); });
    }
    return lines.join("\n");
  }

  function copyMd(plan, picks, btn) {
    var txt = markdown(plan, picks);
    var done = function (ok) {
      btn.textContent = ok ? "Copied" : "Press ⌘C";
      setTimeout(function () { btn.textContent = "Copy as Markdown"; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { fallback(txt, done); });
    } else { fallback(txt, done); }
  }

  /* file:// often has no clipboard API — fall back to a selected textarea. */
  function fallback(txt, done) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.cssText = "position:fixed;top:8px;left:8px;width:60vw;height:50vh;z-index:9999";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    if (ok) { document.body.removeChild(ta); done(true); }
    else { done(false); ta.addEventListener("blur", function () { ta.remove(); }); }
  }

  /* ---------- go ---------- */

  $("#pl-go").addEventListener("click", function () {
    var picks = selected();
    render(compose(picks), picks);
    if (window.innerWidth <= 900) $("#pl-out").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#pl-reset").addEventListener("click", function () {
    $("#pl-form").reset();
    syncSdwan();
    $("#pl-out").innerHTML = '<div class="card pl-empty"><p>Describe the estate on the left, then '
      + "<strong>Build plan</strong>.</p></div>";
  });
})();
