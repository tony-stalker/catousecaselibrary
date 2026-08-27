/* Cato Use Case Library — Migration Planner exports (internal).

   Produces a real .pptx with no third-party library: a .pptx is a ZIP of OOXML parts,
   and a ZIP with no compression is a header format we can write by hand. That keeps the
   library dependency-free and file:// safe, which a CDN-loaded deck builder would not be.

   Also emits .drawio XML, which is likewise just XML — open it in diagrams.net to edit. */
(function () {
  "use strict";

  /* ---------- store-only ZIP ---------- */

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

  /* ---------- OOXML ---------- */

  function xesc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var W = 12192000, H = 6858000;          /* 16:9 in EMU */
  var XMLNS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';

  function tx(id, name, x, y, cx, cy, paras) {
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="' + xesc(name) + '"/>'
      + "<p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>"
      + '<p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/>'
      + '<a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>'
      + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>'
      + "<p:txBody><a:bodyPr wrap=\"square\"><a:normAutofit/></a:bodyPr><a:lstStyle/>"
      + paras + "</p:txBody></p:sp>";
  }

  function para(text, opts) {
    opts = opts || {};
    var pPr = '<a:pPr' + (opts.lvl ? ' lvl="' + opts.lvl + '"' : "")
      + (opts.bullet === false ? '><a:buNone/>' : ' marL="228600" indent="-228600"><a:buChar char="•"/>')
      + "</a:pPr>";
    var rPr = '<a:rPr lang="en-GB" sz="' + (opts.sz || 1400) + '"'
      + (opts.b ? ' b="1"' : "") + ' dirty="0">'
      + '<a:solidFill><a:srgbClr val="' + (opts.color || "1F2A30") + '"/></a:solidFill></a:rPr>';
    return "<a:p>" + pPr + "<a:r>" + rPr + "<a:t>" + xesc(text) + "</a:t></a:r></a:p>";
  }

  /* Topology diagrams as native DrawingML. The on-screen deck draws them as SVG; a slide
     model can carry the same shapes (rect / line / text, extracted from the live SVG DOM)
     and they render here as real PowerPoint shapes rather than a caption with no picture. */
  /* [fill, stroke, dash?, strokeWidthPx?] — null fill means noFill */
  var DG_FILL = {
    "dg-node": ["FFFFFF", "DDE6E2"], "dg-node-dark": ["0C2936", "123849"],
    "dg-node-green": ["E9F7F2", "6CC9AE"],
    "pt-green": ["E9F7F2", "6CC9AE"], "pt-cloud": ["EEF8F4", "0E8A6D", 0, 2],
    "pt-navy": ["0C2936", "123849"], "pt-plain": ["FBFDFC", "B9C6C1"],
    "pt-amber": ["FDF6E9", "D99A2B"], "pt-purple": ["F5F1FA", "8661C5"],
    "pt-bluedash": ["FFFFFF", "2F6FB2", 1, 1.5], "pt-chip": ["FFFFFF", "6CC9AE", 0, 1.2],
    "pt-pop": [null, "0E8A6D", 0, 4.5]
  };
  /* [colour, bold, fontPx] */
  var DG_INK = {
    "dg-label": ["0D1A16", 1, 14.5], "dg-sub": ["45524D", 0, 12.5],
    "dg-tiny": ["6F7D77", 0, 11], "dg-label-inv": ["EAF6F1", 1, 14.5],
    "dg-sub-inv": ["B9D2C9", 0, 12.5],
    "pt-t-green": ["0B6E57", 1, 13.5], "pt-t-ink": ["0D1A16", 1, 13.5],
    "pt-t-inv": ["EAF6F1", 1, 13.5], "pt-t-amber": ["9A6A12", 1, 13.5],
    "pt-t-purple": ["5B3F94", 1, 13.5], "pt-t-blue": ["2F6FB2", 1, 13.5],
    "pt-t-big": ["0B6E57", 1, 16], "pt-sub": ["45524D", 0, 11.5],
    "pt-sub-inv": ["B9D2C9", 0, 11.5], "pt-chip-t": ["0B6E57", 1, 10]
  };

  function diagramXml(d) {
    var ax = 838200, ay = 2350000, aw = W - 1676400, ah = H - ay - 750000;
    var sc = Math.min(aw / d.w, ah / d.h);
    var ox = ax + (aw - d.w * sc) / 2, oy = ay + (ah - d.h * sc) / 2;
    function X(v) { return Math.round(ox + v * sc); }
    function Y(v) { return Math.round(oy + v * sc); }
    function E(v) { return Math.max(1, Math.round(v * sc)); }
    var out = "", id = 100;

    d.shapes.forEach(function (sh) {
      id++;
      var alpha = sh.faded ? '<a:alpha val="38000"/>' : "";
      if (sh.t === "rect" || sh.t === "circle") {
        var f = DG_FILL[sh.cls] || DG_FILL["dg-node"];
        var rx0 = sh.t === "circle" ? sh.cx - sh.r : sh.x, ry0 = sh.t === "circle" ? sh.cy - sh.r : sh.y;
        var rw = sh.t === "circle" ? sh.r * 2 : sh.w, rh = sh.t === "circle" ? sh.r * 2 : sh.h;
        out += '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="dg-r' + id + '"/>'
          + "<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>"
          + '<a:xfrm><a:off x="' + X(rx0) + '" y="' + Y(ry0) + '"/>'
          + '<a:ext cx="' + E(rw) + '" cy="' + E(rh) + '"/></a:xfrm>'
          + (sh.t === "circle"
            ? '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>'
            : '<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 14000"/></a:avLst></a:prstGeom>')
          + (f[0] ? '<a:solidFill><a:srgbClr val="' + f[0] + '">' + alpha + "</a:srgbClr></a:solidFill>" : "<a:noFill/>")
          + '<a:ln w="' + Math.max(9525, E(f[3] || 1.5)) + '"><a:solidFill><a:srgbClr val="' + f[1] + '">' + alpha
          + "</a:srgbClr></a:solidFill>" + (f[2] ? '<a:prstDash val="dash"/>' : "") + "</a:ln></p:spPr>"
          + "<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>";
      } else if (sh.t === "line") {
        var col = sh.green ? "0E8A6D" : (sh.blue ? "2F6FB2" : "6F7D77");
        var fl = (sh.x1 > sh.x2 ? ' flipH="1"' : "") + (sh.y1 > sh.y2 ? ' flipV="1"' : "");
        out += '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="dg-l' + id + '"/>'
          + "<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>"
          + "<a:xfrm" + fl + '><a:off x="' + Math.min(X(sh.x1), X(sh.x2)) + '" y="' + Math.min(Y(sh.y1), Y(sh.y2)) + '"/>'
          + '<a:ext cx="' + Math.abs(X(sh.x2) - X(sh.x1)) + '" cy="' + Math.abs(Y(sh.y2) - Y(sh.y1)) + '"/></a:xfrm>'
          + '<a:prstGeom prst="line"><a:avLst/></a:prstGeom>'
          + '<a:ln w="' + Math.max(9525, E(sh.sw || 1.6)) + '">'
          + '<a:solidFill><a:srgbClr val="' + col + '">' + alpha + "</a:srgbClr></a:solidFill>"
          + (sh.dash ? '<a:prstDash val="dash"/>' : "")
          + (sh.arrow ? '<a:tailEnd type="triangle" w="med" len="med"/>' : "")
          + "</a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>";
      } else if (sh.t === "text") {
        if (!sh.text) return;
        var k = DG_INK[sh.cls] || DG_INK["dg-sub"];
        var px = k[2];
        var sz = Math.max(600, Math.round(px * sc / 12700 * 100));
        var bw = Math.round(Math.max(sh.text.length * px * 0.62, 20) * sc) + 200000;
        var bh = Math.round(px * 1.6 * sc);
        var bx = Math.round(sh.anchor === "middle" ? X(sh.x) - bw / 2 : X(sh.x));
        var by = Y(sh.y) - Math.round(px * 1.05 * sc);
        out += '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="dg-t' + id + '"/>'
          + '<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>'
          + '<a:xfrm><a:off x="' + bx + '" y="' + by + '"/><a:ext cx="' + bw + '" cy="' + bh + '"/></a:xfrm>'
          + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
          + '<p:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" tIns="0" rIns="0" bIns="0"/><a:lstStyle/>'
          + '<a:p><a:pPr algn="' + (sh.anchor === "middle" ? "ctr" : "l") + '"><a:buNone/></a:pPr>'
          + '<a:r><a:rPr lang="en-GB" sz="' + sz + '"' + (k[1] ? ' b="1"' : "") + ' dirty="0">'
          + '<a:solidFill><a:srgbClr val="' + k[0] + '">' + alpha + "</a:srgbClr></a:solidFill></a:rPr>"
          + "<a:t>" + xesc(sh.text) + "</a:t></a:r></a:p></p:txBody></p:sp>";
      }
    });
    return out;
  }

  function slideXml(s) {
    var body = "";
    var y = 1500000;

    if (s.kicker) {
      body += tx(2, "Kicker", 838200, 700000, W - 1676400, 400000,
        para(s.kicker.toUpperCase(), { sz: 1100, b: true, color: "0E8A6D", bullet: false }));
    }
    body += tx(3, "Title", 838200, s.cls === "sl-title" ? 2300000 : 1050000, W - 1676400, 900000,
      para(s.title, { sz: s.cls === "sl-title" ? 3600 : 2600, b: true, bullet: false }));

    if (s.sub) {
      body += tx(4, "Subtitle", 838200, s.cls === "sl-title" ? 3300000 : 1900000, W - 1676400, 900000,
        para(s.sub, { sz: 1400, color: "51606A", bullet: false }));
      y = s.cls === "sl-title" ? y : 2500000;
    } else {
      y = 2000000;
    }

    var paras = [];
    if (s.bullets) s.bullets.forEach(function (b) { paras.push(para(b, { sz: 1400 })); });
    if (s.groups) {
      s.groups.forEach(function (g) {
        paras.push(para(g.group, { sz: 1300, b: true, bullet: false, color: "51606A" }));
        g.items.forEach(function (t) { paras.push(para(t, { sz: 1300, lvl: 1 })); });
      });
    }
    if (paras.length) body += tx(5, "Body", 838200, y, W - 1676400, H - y - 700000, paras.join(""));

    if (s.diagram) body += diagramXml(s.diagram);

    if (s.foot) {
      body += tx(6, "Footer", 838200, H - 600000, W - 1676400, 350000,
        para(s.foot, { sz: 900, color: "8A97A0", bullet: false }));
    }

    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + "<p:sld " + XMLNS + "><p:cSld><p:spTree>"
      + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
      + "<p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/>"
      + "<a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr>"
      + body
      + "</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>";
  }

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

  function pptx(slides, title) {
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

    slides.forEach(function (s, i) {
      files.push({ name: "ppt/slides/slide" + (i + 1) + ".xml", data: slideXml(s) });
      files.push({ name: "ppt/slides/_rels/slide" + (i + 1) + ".xml.rels",
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
          + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
          + 'relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>' });
    });

    return zip(files);
  }

  /* ---------- XLSX ----------
     Same trick as the .pptx: a workbook is a ZIP of XML. Inline strings keep it to one
     part per sheet with no shared-string table to keep consistent. */

  function colRef(n) {                      /* 0 -> A, 26 -> AA */
    var s = "";
    n += 1;
    while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; }
    return s;
  }

  function cell(ref, v, style) {
    var st = style ? ' s="' + style + '"' : "";
    if (typeof v === "number" && isFinite(v)) {
      return '<c r="' + ref + '"' + st + "><v>" + v + "</v></c>";
    }
    var t = String(v == null ? "" : v);
    if (!t) return '<c r="' + ref + '"' + st + "/>";
    return '<c r="' + ref + '" t="inlineStr"' + st + "><is><t xml:space=\"preserve\">"
      + xesc(t) + "</t></is></c>";
  }

  function sheetXml(sh) {
    var cols = sh.columns || [];
    var colsXml = cols.length
      ? "<cols>" + cols.map(function (c, i) {
          return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (c.width || 22)
            + '" customWidth="1"/>';
        }).join("") + "</cols>"
      : "";

    var rows = [];
    rows.push('<row r="1" ht="20" customHeight="1">'
      + cols.map(function (c, i) { return cell(colRef(i) + "1", c.title, 1); }).join("") + "</row>");

    (sh.rows || []).forEach(function (r, ri) {
      var n = ri + 2;
      rows.push('<row r="' + n + '">'
        + r.map(function (v, ci) { return cell(colRef(ci) + n, v, 2); }).join("") + "</row>");
    });

    var last = colRef(Math.max(cols.length - 1, 0));
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      + '<sheetViews><sheetView workbookViewId="0">'
      + '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
      + "</sheetView></sheetViews>"
      + '<sheetFormatPr defaultRowHeight="15"/>'
      + colsXml
      + "<sheetData>" + rows.join("") + "</sheetData>"
      + '<autoFilter ref="A1:' + last + "1\"/>"
      + "</worksheet>";
  }

  var STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<fonts count="2">'
    + '<font><sz val="11"/><color rgb="FF1F2A30"/><name val="Calibri"/></font>'
    + '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
    + "</fonts>"
    + '<fills count="3"><fill><patternFill patternType="none"/></fill>'
    + '<fill><patternFill patternType="gray125"/></fill>'
    + '<fill><patternFill patternType="solid"><fgColor rgb="FF0E8A6D"/>'
    + '<bgColor indexed="64"/></patternFill></fill></fills>'
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="3">'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" '
    + 'applyAlignment="1"><alignment vertical="center"/></xf>'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">'
    + '<alignment vertical="top" wrapText="1"/></xf>'
    + "</cellXfs>"
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
    + "</styleSheet>";

  /* Excel rejects these characters in a tab name, and caps it at 31. */
  function sheetName(s, used) {
    var n = String(s || "Sheet").replace(/[\[\]\*\/\\\?:]/g, " ").trim().slice(0, 31) || "Sheet";
    var base = n, i = 2;
    while (used[n.toLowerCase()]) { n = (base.slice(0, 28) + " " + i).slice(0, 31); i++; }
    used[n.toLowerCase()] = true;
    return n;
  }

  function xlsx(sheets) {
    var used = {};
    sheets = sheets.map(function (sh) {
      return { name: sheetName(sh.name, used), columns: sh.columns, rows: sh.rows };
    });

    var files = [
      { name: "[Content_Types].xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-'
        + 'officedocument.spreadsheetml.sheet.main+xml"/>'
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-'
        + 'officedocument.spreadsheetml.styles+xml"/>'
        + sheets.map(function (sh, i) {
            return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType='
              + '"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
          }).join("")
        + "</Types>" },

      { name: "_rels/.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        + 'relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },

      { name: "xl/workbook.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
        + sheets.map(function (sh, i) {
            return '<sheet name="' + xesc(sh.name) + '" sheetId="' + (i + 1)
              + '" r:id="rId' + (i + 1) + '"/>';
          }).join("")
        + "</sheets></workbook>" },

      { name: "xl/_rels/workbook.xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + sheets.map(function (sh, i) {
            return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/'
              + 'officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'
              + (i + 1) + '.xml"/>';
          }).join("")
        + '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/'
        + 'officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },

      { name: "xl/styles.xml", data: STYLES }
    ];

    sheets.forEach(function (sh, i) {
      files.push({ name: "xl/worksheets/sheet" + (i + 1) + ".xml", data: sheetXml(sh) });
    });

    return zip(files);
  }

  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
  }

  function safeName(s) {
    return (s || "migration-plan").replace(/[^A-Za-z0-9 _-]+/g, "").trim().replace(/\s+/g, "-") || "migration-plan";
  }

  window.PlannerExport = {
    pptx: function (slides, title) { download(pptx(slides, title), safeName(title) + ".pptx"); },
    drawio: function (xml, title) {
      download(new Blob([xml], { type: "application/xml" }), safeName(title) + ".drawio");
    },
    xlsx: function (sheets, title) { download(xlsx(sheets), safeName(title) + ".xlsx"); },
    _pptxBlob: pptx,     /* exposed for the verify harness */
    _xlsxBlob: xlsx
  };
})();
