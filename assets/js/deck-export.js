/* Cato Use Case Library — customer-facing deck export (internal SE tool).

   Builds a real .pptx with no third-party library, the same way planner-export.js
   does: a .pptx is a ZIP of OOXML parts, and a store-only ZIP is a header format
   we can write by hand. The plumbing below is copied (not imported) from
   planner-export.js because that file is stripped from the prospect build.

   Content: window.UC_CATALOG (title / summary / category) + window.UC_DECKS
   (per-id pain / gain / demo / hook, filled in by the assembler in
   assets/js/deck-content.js). Brand media: window.DECK_BRAND (authentic Cato
   lockup PNGs, base64). Everything is file:// safe — no fetch, no CDNs. */
(function () {
  "use strict";

  /* ---------- store-only ZIP (copied from planner-export.js) ---------- */

  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function utf8(str) { return new TextEncoder().encode(str); }

  function b64bytes(b64) {
    var bin = atob(b64), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }

  function zip(files) {
    var enc = files.map(function (f) {
      return { name: utf8(f.name), data: typeof f.data === "string" ? utf8(f.data) : f.data };
    });
    var parts = [], central = [], offset = 0;

    function u16(n) { return [n & 0xFF, (n >>> 8) & 0xFF]; }
    function u32(n) { return [n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF]; }

    enc.forEach(function (f) {
      var crc = crc32(f.data), len = f.data.length;
      var local = [].concat(
        u32(0x04034B50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(len), u32(len), u16(f.name.length), u16(0)
      );
      parts.push(new Uint8Array(local), f.name, f.data);
      central.push([].concat(
        u32(0x02014B50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(len), u32(len), u16(f.name.length),
        u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)
      ));
      offset += local.length + f.name.length + len;
    });

    var cdStart = offset, cd = [];
    central.forEach(function (c, i) {
      cd.push(new Uint8Array(c), enc[i].name);
      offset += c.length + enc[i].name.length;
    });
    var end = new Uint8Array([].concat(
      u32(0x06054B50), u16(0), u16(0), u16(enc.length), u16(enc.length),
      u32(offset - cdStart), u32(cdStart), u16(0)
    ));
    return new Blob(parts.concat(cd, [end]), { type: "application/octet-stream" });
  }

  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
  }

  function safeName(s) {
    return (s || "cato-deck").replace(/[^A-Za-z0-9 _-]+/g, "").trim().replace(/\s+/g, "-") || "cato-deck";
  }

  /* ---------- OOXML ---------- */

  function xesc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var W = 12192000, H = 6858000;          /* 16:9 in EMU */
  var MARGIN = 838200;                    /* side margin */
  var XMLNS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';

  /* Cato palette (mirrors assets/css/style.css tokens) */
  var C = {
    navy950: "051820", navy800: "0C2936",
    green: "12A380", green600: "0E8A6D", green700: "0B6E57",
    ink: "1F2A30", inkDeep: "0D1A16", ink2: "45524D", dim: "51606A",
    hairline: "DDE6E2", chipBg: "EEF3F1", chipGreenBg: "E9F7F2",
    invSub: "B9D2C9", invDim: "8AA39B"
  };

  var LOGO_AR = 988 / 408;                /* DECK_BRAND lockup aspect ratio */
  function logoW(h) { return Math.round(h * LOGO_AR); }

  var nextId = 10;

  /* one text run */
  function run(text, o) {
    o = o || {};
    return '<a:r><a:rPr lang="en-GB" sz="' + (o.sz || 1400) + '"'
      + (o.b ? ' b="1"' : "") + ' dirty="0">'
      + '<a:solidFill><a:srgbClr val="' + (o.color || C.ink) + '"/></a:solidFill></a:rPr>'
      + "<a:t>" + xesc(text) + "</a:t></a:r>";
  }

  /* one paragraph from runs (or a plain string + opts) */
  function paraRuns(runsXml, o) {
    o = o || {};
    var pPr = "<a:pPr";
    if (o.algn) pPr += ' algn="' + o.algn + '"';
    if (o.bullet) pPr += ' marL="228600" indent="-228600"';
    pPr += ">";
    if (o.spcBef) pPr += '<a:spcBef><a:spcPts val="' + o.spcBef + '"/></a:spcBef>';
    pPr += o.bullet
      ? '<a:buClr><a:srgbClr val="' + (o.buColor || C.green600) + '"/></a:buClr><a:buChar char="&#8226;"/>'
      : "<a:buNone/>";
    pPr += "</a:pPr>";
    return "<a:p>" + pPr + runsXml + "</a:p>";
  }

  function para(text, o) { return paraRuns(run(text, o), o); }

  /* text box */
  function box(x, y, cx, cy, parasXml, o) {
    o = o || {};
    nextId++;
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + nextId + '" name="tx' + nextId + '"/>'
      + '<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>'
      + '<p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/>'
      + '<a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>'
      + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
      + '<p:txBody><a:bodyPr wrap="square"' + (o.anchor ? ' anchor="' + o.anchor + '"' : "")
      + ' lIns="0" tIns="0" rIns="0" bIns="0"><a:normAutofit/></a:bodyPr><a:lstStyle/>'
      + parasXml + "</p:txBody></p:sp>";
  }

  /* filled shape (rect / roundRect / ellipse / line) */
  function shape(prst, x, y, cx, cy, fill, line, parasXml, anchor) {
    nextId++;
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + nextId + '" name="sh' + nextId + '"/>'
      + "<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>"
      + '<a:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>'
      + '<a:prstGeom prst="' + prst + '"><a:avLst/></a:prstGeom>'
      + (fill ? '<a:solidFill><a:srgbClr val="' + fill + '"/></a:solidFill>' : "<a:noFill/>")
      + (line ? '<a:ln w="' + (line.w || 9525) + '"><a:solidFill><a:srgbClr val="' + line.color
        + '"/></a:solidFill></a:ln>' : "<a:ln><a:noFill/></a:ln>")
      + "</p:spPr><p:txBody><a:bodyPr" + (anchor ? ' anchor="' + anchor + '"' : "")
      + ' lIns="0" tIns="0" rIns="0" bIns="0"/><a:lstStyle/>'
      + (parasXml || "<a:p/>") + "</p:txBody></p:sp>";
  }

  /* Cato lockup picture — relId comes from the per-slide rels */
  function logo(relId, x, y, h) {
    nextId++;
    return '<p:pic><p:nvPicPr><p:cNvPr id="' + nextId + '" name="cato-lockup"/>'
      + "<p:cNvPicPr/><p:nvPr/></p:nvPicPr>"
      + '<p:blipFill><a:blip r:embed="' + relId + '"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
      + '<p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/>'
      + '<a:ext cx="' + logoW(h) + '" cy="' + h + '"/></a:xfrm>'
      + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>';
  }

  function navyBg() { return shape("rect", 0, 0, W, H, C.navy950); }

  function greenLogoCorner(rels) {
    if (!rels.green) return "";
    var h = 432000;                                       /* ~1.2 cm */
    return logo(rels.green, W - MARGIN - logoW(h), H - 700000, h);
  }

  /* ---------- slide designs ---------- */
  /* Each slide is { brands: [...], build: function(rels, no, total) -> spTree body } */

  function coverSlide(title, sub) {
    return { brands: ["white"], build: function (rels) {
      var body = navyBg();
      if (rels.white) body += logo(rels.white, MARGIN, 600000, 936000);   /* ~2.6 cm */
      body += box(MARGIN, 2450000, W - 2 * MARGIN, 1500000,
        para(title, { sz: 3600, b: true, color: "FFFFFF" }));
      body += shape("rect", MARGIN, 4120000, 1828800, 60960, C.green);    /* accent bar */
      if (sub) body += box(MARGIN, 4360000, W - 2 * MARGIN, 1100000,
        para(sub, { sz: 1500, color: C.invSub }));
      body += box(MARGIN, H - 560000, W - 2 * MARGIN, 350000,
        para("Cato Networks — SASE demonstration", { sz: 1000, color: C.invDim }));
      return body;
    } };
  }

  function agendaSlide(ucs) {
    return { brands: [], build: function () {
      var body = box(MARGIN, 700000, W - 2 * MARGIN, 380000,
        para("AGENDA", { sz: 1100, b: true, color: C.green600 }));
      body += box(MARGIN, 1080000, W - 2 * MARGIN, 700000,
        para("What we'll cover", { sz: 2600, b: true, color: C.ink }));
      var top = 2050000, avail = H - top - 700000;
      var twoCol = ucs.length > 10;
      var colW = twoCol ? Math.floor((W - 2 * MARGIN - 500000) / 2) : W - 2 * MARGIN;
      var perCol = twoCol ? Math.ceil(ucs.length / 2) : ucs.length;
      var cols = twoCol ? [ucs.slice(0, perCol), ucs.slice(perCol)] : [ucs];
      cols.forEach(function (list, ci) {
        var paras = list.map(function (uc, i) {
          var n = ci * perCol + i + 1;
          return paraRuns(
            run(n + "   ", { sz: 1400, b: true, color: C.green600 })
            + run(uc.title, { sz: 1400, color: C.ink })
            + run("   " + uc.category, { sz: 1100, color: C.dim }),
            { spcBef: i ? 700 : 0 });
        }).join("");
        body += box(MARGIN + ci * (colW + 500000), top, colW, avail, paras);
      });
      return body;
    } };
  }

  function dividerSlide(uc, hook) {
    return { brands: ["white"], build: function (rels, no, total) {
      var body = navyBg();
      if (rels.white) body += logo(rels.white, MARGIN, 500000, 500000);
      body += box(MARGIN, 1950000, W - 2 * MARGIN, 400000,
        para(String(uc.category).toUpperCase() + " USE CASE",
          { sz: 1200, b: true, color: C.green }));
      body += box(MARGIN, 2400000, W - 2 * MARGIN, 1500000,
        para(uc.title, { sz: 3000, b: true, color: "FFFFFF" }));
      body += shape("rect", MARGIN, 4050000, 1371600, 50800, C.green);
      if (hook) body += box(MARGIN, 4280000, W - 2 * MARGIN, 1100000,
        para(hook, { sz: 1600, color: C.invSub }));
      body += box(MARGIN, H - 560000, W - 2 * MARGIN, 350000,
        para(no + " / " + total, { sz: 900, color: C.invDim }));
      return body;
    } };
  }

  function chipHeader(x, y, label, bg, color) {
    return shape("roundRect", x, y, 1700000, 380000, bg, null,
      para(label, { sz: 1100, b: true, color: color, algn: "ctr" }), "ctr");
  }

  function whySlide(uc, deck) {
    return { brands: ["green"], build: function (rels) {
      var body = box(MARGIN, 620000, W - 2 * MARGIN, 340000,
        para(String(uc.title).toUpperCase(), { sz: 1000, color: C.dim }));
      body += box(MARGIN, 980000, W - 2 * MARGIN, 700000,
        para("Why this matters", { sz: 2600, b: true, color: C.ink }));

      var top = 1950000, bottom = H - 900000;
      var gap = 520000, colW = Math.floor((W - 2 * MARGIN - gap) / 2);
      var rx = MARGIN + colW + gap;

      /* full-height divider between the columns */
      body += shape("line", MARGIN + colW + Math.floor(gap / 2), top, 0, bottom - top,
        null, { color: C.hairline, w: 12700 });

      body += chipHeader(MARGIN, top, "Today", C.chipBg, C.navy800);
      body += chipHeader(rx, top, "With Cato", C.chipGreenBg, C.green700);

      function bulletBox(x, items, color) {
        var paras = (items || []).map(function (t, i) {
          return para(t, { sz: 1400, color: color, bullet: true, spcBef: i ? 900 : 0 });
        }).join("");
        return paras ? box(x, top + 560000, colW, bottom - top - 560000, paras) : "";
      }
      body += bulletBox(MARGIN, deck.pain, C.ink2);
      body += bulletBox(rx, deck.gain, C.inkDeep);

      body += greenLogoCorner(rels);
      return body;
    } };
  }

  function demoSlide(uc, steps) {
    return { brands: ["green"], build: function (rels) {
      var body = box(MARGIN, 620000, W - 2 * MARGIN, 340000,
        para(String(uc.title).toUpperCase(), { sz: 1000, color: C.dim }));
      body += box(MARGIN, 980000, W - 2 * MARGIN, 600000,
        para("What we'll show", { sz: 2600, b: true, color: C.ink }));
      body += box(MARGIN, 1620000, W - 2 * MARGIN, 380000,
        para("Follow along in the Cato Management Application", { sz: 1300, color: C.dim }));

      var top = 2250000, bottom = H - 850000;
      var rowH = Math.floor((bottom - top) / steps.length);
      var d = 400000;                                     /* number-circle diameter */
      steps.forEach(function (st, i) {
        var y = top + i * rowH;
        body += shape("ellipse", MARGIN, y, d, d, C.green600, null,
          para(String(i + 1), { sz: 1300, b: true, color: "FFFFFF", algn: "ctr" }), "ctr");
        var runs = run(st.area || "CMA", { sz: 1300, b: true, color: C.green700 });
        if (st.show) runs += run("  —  " + st.show, { sz: 1300, color: C.inkDeep });
        body += box(MARGIN + d + 260000, y - 20000, W - 2 * MARGIN - d - 260000,
          Math.max(rowH - 100000, 440000), paraRuns(runs, {}), { anchor: "t" });
      });

      body += greenLogoCorner(rels);
      return body;
    } };
  }

  function closingSlide() {
    return { brands: ["white"], build: function (rels) {
      var body = navyBg();
      var h = 700000;
      if (rels.white) body += logo(rels.white, Math.floor((W - logoW(h)) / 2), 1500000, h);
      body += box(MARGIN, 2800000, W - 2 * MARGIN, 900000,
        para("Thank you", { sz: 4000, b: true, color: "FFFFFF", algn: "ctr" }));
      body += box(MARGIN, 3900000, W - 2 * MARGIN, 800000,
        para("Next step: prove it in your environment — a scoped proof of value with agreed success criteria",
          { sz: 1500, color: C.invSub, algn: "ctr" }));
      body += box(MARGIN, H - 660000, W - 2 * MARGIN, 350000,
        para("catonetworks.com", { sz: 1000, color: C.invDim, algn: "ctr" }));
      return body;
    } };
  }

  /* ---------- package scaffolding (mirrors planner-export.js) ---------- */

  var THEME = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Cato">'
    + "<a:themeElements><a:clrScheme name=\"Cato\">"
    + '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>'
    + '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'
    + '<a:dk2><a:srgbClr val="1F2A30"/></a:dk2><a:lt2><a:srgbClr val="F2F5F4"/></a:lt2>'
    + '<a:accent1><a:srgbClr val="0E8A6D"/></a:accent1><a:accent2><a:srgbClr val="12A380"/></a:accent2>'
    + '<a:accent3><a:srgbClr val="51606A"/></a:accent3><a:accent4><a:srgbClr val="8A97A0"/></a:accent4>'
    + '<a:accent5><a:srgbClr val="E05252"/></a:accent5><a:accent6><a:srgbClr val="FAB219"/></a:accent6>'
    + '<a:hlink><a:srgbClr val="0E8A6D"/></a:hlink><a:folHlink><a:srgbClr val="51606A"/></a:folHlink>'
    + "</a:clrScheme>"
    + '<a:fontScheme name="Cato"><a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/>'
    + '<a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/>'
    + '<a:cs typeface=""/></a:minorFont></a:fontScheme>'
    + '<a:fmtScheme name="Cato">'
    + "<a:fillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill>"
    + '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
    + '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>'
    + '<a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'
    + '<a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'
    + '<a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>'
    + "<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle>"
    + "<a:effectStyle><a:effectLst/></a:effectStyle>"
    + "<a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>"
    + "<a:bgFillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill>"
    + '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
    + '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>'
    + "</a:fmtScheme></a:themeElements></a:theme>";

  var MASTER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + "<p:sldMaster " + XMLNS + "><p:cSld><p:bg><p:bgPr>"
    + '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree>'
    + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
    + "<p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/>"
    + "<a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr>"
    + "</p:spTree></p:cSld><p:clrMap bg1=\"lt1\" tx1=\"dk1\" bg2=\"lt2\" tx2=\"dk2\" accent1=\"accent1\" "
    + 'accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" '
    + 'hlink="hlink" folHlink="folHlink"/>'
    + '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>'
    + "</p:sldMaster>";

  var LAYOUT = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + "<p:sldLayout " + XMLNS + ' type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>'
    + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
    + "<p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/>"
    + "<a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr>"
    + "</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>";

  function slideXml(body) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + "<p:sld " + XMLNS + "><p:cSld><p:spTree>"
      + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
      + "<p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/>"
      + "<a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr>"
      + body
      + "</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>";
  }

  function pptx(slides) {
    var n = slides.length;
    var ids = [], rels = [];
    for (var i = 1; i <= n; i++) {
      ids.push('<p:sldId id="' + (255 + i) + '" r:id="rId' + (i + 1) + '"/>');
      rels.push('<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/'
        + 'officeDocument/2006/relationships/slide" Target="slides/slide' + i + '.xml"/>');
    }

    var files = [
      { name: "[Content_Types].xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Default Extension="png" ContentType="image/png"/>'
        + '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-'
        + 'officedocument.presentationml.presentation.main+xml"/>'
        + '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.'
        + 'openxmlformats-officedocument.presentationml.slideMaster+xml"/>'
        + '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.'
        + 'openxmlformats-officedocument.presentationml.slideLayout+xml"/>'
        + '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-'
        + 'officedocument.theme+xml"/>'
        + slides.map(function (s, i) {
            return '<Override PartName="/ppt/slides/slide' + (i + 1) + '.xml" ContentType="application/'
              + 'vnd.openxmlformats-officedocument.presentationml.slide+xml"/>';
          }).join("")
        + "</Types>" },

      { name: "_rels/.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>' },

      { name: "ppt/presentation.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + "<p:presentation " + XMLNS + ' saveSubsetFonts="1">'
        + '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>'
        + "<p:sldIdLst>" + ids.join("") + "</p:sldIdLst>"
        + '<p:sldSz cx="' + W + '" cy="' + H + '"/><p:notesSz cx="' + H + '" cy="' + W + '"/>'
        + "</p:presentation>" },

      { name: "ppt/_rels/presentation.xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>'
        + rels.join("")
        + '<Relationship Id="rId' + (n + 2) + '" Type="http://schemas.openxmlformats.org/'
        + 'officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>' },

      { name: "ppt/slideMasters/slideMaster1.xml", data: MASTER },
      { name: "ppt/slideMasters/_rels/slideMaster1.xml.rels",
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>'
        + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/theme" Target="../theme/theme1.xml"/></Relationships>' },

      { name: "ppt/slideLayouts/slideLayout1.xml", data: LAYOUT },
      { name: "ppt/slideLayouts/_rels/slideLayout1.xml.rels",
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>' },

      { name: "ppt/theme/theme1.xml", data: THEME }
    ];

    /* Cato lockups become media parts, embedded once per deck */
    var BRAND = window.DECK_BRAND || {};
    var mediaAdded = {};
    slides.forEach(function (s, i) {
      var picRels = {}, extra = "";
      (s.brands || []).forEach(function (b, k) {
        if (!BRAND[b]) return;
        var rid = "rId" + (2 + k);
        picRels[b] = rid;
        extra += '<Relationship Id="' + rid + '" Type="http://schemas.openxmlformats.org/'
          + 'officeDocument/2006/relationships/image" Target="../media/cato-' + b + '.png"/>';
        if (!mediaAdded[b]) {
          mediaAdded[b] = true;
          files.push({ name: "ppt/media/cato-" + b + ".png", data: b64bytes(BRAND[b].png) });
        }
      });
      nextId = 10;
      files.push({ name: "ppt/slides/slide" + (i + 1) + ".xml",
        data: slideXml(s.build(picRels, i + 1, slides.length)) });
      files.push({ name: "ppt/slides/_rels/slide" + (i + 1) + ".xml.rels",
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
          + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
          + 'relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>'
          + extra + "</Relationships>" });
    });

    return zip(files);
  }

  /* ---------- deck assembly ---------- */

  function findUc(id) {
    var cat = window.UC_CATALOG || [];
    for (var i = 0; i < cat.length; i++) if (cat[i].id === id) return cat[i];
    return null;
  }

  /* the three per-use-case slides; defensive against missing deck content */
  function caseSlides(uc) {
    var deck = (window.UC_DECKS || {})[uc.id];
    var out = [dividerSlide(uc, (deck && deck.hook) || uc.summary)];
    if (deck && ((deck.pain && deck.pain.length) || (deck.gain && deck.gain.length))) {
      out.push(whySlide(uc, deck));
    }
    if (deck && deck.demo && deck.demo.length) {
      out.push(demoSlide(uc, deck.demo.slice(0, 5)));
    }
    return out;
  }

  function buildDeck(ids, title) {
    var ucs = [];
    (ids || []).forEach(function (id) {
      var uc = findUc(id);
      if (uc) ucs.push(uc);
    });
    var slides;
    if (ucs.length === 1 && !title) {
      slides = [coverSlide(ucs[0].title, ucs[0].summary)];
    } else {
      var sub = ucs.length === 1 ? ucs[0].summary
        : "A guided walk through " + ucs.length + " use cases in the Cato Management Application";
      slides = [coverSlide(title || "Cato SASE demonstration", sub)];
      if (ucs.length > 1) slides.push(agendaSlide(ucs));
    }
    ucs.forEach(function (uc) { slides = slides.concat(caseSlides(uc)); });
    slides.push(closingSlide());
    return pptx(slides);
  }

  window.DeckExport = {
    forUseCase: function (id) {
      var uc = findUc(id);
      if (!uc) return;
      download(buildDeck([id], null), safeName(uc.title) + ".pptx");
    },
    forSelection: function (ids, title) {
      if (!ids || !ids.length) return;
      var name = title || "Cato SASE demonstration";
      download(buildDeck(ids, name), safeName(name) + ".pptx");
    },
    _blob: buildDeck            /* exposed for the verify harness */
  };

  /* ---------- page wiring (internal SE library only) ---------- */

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  /* use-case page: deck button in the hero */
  function wireUseCasePage() {
    var id = document.body.getAttribute("data-uc");
    if (!id || !findUc(id) || !(window.UC_DECKS || {})[id]) return;
    var hero = document.querySelector(".hero .hero-inner");
    if (!hero) return;
    var rows = hero.querySelectorAll(".meta-row");
    var row = rows.length ? rows[rows.length - 1] : null;
    if (!row) {
      row = el("div", { "class": "meta-row" });
      hero.appendChild(row);
    }
    var btn = el("button", { type: "button", "class": "btn btn-ghost" }, "📽 Intro deck (.pptx)");
    btn.addEventListener("click", function () { window.DeckExport.forUseCase(id); });
    row.appendChild(btn);
  }

  /* index page: deck builder card */
  function wireIndexBuilder() {
    var sections = document.getElementById("uc-sections");
    var cat = window.UC_CATALOG;
    if (!sections || !cat || !cat.length) return;
    var grid = document.querySelector(".grid-2");
    if (!grid || !grid.parentNode) return;

    var card = el("section", { "class": "card deck-builder", "aria-label": "Build a demo presentation" });
    var h = el("h3", {}, "🎞 Build a demo presentation");
    var lede = el("p", { "class": "deck-builder-lede" },
      "Pick the use cases for this prospect — get one concise branded deck that walks the demo.");
    card.appendChild(h);
    card.appendChild(lede);

    var details = el("details", { "class": "deck-picker" });
    var summary = el("summary", {}, "Choose use cases");
    details.appendChild(summary);
    var listWrap = el("div", { "class": "deck-picker-list" });

    var CATS = [];
    cat.forEach(function (uc) { if (CATS.indexOf(uc.category) < 0) CATS.push(uc.category); });
    CATS.forEach(function (c) {
      var group = el("div", { "class": "deck-picker-group" });
      group.appendChild(el("div", { "class": "deck-picker-cat" }, c));
      cat.forEach(function (uc) {
        if (uc.category !== c) return;
        var label = el("label", { "class": "deck-picker-item" });
        var cb = el("input", { type: "checkbox", value: uc.id });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + uc.title));
        group.appendChild(label);
      });
      listWrap.appendChild(group);
    });
    details.appendChild(listWrap);
    card.appendChild(details);

    var actions = el("div", { "class": "deck-builder-actions" });
    var input = el("input", {
      type: "text", id: "deck-title", "class": "deck-title-input",
      placeholder: "Cato SASE demonstration", "aria-label": "Deck title"
    });
    var count = el("span", { "class": "deck-count", "aria-live": "polite" }, "0 selected");
    var go = el("button", { type: "button", "class": "btn btn-primary", disabled: "" },
      "Generate presentation (.pptx)");
    actions.appendChild(input);
    actions.appendChild(count);
    actions.appendChild(go);
    card.appendChild(actions);

    function selected() {
      var ids = [];
      var boxes = listWrap.querySelectorAll("input[type=checkbox]");
      for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) ids.push(boxes[i].value);
      /* selection order = catalog order */
      return cat.map(function (uc) { return uc.id; }).filter(function (id) {
        return ids.indexOf(id) >= 0;
      });
    }

    listWrap.addEventListener("change", function () {
      var n = selected().length;
      count.textContent = n + " selected";
      if (n) go.removeAttribute("disabled"); else go.setAttribute("disabled", "");
    });

    go.addEventListener("click", function () {
      var ids = selected();
      if (!ids.length) return;
      window.DeckExport.forSelection(ids, input.value.replace(/^\s+|\s+$/g, ""));
    });

    grid.parentNode.insertBefore(card, grid.nextSibling);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.UC_CATALOG || !window.DECK_BRAND) return;
    if (document.getElementById("uc-sections")) wireIndexBuilder();
    else wireUseCasePage();
  });
})();
