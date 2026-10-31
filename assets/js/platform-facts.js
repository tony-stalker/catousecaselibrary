/* Cato Use Case Library — platform facts, single source (file:// safe, no fetch).
   Pages reference a fact with data-fact="«key»" on any element (HTML spans, figcaptions,
   SVG <text>/<tspan>); app.js replaces the element's text with the value at load. Keep the
   current value in the markup as the no-JS fallback. Change a number HERE, not in pages.
   Every value carries its source and the date it was checked; recheck semi-annually
   (register: _extract/STALENESS.md). Ships unchanged in the prospect edition. */
window.UC_FACTS = {
  pops: "100+",
  backboneSla: "99.999%",
  customers: "4,800+",
  mq: "Leader — 2026 Gartner Magic Quadrant for SASE Platforms (third consecutive year)",
  mqShort: "Gartner MQ Leader, 3 years running",
  mqCitation: "Gartner, Magic Quadrant for SASE Platforms, Jonathan Forest, Andrew Lerner, John Watts, 28 July 2026",
  asOf: "2026-10-30",
  asOfLabel: "30 Oct 2026",
  sources: {
    customers: {
      claim: "Cato Networks now serves more than 4,800 customers",
      url: "https://www.prnewswire.com/il/news-releases/cato-networks-exceeds-415m-in-arr-fueled-by-42-yoy-growth-and-enterprise-demand-302833667.html",
      published: "2026-07-27", checked: "2026-10-31", status: "verified"
    },
    mq: {
      claim: "named a Leader in the 2026 Gartner Magic Quadrant for SASE Platforms for the third consecutive year (report dated 28 Jul 2026)",
      url: "https://www.prnewswire.com/il/news-releases/cato-networks-named-a-leader-in-the-2026-gartner-magic-quadrant-for-sase-platforms-for-the-third-consecutive-year-302839193.html",
      published: "2026-07-31", checked: "2026-10-31", status: "verified"
    },
    backboneSla: {
      claim: "99.999% uptime SLA on the global private backbone (PoP-to-PoP; KB wording is 'up to 99.999% availability')",
      url: "https://www.catonetworks.com/platform/global-private-backbone/",
      corroboration: "https://knowledge.catonetworks.com/docs/private-pop-overview-for-customers",
      checked: "2026-10-30", status: "verified (site read in a browser; KB fetched 31 Oct 2026)"
    },
    pops: {
      claim: "100+ PoPs worldwide (headline count may include limited-availability PoPs)",
      url: "https://www.catonetworks.com/platform/global-private-backbone/",
      checked: "2026-10-30", status: "verified (site read in a browser 30 Oct 2026; not machine-fetchable — see _extract/research-briefs/platform-facts.md §3)"
    }
  }
};
