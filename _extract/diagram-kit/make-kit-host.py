#!/usr/bin/env python3
"""make-kit-host.py — turn the interactive platform-overview HTML into the diagram kit host.

Usage: python3 _extract/diagram-kit/make-kit-host.py <cato-interactive-platform-overview.html>

The source is a self-contained presenter app (Tony's platform overview). The library never
ships it; it is only loaded headless at BUILD time so its drawing code renders our diagrams.
This script:
  - drops the translation table (1.7 MB) and the embedded web fonts (the library is
    system-font only; text is measured with the library's own font stack)
  - injects window.__KIT: the drawing primitives (K), the source figures (FIGS), the
    overview model (COMPONENTS, LINKS, PATHS, ANCHORS) plus mountSpec() and spotlight()
Writes _extract/diagram-kit/kit-host.html next to this script (gitignored — regenerate from the
source). Re-run when the source changes, then `python3 _extract/build-diagrams.py`.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LIB = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

API = r'''
/* ==== DIAGRAM-KIT EXPORT (injected by make-kit-host.py — library build only) ==== */
window.__KIT = (function(){
  const K = {T,TL,Tx,R,I,L,tw,pill,hoist,pinPath,CLOUD,cloud,device,badge,chipRow,particles,socketIcon,socketX1600,socketX1700,
    card,iconTile,fl,nd,chips,popBox,tier,apps,ring,fpin,pinTop,side,site,tile,sock,xmark,okRow,mark,doc,cloudTop,vsockBox,azBox,tunnels,bottomBox,
    engHead,engFeat,fy,by,esc,tr,ENGINES,SPACE_ENGINES,ENGINE_KEYS};
  function mountSpec(fn, host, vb, label){
    FIG_FLOWS=[]; FIG_TP=0; const inner=hoist(typeof fn==='string' ? FIGS[fn]() : fn(K));
    host.innerHTML=`<svg class="fig" viewBox="${vb}" role="img" aria-label="${esc(label||'')}">${inner}</svg>`;
    const svg=host.querySelector('svg');
    FIG_FLOWS.forEach(({id,o})=>{ if(o.np===0) return; const p=svg.querySelector('#'+id); if(!p) return; const len=p.getTotalLength();
      p.insertAdjacentHTML('afterend',particles(id,len,{speed:len/(o.dur||2.2),n:o.n||(len>220?2:1),cls:'fpt',prefix:'',r:2.8,pcls:o.pcls})); });
    return svg; }
  function spotlight(cfg, host){
    host.innerHTML = overviewSVG(); const sv = host.querySelector('svg');
    let p=''; LINKS.forEach(([id])=>{ const el=sv.querySelector('#p-'+id); if(!el) return; const len=el.getTotalLength(); const ringL=id.startsWith('r-');
      p+=particles(id,len,{speed:ringL?120:95, n:ringL?(id==='r-RL'?5:3):(len>150?2:1), rev:false, pcls:id==='atk'?'pt red':'pt'}); });
    const pts=sv.querySelector('#pts'); if(pts) pts.innerHTML=p;
    sv.querySelectorAll('.pt-g').forEach(g=>{ if(SIMPLE_ONLY.has(g.dataset.p)) g.classList.add('ov-simple'); });
    sv.querySelectorAll('.enter').forEach(e=>e.classList.remove('enter'));
    if(cfg){
      const comps=cfg.hl||[], mods=cfg.mods||[], linkIds=(cfg.flows||[]).map(f=>f.p);
      sv.classList.add('focus-mode');
      if(linkIds.includes('atk')) sv.classList.add('attack');   /* the attack path only exists in the source's attack view */
      sv.querySelectorAll('.cmp').forEach(g=>{ const c=g.dataset.c; g.classList.toggle('hl', c.startsWith('mod-')?mods.includes(c.slice(4)):comps.includes(c)); });
      sv.querySelectorAll('.lk').forEach(l=>l.classList.toggle('hl',linkIds.includes(l.dataset.p)));
      sv.querySelectorAll('.pt-g').forEach(l=>l.classList.toggle('hl',linkIds.includes(l.dataset.p)));
      let s=''; (cfg.flows||[]).forEach(f=>{ const a=f.p==='atk'?' ucl-atk':''; if(PATHS[f.p]) s+=`<path d="${PATHS[f.p]}" class="ucl-glow${a}"/><path d="${PATHS[f.p]}" class="ucl${a}"/>`; });
      (cfg.flows||[]).forEach((f,i)=>{ const el=sv.querySelector('#p-'+f.p); if(!el) return; const len=el.getTotalLength();
        s+=particles(f.p,len,{speed:210,n:f.p==='r-RL'?5:Math.max(2,Math.round(len/90)),rev:!!f.rev,cls:'uc-pts',pcls:f.p==='atk'?'ucpt red':'ucpt',r:3.6,phase:i*.13}); });
      const uf=sv.querySelector('#ucflow'); if(uf) uf.innerHTML=s;
      /* step markers: the source anchors, with 'cloud' moved off its heading; a spec may override any anchor */
      /* defaults moved off the headings they used to cover (found by visual QA across many pages):
         mgmt sat on 'Terraform & API', saas on 'direct-to-cloud', cloud on its own heading index */
      const A=Object.assign({}, ANCHORS, {cloud:[1296,262], mgmt:[782,132], saas:[302,310]}, cfg.anchors||{});
      const by={}; (cfg.steps||[]).forEach((st,k)=>(st.marks||[]).forEach(a=>{ (by[a]=by[a]||[]).push(k); }));
      let m=''; Object.entries(by).forEach(([a,ks])=>{ if(!A[a]) return; const [x,y]=A[a]; const lab=ks.map(k=>k+1).join(' · '); const w=ks.length>1?18+lab.length*8:30;
        m+=`<g class="mark" transform="translate(${x} ${y})">`+(ks.length>1?`<rect x="${-w/2}" y="-15" width="${w}" height="30" rx="15" class="ring"/><rect x="${-w/2}" y="-15" width="${w}" height="30" rx="15"/>`:`<circle r="15" class="ring"/><circle r="15"/>`)+T(0,5.5,lab,'','middle')+`</g>`; });
      const mk=sv.querySelector('#marks'); if(mk) mk.innerHTML=m;
    }
    return sv; }
  return {K, FIGS, FIG_VB, COMPONENTS, USE_CASES, MODULES, LINKS, PATHS, ANCHORS, BBOX, mountSpec, spotlight};
})();
'''


def main(src_path):
    src = Path(src_path).read_text(encoding="utf-8")
    scripts = list(re.finditer(r'<script[^>]*>.*?</script>', src, re.S))
    i18n = [m for m in scripts if "@@I18N-START" in m.group(0)[:400]]
    if i18n:
        m = i18n[0]
        src = src[:m.start()] + src[m.end():]
    src = re.sub(r'@font-face\{[^}]*\}\s*', '', src)
    src = re.sub(r"--display:'Manrope'[^;]*;", f"--display:{LIB};", src, count=1)
    src = re.sub(r"--body:'IBM Plex Sans'[^;]*;", f"--body:{LIB};", src, count=1)
    src = re.sub(r"--mono:'IBM Plex Mono'[^;]*;", f"--mono:{MONO};", src, count=1)
    marker = "/* ---------- language ----------"
    if src.count(marker) != 1:
        sys.exit("make-kit-host: injection marker not found — the source layout changed; update the API anchor")
    src = src.replace(marker, API + marker)
    out = HERE / "kit-host.html"
    out.write_text(src, encoding="utf-8")
    print(f"kit-host.html written ({len(src) // 1024} KB)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
