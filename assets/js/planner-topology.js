/* Cato Use Case Library — Migration Planner topology diagrams (internal).

   Before / during / after, generated from the same selections that drive the plan.
   Inline SVG using the library's own dg-* diagram classes, so the diagrams inherit the
   theme (including dark mode) and need no image assets.

   Also serialises the same model to .drawio XML (mxGraphModel is plain XML), so the
   diagram can be opened and edited in diagrams.net rather than only screenshotted. */
(function () {
  "use strict";

  var W = 900;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "&#10;");
  }

  /* Long vendor labels break boxes. Trim to what the box can hold. */
  function fit(s, max) {
    s = String(s || "");
    if (s.length <= max) return s;
    var cut = s.slice(0, max - 1);
    var sp = cut.lastIndexOf(" ");
    return (sp > max * 0.55 ? cut.slice(0, sp) : cut).replace(/[ ,(]+$/, "") + "…";
  }

  function box(n) {
    var cls = n.kind === "cato" ? "dg-node-green" : (n.kind === "dark" ? "dg-node-dark" : "dg-node");
    var lc = n.kind === "dark" ? "dg-label-inv" : "dg-label";
    var sc = n.kind === "dark" ? "dg-sub-inv" : "dg-sub";
    var h = n.h || 54, cx = n.x + n.w / 2;
    var o = n.faded ? ' opacity="0.38"' : "";
    var s = "<g" + o + '><rect class="' + cls + '" x="' + n.x + '" y="' + n.y + '" width="' + n.w
      + '" height="' + h + '" rx="9"/>';
    if (n.sub) {
      s += '<text class="' + lc + '" x="' + cx + '" y="' + (n.y + h / 2 - 3)
        + '" text-anchor="middle">' + esc(fit(n.label, 22)) + "</text>";
      s += '<text class="' + sc + '" x="' + cx + '" y="' + (n.y + h / 2 + 15)
        + '" text-anchor="middle">' + esc(fit(n.sub, 26)) + "</text>";
    } else {
      s += '<text class="' + lc + '" x="' + cx + '" y="' + (n.y + h / 2 + 5)
        + '" text-anchor="middle">' + esc(fit(n.label, 22)) + "</text>";
    }
    return s + "</g>";
  }

  function arrow(x1, y1, x2, y2, opts) {
    opts = opts || {};
    var stroke = opts.cato ? "var(--green-600)" : "var(--ink-3)";
    var dash = opts.dash ? ' stroke-dasharray="4 4"' : "";
    var o = opts.faded ? ' opacity="0.35"' : "";
    var s = "<g" + o + '><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2
      + '" stroke="' + stroke + '" stroke-width="' + (opts.cato ? 2.4 : 1.6) + '"' + dash
      + ' marker-end="url(#pl-ar' + (opts.cato ? "g" : "") + ')"/>';
    if (opts.label) {
      s += '<text class="dg-tiny" x="' + ((x1 + x2) / 2) + '" y="' + ((y1 + y2) / 2 - 6)
        + '" text-anchor="middle">' + esc(opts.label) + "</text>";
    }
    return s + "</g>";
  }

  function defs() {
    return "<defs>"
      + '<marker id="pl-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
      + 'orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--ink-3)"/></marker>'
      + '<marker id="pl-arg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
      + 'orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--green-600)"/></marker>'
      + "</defs>";
  }

  function svgWrap(h, inner, title) {
    return '<svg viewBox="0 0 ' + W + " " + h + '" role="img" aria-label="' + esc(title) + '">'
      + defs() + inner + "</svg>";
  }

  /* ---------- the three states ---------- */

  function model(picks) {
    var m = { wan: null, sdwan: null, proxy: null, fw: null, ra: null };
    picks.forEach(function (p) {
      if (p.dimension === "wan") m.wan = p.option.label;
      if (p.dimension === "sdwan-vendor") m.sdwan = p.option.label;
      if (p.dimension === "proxy-sse" && p.option.key.indexOf("none") !== 0) m.proxy = p.option.label;
      if (p.dimension === "firewall") m.fw = p.option.label;
      if (p.dimension === "remote-access" && p.option.key.indexOf("none") !== 0) m.ra = p.option.label;
    });
    m.transport = m.sdwan || m.wan || "Existing WAN";
    return m;
  }

  function before(m) {
    var g = "", y = 42;
    g += box({ x: 24, y: y, w: 168, h: 58, label: "Branch sites", sub: "user traffic" });
    g += box({ x: 24, y: y + 84, w: 168, h: 58, label: "Data centre", sub: "private apps" });
    if (m.ra) g += box({ x: 24, y: y + 168, w: 168, h: 58, label: "Remote users", sub: fit(m.ra, 24) });

    g += box({ x: 264, y: y, w: 190, h: 58, kind: "dark", label: m.transport, sub: "backhaul" });
    if (m.ra) g += box({ x: 264, y: y + 168, w: 190, h: 58, kind: "dark", label: "VPN concentrator",
      sub: "at the perimeter" });

    var secY = y + 42;
    var stack = [];
    if (m.proxy) stack.push(m.proxy);
    if (m.fw) stack.push(m.fw);
    if (!stack.length) stack.push("Perimeter security");
    stack.forEach(function (s, i) {
      g += box({ x: 528, y: secY + i * 74, w: 178, h: 58, label: s, sub: i ? "firewall" : "web security" });
    });

    g += box({ x: 748, y: secY + (stack.length - 1) * 37, w: 128, h: 58, label: "Internet", sub: "and SaaS" });

    g += arrow(192, y + 29, 260, y + 29);
    g += arrow(192, y + 113, 264, y + 60, { label: "" });
    if (m.ra) g += arrow(192, y + 197, 260, y + 197);
    g += arrow(454, y + 29, 524, secY + 29);
    if (m.ra) g += arrow(454, y + 197, 524, secY + (stack.length - 1) * 74 + 40);
    stack.forEach(function (s, i) {
      g += arrow(706, secY + i * 74 + 29, 744, secY + (stack.length - 1) * 37 + 29);
    });

    var h = Math.max(y + (m.ra ? 250 : 170), secY + stack.length * 74 + 20);
    return svgWrap(h, g, "Before: traffic backhauled across the existing WAN through a perimeter stack");
  }

  function during(m) {
    var g = "", y = 36;
    g += box({ x: 24, y: y, w: 168, h: 58, kind: "cato", label: "Migrated sites", sub: "wave 1" });
    g += box({ x: 24, y: y + 96, w: 168, h: 58, label: "Remaining sites", sub: "not yet cut over",
      faded: false });
    g += box({ x: 24, y: y + 192, w: 168, h: 58, label: "Data centre", sub: "socket beside the CE" });

    g += box({ x: 300, y: y, w: 200, h: 58, kind: "cato", label: "Cato PoP", sub: "security in the cloud" });
    g += box({ x: 300, y: y + 96, w: 200, h: 58, kind: "dark", label: m.transport, sub: "still carrying" });

    var stack = [];
    if (m.proxy) stack.push(m.proxy);
    if (m.fw) stack.push(m.fw);
    stack.forEach(function (s, i) {
      g += box({ x: 570, y: y + 96 + i * 70, w: 172, h: 54, label: s, sub: "being displaced", faded: true });
    });

    g += box({ x: 748, y: y, w: 128, h: 58, label: "Internet", sub: "and SaaS" });

    g += arrow(192, y + 29, 296, y + 29, { cato: true });
    g += arrow(192, y + 125, 296, y + 125);
    g += arrow(192, y + 221, 300, y + 154, { label: "" });
    g += arrow(500, y + 29, 744, y + 29, { cato: true });
    stack.forEach(function (s, i) {
      g += arrow(500, y + 125, 566, y + 123 + i * 70, { faded: true });
    });
    /* the handoff is the whole co-existence story — draw it as the link it is */
    g += '<line x1="400" y1="' + (y + 58) + '" x2="400" y2="' + (y + 96)
      + '" stroke="var(--green-600)" stroke-width="2.2" stroke-dasharray="5 4"/>'
      + '<text class="dg-tiny" x="410" y="' + (y + 82) + '">eBGP handoff — both paths live</text>';

    return svgWrap(y + 268, g, "During: Cato and the incumbent run side by side across a routed handoff");
  }

  function after(m) {
    var g = "", y = 52;
    g += box({ x: 24, y: y, w: 168, h: 58, label: "All sites", sub: "socket or IPsec" });
    g += box({ x: 24, y: y + 84, w: 168, h: 58, label: "Data centre", sub: "private apps" });
    g += box({ x: 24, y: y + 168, w: 168, h: 58, label: "Remote users", sub: "Cato Client, ZTNA" });

    g += box({ x: 330, y: y + 40, w: 216, h: 96, kind: "cato",
      label: "Cato SASE Cloud", sub: "FWaaS · SWG · CASB · DLP · IPS" });

    g += box({ x: 700, y: y, w: 176, h: 58, label: "Internet", sub: "and SaaS" });
    g += box({ x: 700, y: y + 168, w: 176, h: 58, label: "Private apps", sub: "least-privilege" });

    g += arrow(192, y + 29, 326, y + 74, { cato: true });
    g += arrow(192, y + 113, 326, y + 92, { cato: true });
    g += arrow(192, y + 197, 326, y + 110, { cato: true });
    g += arrow(546, y + 74, 696, y + 29, { cato: true });
    g += arrow(546, y + 110, 696, y + 197, { cato: true });

    return svgWrap(y + 250, g, "After: every site and user reaches the PoP, security enforced in the cloud");
  }

  function scenes(picks) {
    var m = model(picks);
    return [
      { key: "before", title: "Before", caption: "Traffic backhauls across "
          + (m.transport || "the existing WAN") + " to a perimeter stack"
          + (m.ra ? ", and remote users terminate on a concentrator." : "."),
        svg: before(m) },
      { key: "during", title: "During", caption: "Migrated sites ride the PoP while the rest stay on "
          + (m.transport || "the incumbent") + ", reachable across the routed handoff. This is the "
          + "state the wave plan lives in, and the one worth rehearsing.",
        svg: during(m) },
      { key: "after", title: "After", caption: "Every site and user reaches a PoP; inspection happens "
          + "there rather than in a stack you maintain.", svg: after(m) }
    ];
  }

  /* ---------- .drawio export ---------- */

  function cell(id, value, x, y, w, h, style) {
    return '<mxCell id="' + esc(id) + '" value="' + esc(value) + '" style="' + esc(style)
      + '" vertex="1" parent="1"><mxGeometry x="' + x + '" y="' + y + '" width="' + w
      + '" height="' + h + '" as="geometry"/></mxCell>';
  }

  function edge(id, src, tgt, label) {
    return '<mxCell id="' + esc(id) + '" value="' + esc(label || "") + '" style="edgeStyle='
      + 'orthogonalEdgeStyle;rounded=1;html=1;" edge="1" parent="1" source="' + esc(src)
      + '" target="' + esc(tgt) + '"><mxGeometry relative="1" as="geometry"/></mxCell>';
  }

  var S_PLAIN = "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#c9d4d0;";
  var S_CATO = "rounded=1;whiteSpace=wrap;html=1;fillColor=#e6f5ef;strokeColor=#12a380;";
  var S_DARK = "rounded=1;whiteSpace=wrap;html=1;fillColor=#1f2a30;strokeColor=#33434c;fontColor=#ffffff;";

  function page(name, cells) {
    return '<diagram name="' + esc(name) + '"><mxGraphModel dx="900" dy="500" grid="0" '
      + 'page="1" pageWidth="1100" pageHeight="600"><root>'
      + '<mxCell id="0"/><mxCell id="1" parent="0"/>' + cells
      + "</root></mxGraphModel></diagram>";
  }

  function drawio(picks) {
    var m = model(picks), p = [];

    var b = cell("b1", "Branch sites", 40, 60, 170, 60, S_PLAIN)
      + cell("b2", "Data centre", 40, 160, 170, 60, S_PLAIN)
      + cell("b3", m.transport, 300, 60, 200, 60, S_DARK)
      + cell("b4", (m.proxy || "Web security"), 580, 60, 180, 60, S_PLAIN)
      + cell("b5", (m.fw || "Perimeter firewall"), 580, 160, 180, 60, S_PLAIN)
      + cell("b6", "Internet and SaaS", 840, 110, 170, 60, S_PLAIN)
      + edge("be1", "b1", "b3") + edge("be2", "b2", "b3")
      + edge("be3", "b3", "b4") + edge("be4", "b3", "b5")
      + edge("be5", "b4", "b6") + edge("be6", "b5", "b6");
    if (m.ra) {
      b += cell("b7", "Remote users", 40, 260, 170, 60, S_PLAIN)
        + cell("b8", m.ra, 300, 260, 200, 60, S_DARK)
        + edge("be7", "b7", "b8") + edge("be8", "b8", "b5");
    }
    p.push(page("Before", b));

    var d = cell("d1", "Migrated sites (wave 1)", 40, 60, 170, 60, S_CATO)
      + cell("d2", "Remaining sites", 40, 160, 170, 60, S_PLAIN)
      + cell("d3", "Data centre", 40, 260, 170, 60, S_PLAIN)
      + cell("d4", "Cato PoP", 320, 60, 200, 60, S_CATO)
      + cell("d5", m.transport, 320, 180, 200, 60, S_DARK)
      + cell("d6", (m.proxy || m.fw || "Perimeter stack") + " (displacing)", 600, 180, 190, 60, S_PLAIN)
      + cell("d7", "Internet and SaaS", 860, 60, 170, 60, S_PLAIN)
      + edge("de1", "d1", "d4") + edge("de2", "d2", "d5") + edge("de3", "d3", "d5")
      + edge("de4", "d4", "d7") + edge("de5", "d5", "d6")
      + edge("de6", "d4", "d5", "eBGP handoff — both paths live");
    p.push(page("During", d));

    var a = cell("a1", "All sites", 40, 60, 170, 60, S_PLAIN)
      + cell("a2", "Data centre", 40, 160, 170, 60, S_PLAIN)
      + cell("a3", "Remote users", 40, 260, 170, 60, S_PLAIN)
      + cell("a4", "Cato SASE Cloud\nFWaaS · SWG · CASB · DLP · IPS", 340, 130, 230, 110, S_CATO)
      + cell("a5", "Internet and SaaS", 700, 60, 180, 60, S_PLAIN)
      + cell("a6", "Private apps", 700, 260, 180, 60, S_PLAIN)
      + edge("ae1", "a1", "a4") + edge("ae2", "a2", "a4") + edge("ae3", "a3", "a4")
      + edge("ae4", "a4", "a5") + edge("ae5", "a4", "a6");
    p.push(page("After", a));

    return '<mxfile host="cato-use-case-library">' + p.join("") + "</mxfile>";
  }

  window.PlannerTopology = { scenes: scenes, drawio: drawio };
})();
