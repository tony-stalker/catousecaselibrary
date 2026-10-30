# Diagram kit — authoring guide

Every diagram in the library is drawn with the **platform-overview kit**: the drawing code of the
interactive Cato SASE platform overview (Tony's presenter app), run headless at build time. Pages
receive static, self-contained SVG; nothing of the kit ships at runtime.

```
_extract/diagram-kit/
  kit-host.html        GENERATED (gitignored) by make-kit-host.py from the overview HTML
  make-kit-host.py     re-run when the overview source changes
  export_svg.js        build-time: prune hidden layers, auto-fit labels, x- prefix classes/ids
  port_css.js          build-time: port the figure CSS into the style.css dg-kit block
  glue.css             hand-written page glue (sprite, canvas, spotlight steps, legend, motion)
  specs/<page-id>.js   ONE FILE PER PAGE — the only thing authors edit
_extract/build-diagrams.py   renders specs into pages, CSS, deck pictures
```

## Commands

```bash
python3 _extract/build-diagrams.py --preview /tmp/dg <id>   # render one spec to PNGs (light + dark); no page writes
python3 _extract/build-diagrams.py <id> [<id> …]            # write those pages (+ CSS block, deck pictures)
python3 _extract/build-diagrams.py                          # everything
python3 _extract/build-diagrams.py --check                  # verify.sh: fails on any warning or stale page
python3 _extract/build-diagrams.py --catalogue /tmp/cat     # every source figure as exported, one PNG each
```
After any build: `python3 _extract/build-search.py` (pages changed).

## A spec

```js
/* specs/access-app-connectors.js — Private Access with App Connectors */
DG.page('access-app-connectors', {
  spotlight: {                                   // "Where this sits in the Cato SASE platform"
    hl: ['users', 'pop', 'backbone', 'cloud', 'dc'],   // components lit (others dimmed)
    mods: ['uztna'],                             // module tiles lit: sdwan | sse | uztna | ai
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'r-CR'}, {p: 'cl-aws'}, {p: 'dc1', rev: true}],
    steps: [                                     // 2–4 numbered steps: text under the figure + markers on it
      {t: 'Users connect with the Cato Client or a browser — no VPN, no network access.', marks: ['users']},
      {t: 'The nearest PoP checks identity and posture against the Private Access Policy.', marks: ['pop']},
      {t: 'Authorised sessions reach the app through an outbound-only App Connector.', marks: ['cloud', 'dc']},
    ],
    // heading: 'Where this sits …'              // optional section heading
    // anchors: {cloud: [1296, 262]}            // optional marker position override (viewBox units)
  },
  diagrams: [{
    slot: 'main',                                // main | card-N (Nth diagram-card) | phase-N (Nth phase SVG)
    fig: 'cloudAppc',                            // EITHER a source figure …
    edits: [['outbound only · TLS', 'outbound only · DTLS']],   // … with exact-text corrections (leaf text, exact match)
    drop: [],                                    // leaf texts to remove
    // draw: K => { const {nd, fl, T, cloud, fpin, ring} = K; let s = ''; …; return s; },  // OR your own drawing
    vb: '0 0 760 560',                           // viewBox (defaults to the figure's own)
    view: 'appc',                                // multi-view figures only (dc: socket|ipsec|xc|appc; msvc: all|self|ilmm|noc|mdr|hfm|succ)
    // detailed: true                            // branch: show the addressing layer
    // failed: true                              // HA figures: draw the failed-over state
    title: 'Private Access through App Connectors',            // SVG <title> (a11y + deck slide heading)
    desc: 'Users reach private apps in cloud and data centre through outbound-only App Connectors.',   // <desc> + deck speaker note
    caption: 'One connector group per environment …',          // optional: replaces the page caption
    legend: [['flow', 'Brokered session'], ['https', 'Browser access'], 'live'],   // optional: replaces the legend ([] removes it)
  }],
  // picSlot: 'main'                             // which diagram becomes the deck slide (default main)
});
```

## The spotlight model (the overview, 1600×900)

Components (`hl`): `branch` · `dc` · `users` · `ai` (AI agents & apps) · `cloud` (AWS/Azure/GCP/private) ·
`saas` (Internet, SaaS, GenAI) · `pop` (Cato PoP / SPACE) · `backbone` · `xops` · `mgmt` (CMA) · `msvc`
(managed services). Modules (`mods`): `sdwan` · `sse` · `uztna` · `ai`.

Flows (`flows[].p`, `rev: true` to run towards the edge):
| id | path | id | path |
|---|---|---|---|
| br1 br2 br3 | branch → left PoP (tunnels) | cl-aws | AWS ↔ right PoP (tunnel) |
| dc1 | DC → SPACE (tunnel) | cl-az | Azure (private link) |
| dc2 | DC (IPsec) | cl-gcp | GCP (IPsec) |
| dc3 | DC (private link / interconnect) | cl-pv | private cloud (tunnel) |
| us1 | users → SPACE (Client tunnel) | eg-saas eg-www eg-genai | left PoP → SaaS / internet / GenAI |
| us2 us3 | users (browser / agent HTTPS) | r-LC r-CR r-RL | backbone arcs left→centre→right→left |
| ag1 ag2 | AI agents & apps → right PoP | m1 m2 | modules ↔ SPACE |
| spine | XOps ↔ SPACE | atk | attack path into the left PoP (red) |

Marker anchors (`marks`): `branch` `dc` `users` `ai` `cloud` `saas` `genai` `pop` (SPACE) `popL` `popR`
`backbone` `xops` `mgmt` `msvc`. Two steps on one anchor render as one "1 · 3" pill.

Rules: light only what the page is about (3–6 components); flows must be ones the page's story uses;
step text is UK English, one sentence, ≤ 110 characters, and claims nothing the page does not.

## Source figures (`fig:`) — 760×560 unless noted
branch (HA X1500 pair + LAN; `detailed`, `failed`) · branchLan (LAN firewall VLANs) · sockets (Socket family, 760×568) ·
dc (`view`: socket/ipsec/xc/appc) · users (Universal ZTNA: who, how, trust signals, policies) · cloud (multi-cloud overview) ·
cloudAws · cloudAzure · cloudGcp (reference HA topologies; `failed`) · cloudAppc (App Connectors, cloud + private DC) ·
pop (single-pass engine pipeline, 760×452) · popArch (PoP cloud scale; `failed`) · fwaas · swg · ips · am (anti-malware) ·
sandbox · dns · ztna · casb · dlp · rbi · iot · aisec · ai (multi-view — prefer `aisec` or draw your own) · agentic (Agentic CVE
Mitigation) · agenticAtp (Agentic Threat Prevention) · backbone · backboneChina (760×440) · saas (egress) · xops · mgmt ·
mgmtTenancy (MSP parent/child) · msvc (`view`).
Run `--catalogue` to see each one exactly as it exports. Source figures carry the overview author's facts (checked against
Cato announcements Mar–Jul 2026); every fact on a swapped figure must still agree with the page and its sources — correct
it with `edits`/`drop`, or draw your own.

