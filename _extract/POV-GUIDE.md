# PoV Runbook Guide — the `#pov` section contract

Every use-case page can carry a PoV runbook as a second tab beside the demo runbook.
The tab bar is **injected by app.js** when a page has BOTH `section#demo` and
`section#pov` — you write NO tab markup. Without JS (and in print) the two sections
simply stack; the prospect generator strips `#pov` entirely (figures salvaged).

## Markup contract

Place the section **immediately after** `</section>` of `id="demo"` and before
resources/talk-track:

```html
<section id="pov" class="reveal">
  <div class="section-kicker">PoV runbook</div>
  <h2>How to prove it in the customer's tenant</h2>
  ...content...
</section>
```

Rules: `id="pov"` exactly (drives the tab, the TOC entry, `#pov` deep links and the
prospect strip). Use ONLY classes that exist in `assets/css/style.css`. UK English.
No customer names, no real tenant site names, `&lt;your-account-id&gt;` placeholders.

## Content anatomy (adapt, don't force — this is the reviewed pilot shape)

1. **Success criteria** — `.table-wrap > table.data`: 3–6 measurable criteria agreed
   with the customer up front (what will be demonstrated, the evidence artefact, where
   it lives in the CMA). Frame per the PoV framework page: agree criteria BEFORE
   configuring anything; link `management-pov-framework.html`.
2. **Prerequisites** — `.callout`: licences/modules needed, TLS inspection staged first
   where content inspection matters (link `security-tls-inspection.html`), identity
   integration state, socket/client scope of the PoV.
3. **Configuration walkthrough** — `<ol class="steps">`, each step with a CMA
   `.path` chip and concrete settings. Every capability claim verified against
   knowledge.catonetworks.com (fetch the .md variant via /llms.txt; link the page URL).
   Config examples in `pre.code` where CLI/API applies. Monitor-first discipline:
   nothing blocks until events prove it.
4. **What good output looks like** — embed existing `assets/img` screenshots where the
   catalogue recommends the subject (fresh captions for the PoV angle). Where the right
   config/output capture does not exist yet, add an HTML comment
   `<!-- capture-wanted: «CMA screen» -->` at that spot and list it in your report.
5. **Troubleshooting** — `.grid-2` of `.benefit` blocks or a table: the 4–6 things that
   actually go wrong (KB-sourced where possible: ports, TLSi exclusions, identity sync
   lag, socket ordering), each with the check and the fix.
6. **Gotchas & exit** — honest caveats (licensing boundaries, retention windows,
   feature scope) and how to unwind PoV config cleanly at the end.

## Self-check (mandatory, same as BUILD-GUIDE)

`python3 _extract/shoot.py usecases/«page».html _extract/shot-«id»-pov.png` with NO
console errors — then ALSO screenshot with the PoV tab active (append `#pov` to the
URL) and READ it; `python3 _extract/measure_svg.py` silent; every href/src exists;
`python3 _extract/build-search.py` is run by the coordinator after batches, not by you.
