/* Cato Use Case Library — Migration Planner topology diagrams (internal).

   Before / during / after, generated from the same selections that drive the plan, in the
   design language of the Cato HLD diagrams: colour-semantic boxes (green = Cato/migrated,
   navy = incumbent still carrying traffic, amber = being displaced, purple = internet/SaaS,
   dashed blue = identity & telemetry), capability chips inside the SASE cloud, labelled
   arrows and a legend. Inline SVG on pt- and dg- classes so the theme (including dark
   mode) is inherited with no image assets.

   Also serialises the same model to .drawio XML (mxGraphModel is plain XML), so the
   diagram can be opened and edited in diagrams.net rather than only screenshotted. */
(function () {
  "use strict";

  var W = 940;
  var BLUE = "#4285c8";      /* identity & telemetry — readable on light and dark */

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

  /* Vendor labels carry a parenthetical the diagram has no room for. */
  function short(s) { return String(s || "").replace(/\s*\(.*$/, ""); }

  var TITLE = { "pt-green": "pt-t-green", "pt-cloud": "pt-t-green", "pt-navy": "pt-t-inv",
    "pt-plain": "pt-t-ink", "pt-amber": "pt-t-amber", "pt-purple": "pt-t-purple",
    "pt-bluedash": "pt-t-blue" };

  function box(n) {
    var cls = n.cls || "pt-plain";
    var tc = TITLE[cls] || "pt-t-ink";
    var sc = cls === "pt-navy" ? "pt-sub-inv" : "pt-sub";
    var h = n.h || 56, cx = n.x + n.w / 2;
    var tmax = Math.floor((n.w - 18) / 7), smax = Math.floor((n.w - 14) / 5.9);
    var o = n.faded ? ' opacity="0.45"' : "";
    var s = "<g" + o + '><rect class="' + cls + '" x="' + n.x + '" y="' + n.y + '" width="' + n.w
      + '" height="' + h + '" rx="10"/>';
    if (n.sub) {
      s += '<text class="' + tc + '" x="' + cx + '" y="' + (n.y + h / 2 - 4)
        + '" text-anchor="middle">' + esc(fit(n.title, tmax)) + "</text>";
      s += '<text class="' + sc + '" x="' + cx + '" y="' + (n.y + h / 2 + 14)
        + '" text-anchor="middle">' + esc(fit(n.sub, smax)) + "</text>";
    } else {
      s += '<text class="' + tc + '" x="' + cx + '" y="' + (n.y + h / 2 + 5)
        + '" text-anchor="middle">' + esc(fit(n.title, tmax)) + "</text>";
    }
    return s + "</g>";
  }

  function chip(x, y, w, label) {
    return '<rect class="pt-chip" x="' + x + '" y="' + y + '" width="' + w + '" height="22" rx="6"/>'
      + '<text class="pt-chip-t" x="' + (x + w / 2) + '" y="' + (y + 15)
      + '" text-anchor="middle">' + esc(label) + "</text>";
  }

  function arrow(x1, y1, x2, y2, opts) {
    opts = opts || {};
    var stroke = opts.cato ? "var(--green-600)" : (opts.blue ? BLUE : "var(--ink-3)");
    var mk = opts.cato ? "pl-arg" : (opts.blue ? "pl-arb" : "pl-ar");
    var dash = (opts.dash || opts.blue) ? ' stroke-dasharray="5 4"' : "";
    var o = opts.faded ? ' opacity="0.4"' : "";
    var s = "<g" + o + '><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2
      + '" stroke="' + stroke + '" stroke-width="' + (opts.cato ? 2.4 : 1.6) + '"' + dash
      + ' marker-end="url(#' + mk + ')"/>';
    if (opts.label) {
      s += '<text class="dg-tiny" x="' + ((x1 + x2) / 2 + (opts.dx || 0)) + '" y="'
        + ((y1 + y2) / 2 - 7 + (opts.dy || 0))
        + '" text-anchor="middle">' + esc(opts.label) + "</text>";
    }
    return s + "</g>";
  }

  /* A row of PoP rings joined by the backbone — the platform, not a site. */
  function pops(cx, cy, n, gap) {
    var w = (n - 1) * gap, x0 = cx - w / 2;
    var s = '<line x1="' + x0 + '" y1="' + cy + '" x2="' + (x0 + w) + '" y2="' + cy
      + '" stroke="var(--green-300)" stroke-width="1.6" stroke-dasharray="2 4"/>';
    for (var i = 0; i < n; i++) {
      s += '<circle class="pt-pop" cx="' + (x0 + i * gap) + '" cy="' + cy + '" r="8"/>';
    }
    return s;
  }

  function legend(items, y) {
    var s = "", x = 30;
    items.forEach(function (it) {
      var stroke = it.cato ? "var(--green-600)" : (it.blue ? BLUE : "var(--ink-3)");
      s += '<line x1="' + x + '" y1="' + (y - 4) + '" x2="' + (x + 26) + '" y2="' + (y - 4)
        + '" stroke="' + stroke + '" stroke-width="2.2"'
        + (it.dash ? ' stroke-dasharray="5 4"' : "") + "/>";
      s += '<text class="dg-tiny" x="' + (x + 33) + '" y="' + y + '">' + esc(it.label) + "</text>";
      x += 33 + it.label.length * 5.6 + 26;
    });
    return s;
  }

  function defs() {
    return "<defs>"
      + '<marker id="pl-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
      + 'orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--ink-3)"/></marker>'
      + '<marker id="pl-arg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
      + 'orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--green-600)"/></marker>'
      + '<marker id="pl-arb" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
      + 'orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="' + BLUE + '"/></marker>'
      + "</defs>";
  }

  function svgWrap(h, inner, title) {
    return '<svg viewBox="0 0 ' + W + " " + h + '" role="img" aria-label="' + esc(title) + '">'
      + defs() + inner + "</svg>";
  }

  /* ---------- the model ---------- */

  function model(picks) {
    var m = { wan: null, sdwan: null, proxy: null, fw: null, ra: null, caps: [] };
    var sec = {};
    picks.forEach(function (p) {
      if (p.dimension === "wan") m.wan = p.option.label;
      if (p.dimension === "sdwan-vendor") m.sdwan = p.option.label;
      if (p.dimension === "proxy-sse" && p.option.key.indexOf("none") !== 0) m.proxy = p.option.label;
      if (p.dimension === "firewall") m.fw = p.option.label;
      if (p.dimension === "remote-access" && p.option.key.indexOf("none") !== 0) m.ra = p.option.label;
      if (p.dimension === "security-controls") sec[p.option.key] = true;
    });
    m.transport = short(m.sdwan || m.wan || "Existing WAN");
    /* what the SASE cloud enforces for THIS estate — FWaaS and SWG are the floor */
    m.caps = ["FWaaS", "SWG"];
    if (m.ra) m.caps.push("ZTNA");
    if (sec["tls-inspection"]) m.caps.push("TLSi");
    if (sec["threat-prevention-ips"]) m.caps.push("IPS");
    if (sec["casb"]) m.caps.push("CASB");
    if (sec["dlp"]) m.caps.push("DLP");
    if (sec["rbi"]) m.caps.push("RBI");
    if (sec["sandboxing"]) m.caps.push("Sandboxing");
    m.caps = m.caps.slice(0, 8);
    return m;
  }

  /* ---------- the three states ---------- */

  function before(m) {
    var g = "", y = 26;
    g += box({ x: 24, y: y, w: 192, cls: "pt-plain", title: "Branch sites",
      sub: "backhauled over " + fit(m.transport, 16) });
    g += box({ x: 24, y: y + 88, w: 192, cls: "pt-plain", title: "Data centre",
      sub: "private apps & shared services" });
    if (m.ra) g += box({ x: 24, y: y + 176, w: 192, cls: "pt-plain", title: "Remote users",
      sub: short(m.ra) });

    g += box({ x: 288, y: y + 44, w: 204, cls: "pt-navy", title: m.transport,
      sub: "hub-and-spoke backhaul" });
    if (m.ra) g += box({ x: 288, y: y + 176, w: 204, cls: "pt-navy", title: "VPN concentrator",
      sub: "at the perimeter" });

    var stack = [];
    if (m.proxy) stack.push({ t: short(m.proxy), s: "web proxy / SSE" });
    if (m.fw) stack.push({ t: short(m.fw), s: "perimeter firewall" });
    if (!stack.length) stack.push({ t: "Perimeter security", s: "at the data centre" });
    var secY = y + (stack.length > 1 ? 14 : 44);
    stack.forEach(function (s, i) {
      g += box({ x: 560, y: secY + i * 76, w: 194, cls: "pt-amber", title: s.t, sub: s.s });
    });
    var secMid = secY + ((stack.length - 1) * 76 + 56) / 2;

    g += box({ x: 812, y: secMid - 28, w: 106, cls: "pt-purple", title: "Internet", sub: "and SaaS" });

    g += arrow(216, y + 28, 284, y + 60, { label: "site traffic", dy: -4 });
    g += arrow(216, y + 116, 284, y + 92);
    g += arrow(492, y + 72, 556, secMid - (stack.length > 1 ? 30 : 0),
      { label: "hairpin to the stack", dx: 16, dy: stack.length > 1 ? 10 : -2 });
    if (m.ra) {
      g += arrow(216, y + 204, 284, y + 204, { label: "client VPN", dy: -2 });
      g += arrow(492, y + 204, 556, secY + (stack.length - 1) * 76 + 34);
    }
    stack.forEach(function (s, i) {
      g += arrow(754, secY + i * 76 + 28, 808, secMid, { label: i === 0 ? "egress" : "", dy: -2 });
    });

    var h = Math.max(y + (m.ra ? 258 : 172), secY + stack.length * 76 + 10) + 16;
    return svgWrap(h, g, "Before: traffic backhauled across the existing WAN through a perimeter stack");
  }

  function during(m) {
    var g = "", y = 26;
    g += box({ x: 24, y: y, w: 192, cls: "pt-green", title: "Migrated sites",
      sub: "riding the Cato backbone" });
    g += box({ x: 24, y: y + 122, w: 192, cls: "pt-plain", title: "Remaining sites",
      sub: "still on " + fit(m.transport, 18) });
    g += box({ x: 24, y: y + 210, w: 192, cls: "pt-plain", title: "Data centre",
      sub: "Socket beside the CE" });

    g += box({ x: 288, y: y, w: 244, h: 90, cls: "pt-cloud", title: "", sub: "" });
    g += '<text class="pt-t-green" x="' + (288 + 122) + '" y="' + (y + 24)
      + '" text-anchor="middle">Cato SASE Cloud</text>'
      + '<text class="pt-sub" x="' + (288 + 122) + '" y="' + (y + 42)
      + '" text-anchor="middle">inspection at the PoP</text>'
      + pops(288 + 122, y + 66, 3, 44);
    g += box({ x: 288, y: y + 154, w: 244, cls: "pt-navy", title: m.transport,
      sub: "carrying the rest" });

    var stack = [];
    if (m.proxy) stack.push({ t: short(m.proxy), s: "being displaced" });
    if (m.fw) stack.push({ t: short(m.fw), s: "being displaced" });
    if (!stack.length) stack.push({ t: "Perimeter stack", s: "being displaced" });
    stack.forEach(function (s, i) {
      g += box({ x: 600, y: y + 128 + i * 76, w: 188, cls: "pt-amber", title: s.t, sub: s.s });
    });

    g += box({ x: 826, y: y + 8, w: 96, cls: "pt-purple", title: "Internet", sub: "and SaaS" });

    g += arrow(216, y + 28, 284, y + 34, { cato: true, label: "via the Socket", dy: -4 });
    g += arrow(216, y + 150, 284, y + 176);
    g += arrow(216, y + 238, 288, y + 200);
    g += arrow(532, y + 34, 822, y + 34, { cato: true, label: "inspected egress at the PoP", dy: -2 });
    g += arrow(532, y + 182, 596, y + 158, { label: "PAC / policy still steers", dy: -6 });
    if (stack.length > 1) g += arrow(532, y + 190, 596, y + 232);
    g += arrow(694, y + 124, 860, y + 68, { label: "legacy egress", dx: 30, dy: 6 });
    /* the handoff is the whole co-existence story — draw it as the link it is */
    g += '<line x1="410" y1="' + (y + 90) + '" x2="410" y2="' + (y + 150)
      + '" stroke="var(--green-600)" stroke-width="2.2" stroke-dasharray="5 4"/>'
      + '<text class="dg-tiny" x="422" y="' + (y + 124) + '">eBGP handoff — both paths live</text>';

    var h = y + 210 + 56 + 16;
    g += legend([
      { label: "Cato path", cato: true },
      { label: "legacy path" },
      { label: "routed handoff — both live", cato: true, dash: true }
    ], h + 4);
    return svgWrap(h + 18, g, "During: Cato and the incumbent run side by side across a routed handoff");
  }

  function after(m) {
    var g = "", y = 26;
    g += box({ x: 24, y: y + 22, w: 196, cls: "pt-green", title: "Sites — branch & DC",
      sub: "Socket / vSocket edges" });
    g += box({ x: 24, y: y + 124, w: 196, cls: "pt-green", title: "Remote users",
      sub: "Cato Client / clientless" });

    /* the platform: PoP rings on the backbone, then what it enforces for this estate */
    var cx = 300, cw = 320, ch = 176;
    g += box({ x: cx, y: y, w: cw, h: ch, cls: "pt-cloud", title: "", sub: "" });
    g += '<text class="pt-t-big" x="' + (cx + cw / 2) + '" y="' + (y + 26)
      + '" text-anchor="middle">Cato SASE Cloud</text>'
      + '<text class="pt-sub" x="' + (cx + cw / 2) + '" y="' + (y + 44)
      + '" text-anchor="middle">single-pass inspection at every PoP</text>'
      + pops(cx + cw / 2, y + 68, 4, 52)
      + '<text class="dg-tiny" x="' + (cx + cw / 2) + '" y="' + (y + 92)
      + '" text-anchor="middle">private backbone</text>';
    var row1 = m.caps.slice(0, 4), row2 = m.caps.slice(4);
    var chw = 66, gap = 8;
    var rx = cx + (cw - (row1.length * chw + (row1.length - 1) * gap)) / 2;
    row1.forEach(function (c, i) { g += chip(rx + i * (chw + gap), y + 104, chw, c); });
    if (row2.length) {
      rx = cx + (cw - (row2.length * chw + (row2.length - 1) * gap)) / 2;
      row2.forEach(function (c, i) { g += chip(rx + i * (chw + gap), y + 134, chw, c); });
    }

    g += box({ x: 700, y: y + 22, w: 218, cls: "pt-purple", title: "Internet & SaaS",
      sub: "egress at the optimal PoP" });
    g += box({ x: 700, y: y + 124, w: 218, cls: "pt-green", title: "Private applications",
      sub: "datacentre & IaaS" });

    g += arrow(220, y + 50, 296, y + 62, { cato: true, label: "to the optimal PoP", dy: -6 });
    g += arrow(220, y + 152, 296, y + 128, { cato: true, label: "Cato Client tunnel", dy: 14 });
    g += arrow(620, y + 62, 696, y + 50, { cato: true, label: "inspected egress", dy: -6 });
    g += arrow(620, y + 128, 696, y + 152, { cato: true, label: "over the backbone", dy: 14 });

    /* identity and telemetry ride a different rail to the traffic */
    var by = y + ch + 40;
    g += box({ x: cx, y: by, w: 152, h: 50, cls: "pt-bluedash", title: "Identity provider",
      sub: "SSO · SCIM" });
    g += box({ x: cx + 168, y: by, w: 152, h: 50, cls: "pt-bluedash", title: "SIEM / logging",
      sub: "events & audit export" });
    g += arrow(cx + 76, by - 4, cx + 96, y + ch + 4, { blue: true });
    g += arrow(cx + 224, y + ch + 4, cx + 244, by - 4, { blue: true });

    var h = by + 50 + 18;
    g += legend([
      { label: "user & application traffic", cato: true },
      { label: "identity & telemetry", blue: true, dash: true }
    ], h + 4);
    return svgWrap(h + 18, g, "After: every site and user reaches the PoP, security enforced in the cloud");
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
      { key: "after", title: "After", caption: "Every site and user reaches a PoP; "
          + m.caps.join(", ") + " are enforced there rather than in a stack you maintain.",
        svg: after(m) }
    ];
  }

  /* ---------- .drawio export ---------- */

  function cell(id, value, x, y, w, h, style) {
    return '<mxCell id="' + esc(id) + '" value="' + esc(value) + '" style="' + esc(style)
      + '" vertex="1" parent="1"><mxGeometry x="' + x + '" y="' + y + '" width="' + w
      + '" height="' + h + '" as="geometry"/></mxCell>';
  }

  function edge(id, src, tgt, label, style) {
    return '<mxCell id="' + esc(id) + '" value="' + esc(label || "") + '" style="edgeStyle='
      + 'orthogonalEdgeStyle;rounded=1;html=1;' + (style || "") + '" edge="1" parent="1" source="'
      + esc(src) + '" target="' + esc(tgt) + '"><mxGeometry relative="1" as="geometry"/></mxCell>';
  }

  var S_BASE = "rounded=1;whiteSpace=wrap;html=1;verticalAlign=middle;fontSize=12;";
  var S_PLAIN = S_BASE + "fillColor=#fbfdfc;strokeColor=#b9c6c1;fontColor=#0d1a16;";
  var S_GREEN = S_BASE + "fillColor=#e9f7f2;strokeColor=#6cc9ae;fontColor=#0b6e57;fontStyle=1;";
  var S_CLOUD = S_BASE + "fillColor=#eef8f4;strokeColor=#0e8a6d;strokeWidth=2;fontColor=#0b6e57;fontStyle=1;fontSize=14;";
  var S_NAVY = S_BASE + "fillColor=#0c2936;strokeColor=#123849;fontColor=#eaf6f1;fontStyle=1;";
  var S_AMBER = S_BASE + "fillColor=#fdf6e9;strokeColor=#d99a2b;fontColor=#9a6a12;fontStyle=1;";
  var S_PURPLE = S_BASE + "fillColor=#f5f1fa;strokeColor=#8661c5;fontColor=#5b3f94;fontStyle=1;";
  var S_BLUED = S_BASE + "fillColor=none;strokeColor=#2f6fb2;dashed=1;fontColor=#2f6fb2;fontStyle=1;";
  var E_CATO = "strokeColor=#0e8a6d;strokeWidth=2;fontSize=10;";
  var E_GREY = "strokeColor=#6f7d77;fontSize=10;";
  var E_BLUE = "strokeColor=#2f6fb2;dashed=1;fontSize=10;";

  function page(name, cells) {
    return '<diagram name="' + esc(name) + '"><mxGraphModel dx="900" dy="500" grid="0" '
      + 'page="1" pageWidth="1100" pageHeight="640"><root>'
      + '<mxCell id="0"/><mxCell id="1" parent="0"/>' + cells
      + "</root></mxGraphModel></diagram>";
  }

  function drawio(picks) {
    var m = model(picks), p = [];

    var b = cell("b1", "Branch sites\nbackhauled over " + m.transport, 40, 60, 180, 60, S_PLAIN)
      + cell("b2", "Data centre\nprivate apps & shared services", 40, 160, 180, 60, S_PLAIN)
      + cell("b3", m.transport + "\nhub-and-spoke backhaul", 300, 100, 200, 60, S_NAVY)
      + cell("b4", (m.proxy ? short(m.proxy) : "Perimeter security") + "\nweb proxy / SSE", 580, 60, 190, 60, S_AMBER)
      + cell("b5", (m.fw ? short(m.fw) : "Perimeter firewall") + "\nperimeter firewall", 580, 160, 190, 60, S_AMBER)
      + cell("b6", "Internet\nand SaaS", 850, 110, 150, 60, S_PURPLE)
      + edge("be1", "b1", "b3", "site traffic", E_GREY) + edge("be2", "b2", "b3", "", E_GREY)
      + edge("be3", "b3", "b4", "hairpin to the stack", E_GREY) + edge("be4", "b3", "b5", "", E_GREY)
      + edge("be5", "b4", "b6", "egress", E_GREY) + edge("be6", "b5", "b6", "", E_GREY);
    if (m.ra) {
      b += cell("b7", "Remote users\n" + short(m.ra), 40, 260, 180, 60, S_PLAIN)
        + cell("b8", "VPN concentrator\nat the perimeter", 300, 260, 200, 60, S_NAVY)
        + edge("be7", "b7", "b8", "client VPN", E_GREY) + edge("be8", "b8", "b5", "", E_GREY);
    }
    p.push(page("Before", b));

    var d = cell("d1", "Migrated sites\nriding the Cato backbone", 40, 60, 190, 60, S_GREEN)
      + cell("d2", "Remaining sites\nstill on " + m.transport, 40, 180, 190, 60, S_PLAIN)
      + cell("d3", "Data centre\nSocket beside the CE", 40, 280, 190, 60, S_PLAIN)
      + cell("d4", "Cato SASE Cloud\ninspection at the PoP", 320, 40, 230, 80, S_CLOUD)
      + cell("d5", m.transport + "\ncarrying the rest", 320, 200, 230, 60, S_NAVY)
      + cell("d6", (m.proxy ? short(m.proxy) : (m.fw ? short(m.fw) : "Perimeter stack"))
          + "\nbeing displaced", 620, 200, 190, 60, S_AMBER)
      + cell("d7", "Internet\nand SaaS", 880, 40, 150, 60, S_PURPLE)
      + edge("de1", "d1", "d4", "via the Socket", E_CATO)
      + edge("de2", "d2", "d5", "", E_GREY) + edge("de3", "d3", "d5", "", E_GREY)
      + edge("de4", "d4", "d7", "inspected egress at the PoP", E_CATO)
      + edge("de5", "d5", "d6", "PAC / policy still steers", E_GREY)
      + edge("de7", "d6", "d7", "legacy egress", E_GREY)
      + edge("de6", "d4", "d5", "eBGP handoff — both paths live", E_CATO + "dashed=1;");
    p.push(page("During", d));

    var a = cell("a1", "Sites — branch & DC\nSocket / vSocket edges", 40, 80, 190, 60, S_GREEN)
      + cell("a2", "Remote users\nCato Client / clientless", 40, 200, 190, 60, S_GREEN)
      + cell("a4", "Cato SASE Cloud\nsingle-pass inspection at every PoP\n\n"
          + m.caps.join(" · "), 320, 80, 260, 140, S_CLOUD)
      + cell("a5", "Internet & SaaS\negress at the optimal PoP", 680, 80, 200, 60, S_PURPLE)
      + cell("a6", "Private applications\ndatacentre & IaaS", 680, 200, 200, 60, S_GREEN)
      + cell("a7", "Identity provider\nSSO · SCIM", 320, 280, 150, 50, S_BLUED)
      + cell("a8", "SIEM / logging\nevents & audit export", 490, 280, 160, 50, S_BLUED)
      + edge("ae1", "a1", "a4", "to the optimal PoP", E_CATO)
      + edge("ae2", "a2", "a4", "Cato Client tunnel", E_CATO)
      + edge("ae3", "a4", "a5", "inspected egress", E_CATO)
      + edge("ae4", "a4", "a6", "over the backbone", E_CATO)
      + edge("ae5", "a7", "a4", "", E_BLUE) + edge("ae6", "a4", "a8", "", E_BLUE);
    p.push(page("After", a));

    return '<mxfile host="cato-use-case-library">' + p.join("") + "</mxfile>";
  }

  window.PlannerTopology = { scenes: scenes, drawio: drawio };
})();
