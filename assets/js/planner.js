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
      return p.dimension !== "drivers" && p.dimension !== "security-controls";
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
      + '<button type="button" class="btn btn-ghost" id="pl-copy">Copy as Markdown</button>'
      + '<button type="button" class="btn btn-ghost" id="pl-print">Print</button>'
      + "</div></div>";

    if (plan.prereqs.length) {
      h += '<div class="callout warn" style="margin-bottom:18px"><div class="co-title">'
        + "Before phase one (" + plan.prereqs.length + ")</div>"
        + grouped(plan.prereqs) + "</div>";
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

    out.innerHTML = h;
    $("#pl-print").addEventListener("click", function () { window.print(); });
    $("#pl-copy").addEventListener("click", function () { copyMd(plan, picks, this); });
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