## Drawing your own (`draw: K => svgString`)
Coordinates are viewBox units. Text is never filled with a lane colour. The primitives (from the overview):

| primitive | draws |
|---|---|
| `nd(x,y,w,h,{t, s:[subs], ic, is, icls, cls:'soft'\|'pop'\|'hot'\|'dash', tcls:'g'})` | node box: title, sub-lines, optional icon |
| `tile(x,y,w,h, icon, title, [subs], {cls, ic2})` | icon tile (icon above, label below) |
| `side(x,y,w,h, title, sub, icon)` | soft side box with icon |
| `popBox(x,y,w,h,title,sub)` | mint "Cato PoP" container |
| `site(x,y,w,h,label)` | dashed site boundary with a mono tag |
| `fpin(x, tipY, r, label, {halo, icon, dim})` | map-pin PoP; `pinTop(tipY,r)` = its top |
| `ring({cx,cy,rx,ry}, label)` | backbone tube; `fy(R,x)` / `by(R,x)` = front / back y at x |
| `cloud(cx,cy,k,label,sub,cls:'ai'\|'bad')` | cloud shape (k≈.6–.9) |
| `fl(d, cls, {arrow:true\|'arr-m'\|'arr-n'\|'arr-y', label, lx, ly, lcls, dur, n, np:0, g})` | flow path with moving particles (np:0 = static) |
| `pill(cx,cy,text,cls)` | pill label: '' · g (green) · y (amber) · r (red) · p (purple, RBI) · b (blue) · m (mono) |
| `chips(x,y,[labels],w,h,gap,cols,cls)` · `chipRow(x,y,[labels],w,h,gap,cls)` | chip grids / rows (cls 'g' = mint) |
| `tier(x,y,'SECTION LABEL')` | small mono section label |
| `T(x,y,text,cls,anchor)` · `TL(x,y,[lines],cls,anchor,lh)` | text: nd-t (bold) · nd-s · f-h (mint heading) · f-t · f-s · f-m (mono) · t-cloud |
| `R(x,y,w,h,cls,rx)` · `I(icon,x,y,size,'ic g')` · `L(x1,y1,x2,y2)` | raw rect / icon / line path |
| `badge(x,y,n)` · `mark(x,y,'ok'\|'no'\|'warn'\|'info')` · `xmark(x,y)` · `okRow(x,y,w,label,ok)` | numbered badge, verdict marks |
| `device(x,y,w,h)` · `sock(x,y,model)` · `socketIcon(x,y,w)` · `socketX1600` · `socketX1700` · `vsockBox(x,y)` | hardware |
| `doc(x,y,w,h,[[line,dx,w,'ok'\|'no']])` | mini document with highlighted spans |
| `cloudTop()` | the standard "CATO SASE CLOUD" header: ring + PoP pin + SPACE label (y 0–110) |

Line classes for `fl`: `fl-tun` (encrypted tunnel) · `fl-ipsec` · `fl-priv` (private link) · `fl-https` (browser/agent) ·
`fl-flow` (generic) · `fl-ha` (amber, HA/standby) · `fl-net` (LAN/underlay) · `fl-hot` (highlight) · `fl-dim` (fade) ·
`fl-down` (red, blocked/failed) · `fl-attack` (red dashed).
Icons: building server laptop phone browser ext sbrowser user users globe lock firewall plug cam console db gpu wifi cell
shield ai agent chat code cpu route key chart eye file factory switch xc check bolt appc.

Look at the source FIGS in kit-host.html (search `const FIGS`) for worked examples of every primitive.

## Rules
- The page's story, not a generic picture: same nodes and flows the page's prose and runbook describe.
- ≤ 14 nodes; generous spacing; nothing overlaps; labels fit (the build auto-fits ≤ 20% and warns beyond — reword).
- Facts: only what the page (and its brief/KB sources) states. UK English. No customer names, no real tenant site names
  (archetypes: London DC, Manchester DC, Bristol Office, AWS eu-west-2 …). Vendor logos are not available in the kit —
  name the incumbent in text (the planner keeps its own logo registry).
- Journeys (`phase-N`): every phase uses the same viewBox and the same coordinates for the same node.
- Always `--preview` and LOOK at both themes before handing over.
